import { useMemo, useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn as useFn } from "@tanstack/react-start";
import {
  GripVertical,
  ImagePlus,
  Loader2,
  LogOut,
  Pencil,
  Plus,
  Search,
  Settings2,
  Shirt,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import {
  apagarPeca,
  mudarStatus,
  registrarImagem,
  removerImagem,
  reordenarImagens,
  salvarConfiguracao,
  salvarPeca,
} from "@/lib/admin.functions";
import { listarProdutos, obterConfiguracoes } from "@/lib/catalogo.functions";
import {
  CATEGORIAS,
  CONDICOES,
  STATUS,
  formatPreco,
  imgSrc,
  slugPeca,
  type ConfigLoja,
} from "@/lib/loja";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/site-header";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [{ title: "Painel — FLUENCY COLLECTION" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminPage,
});

type ImagemForm = { id?: string; url: string; file?: File; preview?: string };

const FORM_VAZIO = {
  codigo: "",
  marca: "",
  nome: "",
  categoria: "camiseta",
  tamanho: "",
  condicao: "seminova" as string,
  preco: "",
  preco_parcelado_texto: "",
  descricao: "",
  medidas: "",
  status: "disponivel" as "disponivel" | "reservado" | "vendido",
  destaque: false,
};

function AdminPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [aba, setAba] = useState<"pecas" | "nova" | "config">("pecas");
  const [editando, setEditando] = useState<any | null>(null);

  const { data: pecas, isLoading } = useQuery({
    queryKey: ["admin-produtos"],
    queryFn: () => listarProdutos(),
  });
  const { data: config } = useQuery({
    queryKey: ["admin-config"],
    queryFn: () => obterConfiguracoes(),
  });

  async function sair() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  function abrirEdicao(peca: any) {
    setEditando(peca);
    setAba("nova");
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      <header className="glass sticky top-0 z-40">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Logo />
          <div className="flex items-center gap-1">
            {(
              [
                ["pecas", "Peças", Shirt],
                ["nova", editando ? "Editando" : "Nova peça", Plus],
                ["config", "Configurações", Settings2],
              ] as const
            ).map(([v, r, Icon]) => (
              <button
                key={v}
                onClick={() => { setAba(v); if (v === "nova") setEditando(null); }}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-2 text-[12px] transition-colors",
                  aba === v ? "bg-primary text-primary-foreground" : "text-body hover:text-white",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{r}</span>
              </button>
            ))}
            <button
              onClick={sair}
              className="ml-1 flex items-center gap-1.5 rounded-full px-3 py-2 text-[12px] text-body hover:text-white"
              aria-label="Sair"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-6">
        {aba === "pecas" && (
          <ListaPecas
            pecas={pecas ?? []}
            carregando={isLoading}
            onEditar={abrirEdicao}
          />
        )}
        {aba === "nova" && (
          <FormPeca
            editando={editando}
            onSalvo={() => {
              setEditando(null);
              setAba("pecas");
              queryClient.invalidateQueries({ queryKey: ["admin-produtos"] });
              queryClient.invalidateQueries({ queryKey: ["produtos"] });
            }}
          />
        )}
        {aba === "config" && config && <FormConfig config={config} />}
      </main>
    </div>
  );
}

/* ---------------- Lista ---------------- */

function ListaPecas({
  pecas,
  carregando,
  onEditar,
}: {
  pecas: any[];
  carregando: boolean;
  onEditar: (p: any) => void;
}) {
  const queryClient = useQueryClient();
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const mudarStatusFn = useFn(mudarStatus);
  const apagarFn = useFn(apagarPeca);

  const filtradas = useMemo(() => {
    const q = busca.toLowerCase();
    return pecas.filter(
      (p) =>
        (!filtroStatus || p.status === filtroStatus) &&
        (!q || `${p.codigo} ${p.marca} ${p.nome}`.toLowerCase().includes(q)),
    );
  }, [pecas, busca, filtroStatus]);

  async function alternarStatus(id: string, status: string) {
    const proximo = status === "disponivel" ? "reservado" : status === "reservado" ? "vendido" : "disponivel";
    try {
      await mudarStatusFn({ data: { id, status: proximo } });
      queryClient.invalidateQueries({ queryKey: ["admin-produtos"] });
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
      toast.success(`Status: ${STATUS.find((s) => s.valor === proximo)?.rotulo}`);
    } catch {
      toast.error("Não foi possível mudar o status.");
    }
  }

  async function apagar(id: string) {
    if (!confirm("Apagar esta peça definitivamente?")) return;
    try {
      await apagarFn({ data: { id } });
      queryClient.invalidateQueries({ queryKey: ["admin-produtos"] });
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
      toast.success("Peça apagada.");
    } catch {
      toast.error("Não foi possível apagar.");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <div className="glass flex flex-1 items-center gap-2 rounded-full px-4">
          <Search className="h-4 w-4 text-body" />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por código, marca ou nome"
            className="h-10 w-full bg-transparent text-sm text-white placeholder:text-white/35 focus:outline-none"
          />
        </div>
        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          className="h-10 rounded-full border border-white/10 bg-surface px-3.5 text-[13px] text-white focus:outline-none"
          aria-label="Filtrar por status"
        >
          <option value="">Todos</option>
          {STATUS.map((s) => (
            <option key={s.valor} value={s.valor}>{s.rotulo}</option>
          ))}
        </select>
      </div>

      {carregando ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-cyan" />
        </div>
      ) : filtradas.length === 0 ? (
        <p className="glass rounded-2xl py-14 text-center text-sm text-body">Nenhuma peça encontrada.</p>
      ) : (
        <ul className="space-y-2">
          {filtradas.map((p) => {
            const statusInfo = STATUS.find((s) => s.valor === p.status)!;
            return (
              <li key={p.id} className="glass flex items-center gap-3 rounded-2xl p-2.5">
                <img
                  src={imgSrc(p.produto_imagens[0]?.url)}
                  alt=""
                  className={cn("h-12 w-12 rounded-xl object-cover", p.status === "vendido" && "grayscale")}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-white">
                    <span className="text-cyan/80">{p.codigo}</span> · {p.marca} {p.nome}
                  </p>
                  <p className="text-[11px] text-body">
                    Tam. {p.tamanho} · {formatPreco(p.preco)}
                  </p>
                </div>
                <button
                  onClick={() => alternarStatus(p.id, p.status)}
                  title="Toque para alternar o status"
                  className={cn(
                    "rounded-full px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider transition-transform active:scale-95",
                    p.status === "disponivel" && "bg-cyan/15 text-cyan",
                    p.status === "reservado" && "bg-brand/25 text-white",
                    p.status === "vendido" && "bg-white/10 text-white/50",
                  )}
                >
                  {statusInfo.rotulo}
                </button>
                <button onClick={() => onEditar(p)} className="rounded-full p-2 text-body hover:text-white" aria-label="Editar">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => apagar(p.id)} className="rounded-full p-2 text-body hover:text-destructive" aria-label="Apagar">
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* ---------------- Formulário ---------------- */

function FormPeca({ editando, onSalvo }: { editando: any | null; onSalvo: () => void }) {
  const [form, setForm] = useState(() =>
    editando
      ? {
          codigo: editando.codigo,
          marca: editando.marca,
          nome: editando.nome,
          categoria: editando.categoria,
          tamanho: editando.tamanho,
          condicao: editando.condicao,
          preco: String(editando.preco),
          preco_parcelado_texto: editando.preco_parcelado_texto ?? "",
          descricao: editando.descricao ?? "",
          medidas: editando.medidas ?? "",
          status: editando.status,
          destaque: editando.destaque,
        }
      : FORM_VAZIO,
  );
  const [imagens, setImagens] = useState<ImagemForm[]>(
    editando?.produto_imagens?.map((i: any) => ({ id: i.id, url: i.url })) ?? [],
  );
  const [salvando, setSalvando] = useState(false);
  const inputFile = useRef<HTMLInputElement>(null);
  const arrastando = useRef<number | null>(null);

  const salvarFn = useFn(salvarPeca);
  const registrarFn = useFn(registrarImagem);
  const removerFn = useFn(removerImagem);
  const reordenarFn = useFn(reordenarImagens);

  function set(campo: string, valor: unknown) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  function adicionarArquivos(files: FileList | null) {
    if (!files) return;
    const novas = Array.from(files).map((file) => ({
      url: "",
      file,
      preview: URL.createObjectURL(file),
    }));
    setImagens((imgs) => [...imgs, ...novas]);
  }

  function mover(de: number, para: number) {
    setImagens((imgs) => {
      const copia = [...imgs];
      const [item] = copia.splice(de, 1);
      copia.splice(para, 0, item!);
      return copia;
    });
  }

  async function remover(idx: number) {
    const img = imagens[idx]!;
    if (img.id) {
      try {
        await removerFn({ data: { id: img.id, url: img.url } });
      } catch {
        toast.error("Não foi possível remover a foto.");
        return;
      }
    }
    setImagens((imgs) => imgs.filter((_, i) => i !== idx));
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    if (!form.codigo || !form.marca || !form.nome || !form.tamanho || !form.preco) {
      toast.error("Preencha código, marca, nome, tamanho e preço.");
      return;
    }
    setSalvando(true);
    try {
      const slug = slugPeca(form.marca, form.nome, form.codigo);
      const { id } = await salvarFn({
        data: {
          ...(editando ? { id: editando.id } : {}),
          codigo: form.codigo,
          marca: form.marca,
          nome: form.nome,
          slug,
          categoria: form.categoria,
          tamanho: form.tamanho,
          condicao: form.condicao,
          preco: Number(form.preco.replace(",", ".")),
          preco_parcelado_texto: form.preco_parcelado_texto || null,
          descricao: form.descricao || null,
          medidas: form.medidas || null,
          status: form.status,
          destaque: form.destaque,
          ordem: editando?.ordem ?? 0,
        },
      });

      // upload das fotos novas direto pelo cliente autenticado
      const finais: ImagemForm[] = [];
      for (const img of imagens) {
        if (img.file) {
          const ext = img.file.name.split(".").pop() ?? "jpg";
          const caminho = `${id}/${crypto.randomUUID()}.${ext}`;
          const { error } = await supabase.storage.from("produtos").upload(caminho, img.file, {
            cacheControl: "31536000",
            upsert: false,
          });
          if (error) throw new Error(error.message);
          const { id: imgId } = await registrarFn({
            data: { produto_id: id, url: caminho, ordem: 0 },
          });
          finais.push({ id: imgId, url: caminho });
        } else {
          finais.push(img);
        }
      }
      await reordenarFn({
        data: finais.map((img, i) => ({ id: img.id!, ordem: i })),
      });

      toast.success(editando ? "Peça atualizada." : "Peça cadastrada.");
      onSalvo();
    } catch (err: any) {
      toast.error(err?.message ?? "Erro ao salvar.");
    } finally {
      setSalvando(false);
    }
  }

  const inputCls =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-brand focus:outline-none";
  const labelCls = "mb-1.5 block text-[11px] uppercase tracking-[0.2em] text-body";

  return (
    <form onSubmit={salvar} className="space-y-5">
      <h2 className="text-lg text-white">
        {editando ? `Editando ${editando.codigo}` : "Nova peça"}
      </h2>

      {/* Fotos */}
      <div>
        <span className={labelCls}>Fotos — a primeira é a capa · arraste para reordenar</span>
        <div className="flex flex-wrap gap-2.5">
          {imagens.map((img, i) => (
            <div
              key={img.id ?? img.preview}
              draggable
              onDragStart={() => (arrastando.current = i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (arrastando.current !== null) mover(arrastando.current, i);
                arrastando.current = null;
              }}
              className="group relative h-24 w-24 cursor-grab overflow-hidden rounded-xl border border-white/10 active:cursor-grabbing"
            >
              <img src={img.preview ?? imgSrc(img.url)} alt={`Foto ${i + 1}`} className="h-full w-full object-cover" />
              {i === 0 && (
                <span className="absolute left-1 top-1 rounded-full bg-brand px-1.5 py-0.5 text-[8px] font-semibold uppercase text-white">
                  Capa
                </span>
              )}
              <span className="absolute bottom-1 left-1 text-white/60">
                <GripVertical className="h-3.5 w-3.5" />
              </span>
              <button
                type="button"
                onClick={() => remover(i)}
                aria-label="Remover foto"
                className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white opacity-100 md:opacity-0 md:group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => inputFile.current?.click()}
            className="glass flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-xl text-body transition-colors hover:text-white"
          >
            <ImagePlus className="h-5 w-5" />
            <span className="text-[10px]">Adicionar</span>
          </button>
          <input
            ref={inputFile}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => {
              adicionarArquivos(e.target.files);
              e.target.value = "";
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div>
          <label className={labelCls} htmlFor="f-codigo">Código</label>
          <input id="f-codigo" className={inputCls} value={form.codigo} onChange={(e) => set("codigo", e.target.value)} placeholder="FC-007" />
        </div>
        <div>
          <label className={labelCls} htmlFor="f-marca">Marca</label>
          <input id="f-marca" className={inputCls} value={form.marca} onChange={(e) => set("marca", e.target.value)} placeholder="Prada" />
        </div>
        <div className="col-span-2">
          <label className={labelCls} htmlFor="f-nome">Nome</label>
          <input id="f-nome" className={inputCls} value={form.nome} onChange={(e) => set("nome", e.target.value)} placeholder="Camisa Nylon Preta" />
        </div>
        <div>
          <label className={labelCls} htmlFor="f-categoria">Categoria</label>
          <select id="f-categoria" className={inputCls} value={form.categoria} onChange={(e) => set("categoria", e.target.value)}>
            {CATEGORIAS.map((c) => (
              <option key={c.valor} value={c.valor}>{c.rotulo}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls} htmlFor="f-tamanho">Tamanho</label>
          <input id="f-tamanho" className={inputCls} value={form.tamanho} onChange={(e) => set("tamanho", e.target.value)} placeholder="M / 42 / G" />
        </div>
        <div>
          <label className={labelCls} htmlFor="f-condicao">Condição</label>
          <select id="f-condicao" className={inputCls} value={form.condicao} onChange={(e) => set("condicao", e.target.value)}>
            {CONDICOES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls} htmlFor="f-status">Status</label>
          <select id="f-status" className={inputCls} value={form.status} onChange={(e) => set("status", e.target.value)}>
            {STATUS.map((s) => (
              <option key={s.valor} value={s.valor}>{s.rotulo}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls} htmlFor="f-preco">Preço à vista (R$)</label>
          <input id="f-preco" className={inputCls} inputMode="decimal" value={form.preco} onChange={(e) => set("preco", e.target.value)} placeholder="1900" />
        </div>
        <div className="col-span-2 md:col-span-3">
          <label className={labelCls} htmlFor="f-parcela">Texto do parcelamento</label>
          <input id="f-parcela" className={inputCls} value={form.preco_parcelado_texto} onChange={(e) => set("preco_parcelado_texto", e.target.value)} placeholder="12x de R$ 185,00 no cartão" />
        </div>
      </div>

      <div>
        <label className={labelCls} htmlFor="f-desc">Descrição</label>
        <textarea id="f-desc" rows={4} className={inputCls} value={form.descricao} onChange={(e) => set("descricao", e.target.value)} placeholder="Detalhes da peça, estado, história…" />
      </div>
      <div>
        <label className={labelCls} htmlFor="f-medidas">Medidas (opcional)</label>
        <input id="f-medidas" className={inputCls} value={form.medidas} onChange={(e) => set("medidas", e.target.value)} placeholder="Peito: 56cm · Comprimento: 70cm" />
      </div>

      <label className="glass flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm text-white">
        <input
          type="checkbox"
          checked={form.destaque}
          onChange={(e) => set("destaque", e.target.checked)}
          className="h-4 w-4 accent-[#1B3BFF]"
        />
        Destacar na home
      </label>

      <button
        type="submit"
        disabled={salvando}
        className="glow-brand flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.01] disabled:opacity-60"
      >
        {salvando && <Loader2 className="h-4 w-4 animate-spin" />}
        {salvando ? "Salvando…" : editando ? "Salvar alterações" : "Cadastrar peça"}
      </button>
    </form>
  );
}

/* ---------------- Configurações ---------------- */

function FormConfig({ config }: { config: ConfigLoja }) {
  const [valores, setValores] = useState<Record<string, string>>({ ...config });
  const [salvando, setSalvando] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const salvarFn = useFn(salvarConfiguracao);

  async function salvar(chave: string) {
    setSalvando(chave);
    try {
      await salvarFn({ data: { chave, valor: valores[chave] ?? "" } });
      queryClient.invalidateQueries({ queryKey: ["admin-config"] });
      queryClient.invalidateQueries({ queryKey: ["configuracoes"] });
      toast.success("Configuração salva.");
    } catch {
      toast.error("Não foi possível salvar.");
    } finally {
      setSalvando(null);
    }
  }

  const campos: { chave: keyof ConfigLoja; rotulo: string; multilinha?: boolean }[] = [
    { chave: "whatsapp", rotulo: "WhatsApp (só números, com DDI e DDD)" },
    { chave: "instagram", rotulo: "Instagram (usuário, sem @)" },
    { chave: "home_hero_titulo", rotulo: "Título do hero (use *palavra* para destaque em itálico)" },
    { chave: "home_hero_subtitulo", rotulo: "Subtítulo do hero", multilinha: true },
    { chave: "home_manifesto", rotulo: "Manifesto da home", multilinha: true },
    { chave: "home_fechamento", rotulo: "Frase de fechamento (use *palavra* para itálico)" },
  ];

  const inputCls =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-brand focus:outline-none";

  return (
    <div className="space-y-5">
      <h2 className="text-lg text-white">Configurações da loja</h2>
      {campos.map((c) => (
        <div key={c.chave} className="glass rounded-2xl p-4">
          <label className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-body" htmlFor={`cfg-${c.chave}`}>
            {c.rotulo}
          </label>
          {c.multilinha ? (
            <textarea
              id={`cfg-${c.chave}`}
              rows={3}
              className={inputCls}
              value={valores[c.chave] ?? ""}
              onChange={(e) => setValores((v) => ({ ...v, [c.chave]: e.target.value }))}
            />
          ) : (
            <input
              id={`cfg-${c.chave}`}
              className={inputCls}
              value={valores[c.chave] ?? ""}
              onChange={(e) => setValores((v) => ({ ...v, [c.chave]: e.target.value }))}
            />
          )}
          <button
            onClick={() => salvar(c.chave)}
            disabled={salvando === c.chave}
            className="mt-3 rounded-full bg-primary px-5 py-2 text-[12px] font-medium text-primary-foreground disabled:opacity-60"
          >
            {salvando === c.chave ? "Salvando…" : "Salvar"}
          </button>
        </div>
      ))}
    </div>
  );
}
