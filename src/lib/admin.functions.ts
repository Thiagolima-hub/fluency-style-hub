import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const pecaInput = z.object({
  id: z.string().uuid().optional(),
  codigo: z.string().min(1),
  marca: z.string().min(1),
  nome: z.string().min(1),
  slug: z.string().min(1),
  categoria: z.string().min(1),
  tamanho: z.string().min(1),
  condicao: z.string().min(1),
  preco: z.number().positive(),
  preco_parcelado_texto: z.string().nullish(),
  descricao: z.string().nullish(),
  medidas: z.string().nullish(),
  status: z.enum(["disponivel", "reservado", "vendido"]),
  destaque: z.boolean(),
  ordem: z.number().int(),
});

export const salvarPeca = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => pecaInput.parse(input))
  .handler(async ({ data, context }) => {
    const { id, ...resto } = data;
    const campos = {
      ...resto,
      preco_parcelado_texto: resto.preco_parcelado_texto ?? null,
      descricao: resto.descricao ?? null,
      medidas: resto.medidas ?? null,
    };
    if (id) {
      const { error } = await context.supabase.from("produtos").update(campos).eq("id", id);
      if (error) throw new Error(error.message);
      return { id };
    }
    const { data: row, error } = await context.supabase
      .from("produtos")
      .insert(campos)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const apagarPeca = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("produtos").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const mudarStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["disponivel", "reservado", "vendido"]),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("produtos")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const registrarImagem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        produto_id: z.string().uuid(),
        url: z.string().min(1),
        ordem: z.number().int(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("produto_imagens")
      .insert(data)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const removerImagem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ id: z.string().uuid(), url: z.string() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("produto_imagens").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    // remove o arquivo do bucket quando for caminho interno
    if (!data.url.startsWith("http") && !data.url.startsWith("/")) {
      await context.supabase.storage.from("produtos").remove([data.url]);
    }
    return { ok: true };
  });

export const reordenarImagens = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .array(z.object({ id: z.string().uuid(), ordem: z.number().int() }))
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    for (const img of data) {
      const { error } = await context.supabase
        .from("produto_imagens")
        .update({ ordem: img.ordem })
        .eq("id", img.id);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const salvarConfiguracao = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ chave: z.string().min(1), valor: z.string() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("configuracoes")
      .upsert({ chave: data.chave, valor: data.valor });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** Apaga TODAS as peças (usado pelo botão "Limpar peças de exemplo" no painel). */
export const limparTodasPecas = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: imgs } = await context.supabase.from("produto_imagens").select("url");
    const arquivos = (imgs ?? [])
      .map((i) => i.url)
      .filter((u) => u && !u.startsWith("http") && !u.startsWith("/"));
    if (arquivos.length > 0) await context.supabase.storage.from("produtos").remove(arquivos);
    const { error } = await context.supabase
      .from("produtos")
      .delete()
      .not("id", "is", null);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
