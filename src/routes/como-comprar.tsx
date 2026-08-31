import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CreditCard, Instagram, MessageCircle, Package, Ruler, Search } from "lucide-react";
import { configQuery } from "@/routes/__root";
import { waLink } from "@/lib/loja";
import { SplitTitle } from "@/components/split-title";

export const Route = createFileRoute("/como-comprar")({
  head: () => ({
    meta: [
      { title: "Como comprar — FLUENCY COLLECTION" },
      {
        name: "description",
        content:
          "Escolha a peça, chame no WhatsApp, pague no Pix ou parcelado no cartão e receba em casa com código de rastreio. Enviamos para todo o Brasil.",
      },
      { property: "og:title", content: "Como comprar — FLUENCY COLLECTION" },
      { property: "og:description", content: "Escolha a peça, chame no WhatsApp e receba em casa com rastreio." },
    ],
  }),
  component: ComoComprarPage,
});

const PASSOS = [
  {
    icone: Search,
    titulo: "Escolha a peça",
    texto:
      "Navegue pelo catálogo aqui no site ou acompanhe as novidades no Instagram. Cada peça é única: quando vende, não volta.",
  },
  {
    icone: MessageCircle,
    titulo: "Chame no WhatsApp",
    texto:
      "O botão de cada peça já abre a conversa com código, marca e link. Atendimento humano, direto, sem robô.",
  },
  {
    icone: Ruler,
    titulo: "Tire todas as dúvidas",
    texto:
      "Pergunte sobre tamanho, condição, medidas e peça fotos extras. Preferimos que você compre com certeza absoluta.",
  },
  {
    icone: CreditCard,
    titulo: "Pague no Pix ou cartão",
    texto:
      "Pix à vista ou parcelado no cartão com juros da operadora. O frete é calculado no atendimento e fica por conta do cliente.",
  },
  {
    icone: Package,
    titulo: "Receba em casa",
    texto:
      "Enviamos para todo o Brasil com embalagem reforçada e código de rastreio para você acompanhar a entrega.",
  },
];

function ComoComprarPage() {
  const { data: config } = useSuspenseQuery(configQuery);
  return (
    <main className="mx-auto max-w-3xl px-4 pb-24 pt-32 sm:px-6">
      <p className="text-[11px] uppercase tracking-[0.4em] text-cyan">Sem complicação</p>
      <SplitTitle texto="Como *comprar*" className="mt-4 text-4xl text-white sm:text-6xl" />
      <p className="mt-6 max-w-[45ch] text-[15px] leading-relaxed text-body">
        Não temos carrinho nem checkout automático — de propósito. Cada peça é única e a
        negociação acontece direto no WhatsApp, com gente de verdade.
      </p>

      <ol className="mt-16 space-y-4">
        {PASSOS.map((passo, i) => (
          <motion.li
            key={passo.titulo}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: 0.05 * i }}
            className="glass glow-soft flex items-start gap-5 rounded-3xl p-6"
          >
            <span className="glass flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl">
              <passo.icone className="h-5 w-5 text-cyan" strokeWidth={1.5} />
            </span>
            <div>
              <h2 className="text-base font-medium text-white">
                <span className="me-2 text-[12px] text-cyan/70">0{i + 1}</span>
                {passo.titulo}
              </h2>
              <p className="mt-2 max-w-[55ch] text-sm leading-relaxed text-body">{passo.texto}</p>
            </div>
          </motion.li>
        ))}
      </ol>

      <div className="glass mt-12 rounded-3xl p-6 text-sm leading-relaxed text-body">
        <p className="font-medium text-white">Importante sobre o frete</p>
        <p className="mt-2">
          O valor do envio não está incluído no preço da peça. Calculamos o frete no atendimento,
          conforme o seu CEP, e ele fica por conta do cliente.
        </p>
      </div>

      <div className="mt-12 flex flex-wrap gap-3">
        <a
          href={waLink(config.whatsapp, "Olá! Quero comprar uma peça da FLUENCY COLLECTION.")}
          target="_blank"
          rel="noreferrer"
          className="glow-brand flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
        >
          <MessageCircle className="h-4 w-4" /> Chamar no WhatsApp
        </a>
        <a
          href={`https://instagram.com/${config.instagram}`}
          target="_blank"
          rel="noreferrer"
          className="glass flex items-center gap-2 rounded-full px-7 py-3.5 text-sm text-white transition-transform hover:scale-[1.03]"
        >
          <Instagram className="h-4 w-4 text-cyan" /> @{config.instagram}
        </a>
      </div>
    </main>
  );
}
