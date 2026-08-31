import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, Instagram } from "lucide-react";
import { configQuery } from "@/routes/__root";
import { SplitTitle } from "@/components/split-title";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre — FLUENCY COLLECTION" },
      {
        name: "description",
        content:
          "FLUENCY COLLECTION é um brechó de luxo masculino: curadoria de peças de grife autênticas, uma de cada, com procedência verificada.",
      },
      { property: "og:title", content: "Sobre — FLUENCY COLLECTION" },
      { property: "og:description", content: "Curadoria de luxo masculino. Cada peça é única." },
    ],
  }),
  component: SobrePage,
});

function SobrePage() {
  const { data: config } = useSuspenseQuery(configQuery);
  return (
    <main className="mx-auto max-w-3xl px-4 pb-24 pt-32 sm:px-6">
      <p className="text-[11px] uppercase tracking-[0.4em] text-cyan">A marca</p>
      <SplitTitle texto="Sobre a *Fluency*" className="mt-4 text-4xl text-white sm:text-6xl" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="mt-10 space-y-6 text-[15px] leading-relaxed text-body"
      >
        <p className="text-lg leading-relaxed text-white/90">
          A FLUENCY COLLECTION nasceu de uma obsessão simples: grife masculina de verdade,
          com procedência comprovada, a preços que fazem sentido.
        </p>
        <p>
          Não trabalhamos com lote nem com reposição. Cada peça do acervo foi escolhida a dedo —
          pela qualidade da construção, pelo estado de conservação e pela relevância da marca.
          Quando uma peça vende, ela sai da coleção para sempre. É essa a graça: o que você vê
          aqui existe uma vez só.
        </p>
        <p>
          Antes de qualquer peça aparecer no site, ela passa pelo nosso processo de verificação
          de autenticidade, etapa por etapa. O que não tem procedência clara simplesmente não entra.
        </p>
        <p>
          A curadoria é masculina porque entendemos do que vestimos: tênis, camisetas, jaquetas,
          alfaiataria casual e acessórios das maisons que definem o luxo contemporâneo — Louis
          Vuitton, Gucci, Prada, Balenciaga, Dior, Off-White, Amiri e outras.
        </p>
      </motion.div>

      <div className="mt-14 flex flex-wrap gap-3">
        <a
          href={`https://instagram.com/${config.instagram}`}
          target="_blank"
          rel="noreferrer"
          className="glow-brand flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
        >
          <Instagram className="h-4 w-4" /> @{config.instagram}
        </a>
        <Link
          to="/pecas"
          className="glass flex items-center gap-2 rounded-full px-7 py-3.5 text-sm text-white transition-transform hover:scale-[1.03]"
        >
          Ver o acervo <ArrowRight className="h-4 w-4 text-cyan" />
        </Link>
      </div>
    </main>
  );
}
