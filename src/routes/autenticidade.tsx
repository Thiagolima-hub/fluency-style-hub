import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { SplitTitle } from "@/components/split-title";

export const Route = createFileRoute("/autenticidade")({
  head: () => ({
    meta: [
      { title: "Autenticidade — FLUENCY COLLECTION" },
      {
        name: "description",
        content:
          "Como verificamos cada peça antes de colocar à venda: triagem de origem, inspeção física, materiais, etiquetas e códigos de série.",
      },
      { property: "og:title", content: "Autenticidade — FLUENCY COLLECTION" },
      { property: "og:description", content: "Como verificamos cada peça antes de colocar à venda." },
    ],
  }),
  component: AutenticidadePage,
});

const ETAPAS = [
  {
    titulo: "Triagem de origem",
    texto:
      "Antes de qualquer avaliação, investigamos de onde a peça vem: notas fiscais, comprovantes de compra e histórico do proprietário. Peça sem procedência clara não avança.",
  },
  {
    titulo: "Inspeção física detalhada",
    texto:
      "Costuras, forros, ferragens, zíperes, botões e acabamentos são conferidos contra os padrões de fabricação de cada maison. Réplicas falham nos detalhes.",
  },
  {
    titulo: "Etiquetas e códigos",
    texto:
      "Verificamos etiquetas internas, fontes tipográficas, códigos de série e date codes, cruzando com os padrões vigentes em cada período de produção.",
  },
  {
    titulo: "Materiais e construção",
    texto:
      "Couro, canvas, metais e tecidos têm textura, peso e cheiro característicos. Avaliamos a construção da peça como um todo, não só a aparência.",
  },
  {
    titulo: "Decisão final",
    texto:
      "Só entra no acervo o que passa por todas as etapas sem ressalva. Se resta qualquer dúvida, a peça é devolvida. Simples assim.",
  },
];

function AutenticidadePage() {
  return (
    <main className="relative">
      <div className="blueprint-grid pointer-events-none fixed inset-0 opacity-40" aria-hidden="true" />
      <div className="relative mx-auto max-w-3xl px-4 pb-24 pt-32 sm:px-6">
        <p className="text-[11px] uppercase tracking-[0.4em] text-cyan">Nosso compromisso</p>
        <SplitTitle
          texto="Grife de verdade, *procedência* de verdade"
          className="mt-4 text-4xl leading-tight text-white sm:text-6xl"
        />
        <p className="mt-6 max-w-[45ch] text-[15px] leading-relaxed text-body">
          Comprar grife usada exige confiança. O medo de réplica é a objeção mais justa que
          existe — e é por isso que nenhuma peça entra no acervo sem passar pelo nosso
          processo de verificação.
        </p>

        <ol className="mt-16 space-y-4">
          {ETAPAS.map((etapa, i) => (
            <motion.li
              key={etapa.titulo}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: 0.05 * i }}
              className="glass glow-soft rounded-3xl p-6 sm:p-8"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cyan/40 text-sm text-cyan">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="text-lg font-medium text-white">{etapa.titulo}</h2>
              </div>
              <p className="mt-4 max-w-[55ch] text-sm leading-relaxed text-body">{etapa.texto}</p>
            </motion.li>
          ))}
        </ol>

        {/* Espaço reservado — conteúdo real será inserido pelo proprietário */}
        <div className="mt-12 rounded-3xl border border-dashed border-cyan/30 bg-brand/5 p-8 text-center">
          <ShieldCheck className="mx-auto h-6 w-6 text-cyan" />
          <p className="mt-4 text-sm font-medium text-white">
            Espaço reservado para o serviço de autenticação
          </p>
          <p className="mx-auto mt-2 max-w-[45ch] text-[13px] leading-relaxed text-body">
            Aqui entrarão o nome do serviço de autenticação terceirizado e o modelo de laudo,
            assim que a parceria for formalizada. Nenhum selo ou número é exibido antes disso.
          </p>
        </div>

        <div className="mt-14 text-center">
          <Link
            to="/pecas"
            className="glow-brand inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
          >
            Ver peças verificadas <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
