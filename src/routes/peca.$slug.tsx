import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import {
  BadgeCheck,
  ChevronLeft,
  Expand,
  MessageCircle,
  ShieldCheck,
  Truck,
  Users,
  X,
} from "lucide-react";
import { listarRelacionados, obterProduto } from "@/lib/catalogo.functions";
import { configQuery } from "@/routes/__root";
import {
  formatPreco,
  imgSrc,
  rotuloCategoria,
  textoParcelado,
  waMensagemPeca,
} from "@/lib/loja";
import { ProductCard } from "@/components/product-card";
import { SplitTitle } from "@/components/split-title";
import { cn } from "@/lib/utils";

const produtoQuery = (slug: string) =>
  queryOptions({
    queryKey: ["produto", slug],
    queryFn: () => obterProduto({ data: { slug } }),
    staleTime: 30_000,
  });

const relacionadosQuery = (slug: string, categoria: string) =>
  queryOptions({
    queryKey: ["relacionados", slug],
    queryFn: () => listarRelacionados({ data: { slug, categoria } }),
    staleTime: 60_000,
  });

export const Route = createFileRoute("/peca/$slug")({
  loader: async ({ params, context }) => {
    const peca = await context.queryClient.ensureQueryData(produtoQuery(params.slug));
    if (!peca) throw notFound();
    context.queryClient.prefetchQuery(relacionadosQuery(params.slug, peca.categoria));
    return peca;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Peça não encontrada — FLUENCY COLLECTION" }, { name: "robots", content: "noindex" }] };
    }
    const capa = loaderData.produto_imagens[0]?.url;
    const capaUrl = capa?.startsWith("/exemplos") ? undefined : undefined;
    const titulo = `${loaderData.marca} ${loaderData.nome} (${loaderData.codigo}) — FLUENCY COLLECTION`;
    const desc = `${loaderData.marca} ${loaderData.nome}, tamanho ${loaderData.tamanho}, ${loaderData.condicao}. ${formatPreco(loaderData.preco)}. Peça única, autenticada.`;
    return {
      meta: [
        { title: titulo },
        { name: "description", content: desc },
        { property: "og:title", content: titulo },
        { property: "og:description", content: desc },
        { property: "og:type", content: "product" },
        ...(capa && capa.startsWith("http")
          ? [
              { property: "og:image", content: capa },
              { name: "twitter:image", content: capa },
            ]
          : []),
      ],
    };
  },
  component: PecaPage,
  notFoundComponent: PecaNaoEncontrada,
});

function PecaNaoEncontrada() {
  return (
    <div className="gradient-hero flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-3xl text-white">
        Peça não <em className="font-serif italic text-cyan">encontrada</em>
      </h1>
      <p className="text-sm text-body">Ela pode ter sido vendida ou removida do acervo.</p>
      <Link to="/pecas" className="glow-brand rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">
        Ver peças disponíveis
      </Link>
    </div>
  );
}

function PecaPage() {
  const peca = Route.useLoaderData();
  const { data: config } = useSuspenseQuery(configQuery);
  const { data: relacionadas } = useSuspenseQuery(relacionadosQuery(peca.slug, peca.categoria));
  const [ativa, setAtiva] = useState(0);
  const [zoom, setZoom] = useState(false);

  const vendida = peca.status === "vendido";
  const imagens = peca.produto_imagens.length > 0 ? peca.produto_imagens : [{ url: "/exemplos/peca-1.jpg", ordem: 0 }];
  const origem = typeof window !== "undefined" ? window.location.origin : "";
  const wa = waMensagemPeca(config.whatsapp, peca, origem);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-24 pt-24 sm:px-6">
      <Link to="/pecas" className="inline-flex items-center gap-1.5 text-[13px] text-body transition-colors hover:text-white">
        <ChevronLeft className="h-4 w-4" /> Voltar ao catálogo
      </Link>

      <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-12">
        {/* Galeria */}
        <div>
          <div
            className="relative aspect-[4/5] cursor-zoom-in overflow-hidden rounded-3xl border border-white/8 bg-deep/30"
            onClick={() => setZoom(true)}
            role="button"
            aria-label="Ampliar foto"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setZoom(true)}
          >
            <img
              src={imgSrc(imagens[ativa]?.url)}
              alt={`${peca.marca} ${peca.nome} — foto ${ativa + 1}`}
              className={cn("h-full w-full object-cover", vendida && "grayscale")}
            />
            <span className="glass absolute right-3 top-3 rounded-full p-2 text-white/70">
              <Expand className="h-4 w-4" />
            </span>
            {vendida && (
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="-rotate-12 border-y border-white/70 px-5 py-1.5 text-sm font-semibold uppercase tracking-[0.4em] text-white">
                  Vendido
                </span>
              </span>
            )}
          </div>
          {imagens.length > 1 && (
            <div className="scrollbar-hide mt-3 flex gap-2 overflow-x-auto pb-1">
              {imagens.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setAtiva(i)}
                  aria-label={`Ver foto ${i + 1}`}
                  className={cn(
                    "h-18 w-18 shrink-0 overflow-hidden rounded-xl border transition-all",
                    i === ativa ? "border-brand glow-brand" : "border-white/10 opacity-60 hover:opacity-100",
                  )}
                >
                  <img src={imgSrc(img.url)} alt="" className={cn("h-full w-full object-cover", vendida && "grayscale")} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dados */}
        <div className="flex flex-col">
          <p className="text-[11px] uppercase tracking-[0.35em] text-cyan">{peca.marca}</p>
          <h1 className="mt-2 text-3xl font-light text-white sm:text-4xl">{peca.nome}</h1>
          <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
            {[
              peca.codigo,
              rotuloCategoria(peca.categoria),
              `Tamanho ${peca.tamanho}`,
              peca.condicao,
              "Peça única",
            ].map((chip) => (
              <span key={chip} className="glass rounded-full px-3 py-1.5 text-white/80">
                {chip}
              </span>
            ))}
          </div>

          <div className="mt-6">
            <p className="text-3xl font-light text-white">{formatPreco(peca.preco)}</p>
            {peca.preco_parcelado_texto && (
              <p className="mt-1 text-sm text-body">ou {textoParcelado(peca.preco_parcelado_texto)}</p>
            )}
          </div>

          <div className="mt-8">
            {vendida ? (
              <div className="space-y-3">
                <button disabled className="w-full cursor-not-allowed rounded-full bg-white/10 py-4 text-sm font-medium text-white/50">
                  Peça vendida
                </button>
                <Link
                  to="/pecas"
                  className="glass block rounded-full py-4 text-center text-sm font-medium text-white transition-transform hover:scale-[1.01]"
                >
                  Ver peças disponíveis
                </Link>
              </div>
            ) : (
              <a
                href={wa}
                target="_blank"
                rel="noreferrer"
                className="glow-brand flex items-center justify-center gap-2.5 rounded-full bg-primary py-4 text-[15px] font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
              >
                <MessageCircle className="h-5 w-5" />
                Falar sobre esta peça no WhatsApp
              </a>
            )}
          </div>

          <div className="glass mt-6 grid grid-cols-2 gap-3 rounded-2xl p-4 text-[12px] text-body">
            <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-cyan" /> Autenticidade verificada</span>
            <span className="flex items-center gap-2"><Truck className="h-4 w-4 text-cyan" /> Envio para todo o Brasil</span>
            <span className="flex items-center gap-2"><Users className="h-4 w-4 text-cyan" /> Atendimento humano</span>
            <span className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-cyan" /> Peça única, sem reposição</span>
          </div>

          {peca.descricao && (
            <div className="mt-8">
              <h2 className="text-[11px] uppercase tracking-[0.3em] text-body">Descrição</h2>
              <p className="mt-3 max-w-[55ch] whitespace-pre-line text-sm leading-relaxed text-white/80">{peca.descricao}</p>
            </div>
          )}
          {peca.medidas && (
            <div className="mt-6">
              <h2 className="text-[11px] uppercase tracking-[0.3em] text-body">Medidas</h2>
              <p className="mt-3 text-sm text-white/80">{peca.medidas}</p>
            </div>
          )}
        </div>
      </div>

      {relacionadas.length > 0 && (
        <section className="mt-24">
          <SplitTitle texto="Você também pode *gostar*" as="h2" className="text-2xl text-white sm:text-3xl" />
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
            {relacionadas.map((p) => (
              <ProductCard key={p.id} peca={p} />
            ))}
          </div>
        </section>
      )}

      {zoom && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setZoom(false)}
          role="dialog"
          aria-label="Foto ampliada"
        >
          <button className="glass absolute right-4 top-4 rounded-full p-3 text-white" aria-label="Fechar">
            <X className="h-5 w-5" />
          </button>
          <img
            src={imgSrc(imagens[ativa]?.url)}
            alt={`${peca.marca} ${peca.nome} — ampliada`}
            className="max-h-[90vh] max-w-full rounded-2xl object-contain"
          />
        </div>
      )}
    </main>
  );
}
