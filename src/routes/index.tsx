import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CreditCard,
  Instagram,
  MessageCircle,
  MousePointer2,
  Package,
  Search,
  ShieldCheck,
  Truck,
  Users,
} from "lucide-react";

import { listarDestaques, listarRecentes } from "@/lib/catalogo.functions";
import { configQuery } from "@/routes/__root";
import { waLink } from "@/lib/loja";
import { SplitTitle } from "@/components/split-title";
import { ProductCard, ProductCardSkeleton } from "@/components/product-card";

const recentesQuery = queryOptions({
  queryKey: ["recentes"],
  queryFn: () => listarRecentes(),
  staleTime: 30_000,
});
const destaquesQuery = queryOptions({
  queryKey: ["destaques"],
  queryFn: () => listarDestaques(),
  staleTime: 30_000,
});

export const Route = createFileRoute("/")({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(recentesQuery),
      context.queryClient.ensureQueryData(destaquesQuery),
    ]),
  head: () => ({
    meta: [
      { title: "FLUENCY COLLECTION — Luxo masculino, autenticado" },
      {
        name: "description",
        content:
          "Brechó de luxo masculino. Peças de grife autênticas e verificadas: Louis Vuitton, Gucci, Prada, Balenciaga, Dior. Cada peça é única — vendeu, acabou.",
      },
      { property: "og:title", content: "FLUENCY COLLECTION — Luxo masculino, autenticado" },
      {
        property: "og:description",
        content: "Peças de grife autênticas, verificadas uma a uma. Cada peça é única.",
      },
    ],
  }),
  component: HomePage,
});

const aparecer = {
  inicial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
} as const;

function HomePage() {
  const { data: config } = useSuspenseQuery(configQuery);
  const { data: recentes } = useSuspenseQuery(recentesQuery);
  const { data: destaques } = useSuspenseQuery(destaquesQuery);
  const wa = waLink(config.whatsapp, "Olá! Vim pelo site da FLUENCY COLLECTION.");

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <main className="overflow-x-clip">
      {/* 1 · HERO — gradiente estático (a cena 3D entra na etapa final) */}
      <section ref={heroRef} className="gradient-hero relative flex min-h-svh items-center justify-center px-4">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-3xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] tracking-[0.25em] text-white/80"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
            BRECHÓ DE LUXO MASCULINO
          </motion.span>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <SplitTitle
              texto={config.home_hero_titulo}
              className="mt-6 text-5xl leading-[1.05] text-white sm:text-7xl"
            />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mx-auto mt-6 max-w-[45ch] text-[15px] leading-relaxed text-body"
          >
            {config.home_hero_subtitulo}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-9 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              to="/pecas"
              className="glow-brand rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.04]"
            >
              Ver peças
            </Link>
            <a
              href={wa}
              target="_blank"
              rel="noreferrer"
              className="glass flex items-center gap-2 rounded-full px-7 py-3.5 text-sm text-white transition-transform hover:scale-[1.04]"
            >
              <MessageCircle className="h-4 w-4 text-cyan" /> Falar no WhatsApp
            </a>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-6 right-6 flex items-center gap-2 text-[11px] tracking-[0.2em] text-white/50"
        >
          <MousePointer2 className="h-3.5 w-3.5 rotate-180" /> ROLE PARA VER
        </motion.div>
      </section>

      {/* 2 · TRÊS CARDS */}
      <section className="mx-auto -mt-16 max-w-6xl px-4 sm:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icone: ShieldCheck, titulo: "Peças autenticadas", texto: "Cada item passa por verificação completa antes de entrar no acervo.", ativo: false },
            { icone: Truck, titulo: "Envio para todo o Brasil", texto: "Compra protegida, embalagem reforçada e código de rastreio.", ativo: true },
            { icone: Users, titulo: "Atendimento humano", texto: "Nada de robô: você fala direto com a gente no WhatsApp.", ativo: false },
          ].map((card, i) => (
            <motion.div
              key={card.titulo}
              {...aparecer}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className={
                card.ativo
                  ? "glass glow-brand blueprint-grid relative rounded-3xl p-7 md:-translate-y-4 md:scale-[1.04]"
                  : "glass blueprint-grid relative rounded-3xl p-7 opacity-80"
              }
            >
              <card.icone className="h-6 w-6 text-cyan" strokeWidth={1.5} />
              <h3 className="mt-5 text-base font-medium text-white">{card.titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-body">{card.texto}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3 · ACABARAM DE CHEGAR */}
      <section className="mx-auto max-w-6xl px-4 pt-28 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.4em] text-cyan">Novidades</p>
            <SplitTitle texto="Acabaram de *chegar*" as="h2" className="mt-3 text-3xl text-white sm:text-5xl" />
          </div>
          <Link to="/pecas" className="hidden items-center gap-1.5 text-[13px] text-body transition-colors hover:text-white sm:flex">
            Ver catálogo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="scrollbar-hide mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 sm:gap-5">
          {recentes.map((p) => (
            <div key={p.id} className="w-[62vw] shrink-0 snap-start sm:w-[38vw] md:w-[calc(25%-15px)]">
              <ProductCard peca={p} />
            </div>
          ))}
        </div>
      </section>

      {/* 4 · MANIFESTO */}
      <Manifesto texto={config.home_manifesto} />

      {/* 5 · DESTAQUES */}
      {destaques.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pt-28 sm:px-6">
          <p className="text-[11px] uppercase tracking-[0.4em] text-cyan">Seleção</p>
          <SplitTitle texto="Destaques do *acervo*" as="h2" className="mt-3 text-3xl text-white sm:text-5xl" />
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3">
            {destaques.map((p, i) => (
              <motion.div key={p.id} {...aparecer} transition={{ duration: 0.6, delay: i * 0.08 }}>
                <ProductCard peca={p} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* 6 · AUTENTICIDADE */}
      <section className="relative mt-28 border-y border-white/8 bg-surface/40">
        <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <p className="text-[11px] uppercase tracking-[0.4em] text-cyan">Autenticidade</p>
              <SplitTitle
                texto="Grife de verdade, *procedência* de verdade"
                as="h2"
                className="mt-3 text-3xl leading-tight text-white sm:text-4xl"
              />
              <p className="mt-5 max-w-[45ch] text-sm leading-relaxed text-body">
                O medo de réplica é legítimo. Por isso cada peça passa por um processo de
                verificação em etapas antes de aparecer aqui.
              </p>
              <Link
                to="/autenticidade"
                className="glass glow-soft mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm text-white transition-transform hover:scale-[1.03]"
              >
                Como verificamos <ArrowRight className="h-4 w-4 text-cyan" />
              </Link>
            </div>
            <ol className="space-y-3">
              {[
                "Triagem: origem, notas e histórico da peça",
                "Inspeção física: costuras, ferragens, etiquetas e códigos",
                "Conferência de materiais e numeração de série",
                "Só entra no acervo o que passa em todas as etapas",
              ].map((passo, i) => (
                <motion.li
                  key={passo}
                  {...aparecer}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="glass flex items-start gap-4 rounded-2xl p-4"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cyan/40 text-[12px] text-cyan">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="pt-1.5 text-sm text-white/85">{passo}</p>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 7 · COMO FUNCIONA */}
      <section className="mx-auto max-w-6xl px-4 pt-28 sm:px-6">
        <p className="text-[11px] uppercase tracking-[0.4em] text-cyan">Simples assim</p>
        <SplitTitle texto="Como *funciona*" as="h2" className="mt-3 text-3xl text-white sm:text-5xl" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icone: Search, titulo: "Escolha a peça", texto: "Navegue pelo catálogo ou acompanhe as novidades no Instagram." },
            { icone: MessageCircle, titulo: "Chame no WhatsApp", texto: "Tire dúvidas de tamanho, condição e fotos com gente de verdade." },
            { icone: CreditCard, titulo: "Pague no Pix ou cartão", texto: "Pix à vista ou parcelado no cartão com juros. Frete por conta do cliente." },
            { icone: Package, titulo: "Receba em casa", texto: "Enviamos para todo o Brasil com código de rastreio." },
          ].map((passo, i) => (
            <motion.div
              key={passo.titulo}
              {...aparecer}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass rounded-3xl p-6"
            >
              <div className="flex items-center justify-between">
                <passo.icone className="h-5 w-5 text-cyan" strokeWidth={1.5} />
                <span className="text-[11px] tracking-widest text-white/30">0{i + 1}</span>
              </div>
              <h3 className="mt-5 text-[15px] font-medium text-white">{passo.titulo}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-body">{passo.texto}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 8 · FECHAMENTO */}
      <section className="gradient-hero mt-28 border-t border-white/8">
        <div className="mx-auto max-w-3xl px-4 py-32 text-center sm:px-6">
          <SplitTitle texto={config.home_fechamento} as="h2" className="text-4xl leading-tight text-white sm:text-6xl" />
          <p className="mx-auto mt-6 max-w-[45ch] text-sm leading-relaxed text-body">
            As melhores peças aparecem primeiro no Instagram. Siga para não perder a próxima.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a
              href={`https://instagram.com/${config.instagram}`}
              target="_blank"
              rel="noreferrer"
              className="glow-brand flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.04]"
            >
              <Instagram className="h-4 w-4" /> @{config.instagram}
            </a>
            <Link to="/pecas" className="glass flex items-center gap-2 rounded-full px-7 py-3.5 text-sm text-white transition-transform hover:scale-[1.04]">
              Ver peças <ArrowRight className="h-4 w-4 text-cyan" />
            </Link>
          </div>
          <p className="mt-10 flex items-center justify-center gap-2 text-[11px] tracking-[0.2em] text-white/40">
            <BadgeCheck className="h-3.5 w-3.5 text-cyan" /> AUTENTICIDADE VERIFICADA EM TODAS AS PEÇAS
          </p>
        </div>
      </section>
    </main>
  );
}

/** Manifesto revelado palavra por palavra conforme a rolagem. */
function Manifesto({ texto }: { texto: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const palavras = texto.split(" ");

  return (
    <section ref={ref} className="mx-auto max-w-3xl px-4 pt-32 sm:px-6">
      <p className="text-center text-[11px] uppercase tracking-[0.4em] text-cyan">Manifesto</p>
      <p className="mt-8 text-center text-2xl leading-snug sm:text-4xl">
        {palavras.map((palavra, i) => (
          <Palavra key={i} progress={scrollYProgress} inicio={i / palavras.length} fim={(i + 1) / palavras.length}>
            {palavra}
          </Palavra>
        ))}
      </p>
    </section>
  );
}

function Palavra({
  children,
  progress,
  inicio,
  fim,
}: {
  children: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  inicio: number;
  fim: number;
}) {
  const opacity = useTransform(progress, [inicio, fim], [0.16, 1]);
  return (
    <motion.span style={{ opacity }} className="me-[0.28em] inline-block text-white">
      {children}
    </motion.span>
  );
}
