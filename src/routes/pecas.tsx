import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { SearchX } from "lucide-react";
import { listarProdutos } from "@/lib/catalogo.functions";
import { CATEGORIAS, formatPreco } from "@/lib/loja";
import { ProductCard, ProductCardSkeleton } from "@/components/product-card";
import { SplitTitle } from "@/components/split-title";
import { cn } from "@/lib/utils";

const produtosQuery = queryOptions({
  queryKey: ["produtos"],
  queryFn: () => listarProdutos(),
  staleTime: 30_000,
});

export const Route = createFileRoute("/pecas")({
  loader: ({ context }) => context.queryClient.ensureQueryData(produtosQuery),
  head: () => ({
    meta: [
      { title: "Peças disponíveis — FLUENCY COLLECTION" },
      {
        name: "description",
        content:
          "Catálogo de peças de grife autênticas: tênis, camisetas, jaquetas e acessórios. Cada peça é única — vendeu, acabou.",
      },
      { property: "og:title", content: "Peças disponíveis — FLUENCY COLLECTION" },
      {
        property: "og:description",
        content: "Peças de grife autênticas, verificadas uma a uma. Cada peça é única.",
      },
    ],
  }),
  component: PecasPage,
});

const PAGINA = 12;

type Ordem = "recentes" | "menor" | "maior";

function PecasPage() {
  const { data: pecas } = useSuspenseQuery(produtosQuery);
  const [categoria, setCategoria] = useState<string>("");
  const [marca, setMarca] = useState<string>("");
  const [tamanho, setTamanho] = useState<string>("");
  const [faixa, setFaixa] = useState<string>("");
  const [ordem, setOrdem] = useState<Ordem>("recentes");
  const [visiveis, setVisiveis] = useState(PAGINA);

  const marcas = useMemo(() => [...new Set(pecas.map((p) => p.marca))].sort(), [pecas]);
  const tamanhos = useMemo(() => [...new Set(pecas.map((p) => p.tamanho))].sort(), [pecas]);

  const filtradas = useMemo(() => {
    let lista = [...pecas];
    if (categoria) lista = lista.filter((p) => p.categoria === categoria);
    if (marca) lista = lista.filter((p) => p.marca === marca);
    if (tamanho) lista = lista.filter((p) => p.tamanho === tamanho);
    if (faixa) {
      const [min = 0, max = 0] = faixa.split("-").map(Number);
      lista = lista.filter((p) => Number(p.preco) >= min && (max > 0 ? Number(p.preco) <= max : true));
    }
    const vendidas = lista.filter((p) => p.status === "vendido");
    let ativas = lista.filter((p) => p.status !== "vendido");
    if (ordem === "menor") ativas.sort((a, b) => Number(a.preco) - Number(b.preco));
    if (ordem === "maior") ativas.sort((a, b) => Number(b.preco) - Number(a.preco));
    return [...ativas, ...vendidas];
  }, [pecas, categoria, marca, tamanho, faixa, ordem]);

  const exibidas = filtradas.slice(0, visiveis);

  const selectCls =
    "h-10 rounded-full border border-white/10 bg-surface px-3.5 text-[13px] text-white focus:border-brand focus:outline-none";

  return (
    <main className="mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-6">
      <p className="text-[11px] uppercase tracking-[0.4em] text-cyan">Catálogo</p>
      <SplitTitle
        texto="Peças *raras*, uma de cada"
        className="mt-3 text-4xl text-white sm:text-5xl"
      />
      <p className="mt-4 max-w-[45ch] text-sm leading-relaxed text-body">
        Cada peça é única. Quando vende, sai do ar para sempre — fica no fim da lista como registro.
      </p>

      <div className="glass sticky top-16 z-30 mt-8 flex flex-wrap items-center gap-2 rounded-2xl p-3">
        <select value={categoria} onChange={(e) => { setCategoria(e.target.value); setVisiveis(PAGINA); }} className={selectCls} aria-label="Categoria">
          <option value="">Categoria</option>
          {CATEGORIAS.map((c) => (
            <option key={c.valor} value={c.valor}>{c.rotulo}</option>
          ))}
        </select>
        <select value={marca} onChange={(e) => { setMarca(e.target.value); setVisiveis(PAGINA); }} className={selectCls} aria-label="Marca">
          <option value="">Marca</option>
          {marcas.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <select value={tamanho} onChange={(e) => { setTamanho(e.target.value); setVisiveis(PAGINA); }} className={selectCls} aria-label="Tamanho">
          <option value="">Tamanho</option>
          {tamanhos.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select value={faixa} onChange={(e) => { setFaixa(e.target.value); setVisiveis(PAGINA); }} className={selectCls} aria-label="Faixa de preço">
          <option value="">Preço</option>
          <option value="0-1500">até {formatPreco(1500)}</option>
          <option value="1500-4000">{formatPreco(1500)} – {formatPreco(4000)}</option>
          <option value="4000-0">acima de {formatPreco(4000)}</option>
        </select>
        <div className="ms-auto flex gap-1 rounded-full border border-white/10 p-1">
          {(
            [
              ["recentes", "Recentes"],
              ["menor", "Menor preço"],
              ["maior", "Maior preço"],
            ] as const
          ).map(([v, r]) => (
            <button
              key={v}
              onClick={() => setOrdem(v)}
              className={cn(
                "rounded-full px-3 py-1.5 text-[11px] transition-colors",
                ordem === v ? "bg-primary text-primary-foreground" : "text-body hover:text-white",
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {exibidas.length === 0 ? (
        <div className="glass mt-10 flex flex-col items-center gap-4 rounded-3xl px-6 py-20 text-center">
          <SearchX className="h-8 w-8 text-cyan" />
          <p className="text-white">Nenhuma peça encontrada com esses filtros.</p>
          <button
            onClick={() => { setCategoria(""); setMarca(""); setTamanho(""); setFaixa(""); }}
            className="glass rounded-full px-5 py-2.5 text-sm text-white"
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3">
            {exibidas.map((p, i) => (
              <ProductCard key={p.id} peca={p} prioridade={i < 4} />
            ))}
          </div>
          {visiveis < filtradas.length && (
            <div className="mt-10 text-center">
              <button
                onClick={() => setVisiveis((v) => v + PAGINA)}
                className="glass glow-soft rounded-full px-8 py-3 text-sm text-white transition-transform hover:scale-[1.03]"
              >
                Carregar mais peças
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}

export function PecasPageSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-6">
      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
