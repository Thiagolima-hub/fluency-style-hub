import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { CONFIG_PADRAO, type ConfigLoja } from "@/lib/loja";

function supabasePublic() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

const COLS =
  "id, codigo, marca, nome, slug, categoria, tamanho, condicao, preco, preco_parcelado_texto, descricao, medidas, status, destaque, ordem, created_at, produto_imagens(url, ordem)";

export type ProdutoComImagens = NonNullable<Awaited<ReturnType<typeof fetchLista>>>[number];

async function fetchLista(opts?: {
  limite?: number | undefined;
  destaque?: boolean | undefined;
  excluirSlug?: string | undefined;
}) {
  const sb = supabasePublic();
  let q = sb.from("produtos").select(COLS);
  if (opts?.destaque) q = q.eq("destaque", true);
  if (opts?.excluirSlug) q = q.neq("slug", opts.excluirSlug);
  // disponíveis e reservados primeiro, vendidos por último
  q = q
    .order("status", { ascending: true })
    .order("ordem", { ascending: true })
    .order("created_at", { ascending: false });
  if (opts?.limite) q = q.limit(opts.limite);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return (data ?? []).map((p) => ({
    ...p,
    produto_imagens: [...(p.produto_imagens ?? [])].sort((a, b) => a.ordem - b.ordem),
  }));
}

export const listarProdutos = createServerFn({ method: "GET" })
  .inputValidator(
    (input) =>
      z
        .object({
          limite: z.number().optional(),
          destaque: z.boolean().optional(),
        })
        .optional()
        .parse(input),
  )
  .handler(async ({ data }) => fetchLista(data));

export const listarRecentes = createServerFn({ method: "GET" }).handler(async () =>
  fetchLista({ limite: 8 }),
);

export const listarDestaques = createServerFn({ method: "GET" }).handler(async () =>
  fetchLista({ destaque: true, limite: 6 }),
);

export const obterProduto = createServerFn({ method: "GET" })
  .inputValidator((input) => z.object({ slug: z.string() }).parse(input))
  .handler(async ({ data }) => {
    const sb = supabasePublic();
    const { data: p, error } = await sb
      .from("produtos")
      .select(COLS)
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!p) return null;
    return {
      ...p,
      produto_imagens: [...(p.produto_imagens ?? [])].sort((a, b) => a.ordem - b.ordem),
    };
  });

export const listarRelacionados = createServerFn({ method: "GET" })
  .inputValidator((input) =>
    z.object({ slug: z.string(), categoria: z.string() }).parse(input),
  )
  .handler(async ({ data }) => {
    const sb = supabasePublic();
    const { data: rows, error } = await sb
      .from("produtos")
      .select(COLS)
      .eq("categoria", data.categoria)
      .neq("slug", data.slug)
      .neq("status", "vendido")
      .order("created_at", { ascending: false })
      .limit(4);
    if (error) throw new Error(error.message);
    return (rows ?? []).map((p) => ({
      ...p,
      produto_imagens: [...(p.produto_imagens ?? [])].sort((a, b) => a.ordem - b.ordem),
    }));
  });

export const obterConfiguracoes = createServerFn({ method: "GET" }).handler(
  async (): Promise<ConfigLoja> => {
    const sb = supabasePublic();
    const { data } = await sb.from("configuracoes").select("chave, valor");
    const mapa = Object.fromEntries((data ?? []).map((r) => [r.chave, r.valor ?? ""]));
    return { ...CONFIG_PADRAO, ...mapa } as ConfigLoja;
  },
);
