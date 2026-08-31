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
          "Toda peça da FLUENCY COLLECTION passa por verificação de autenticidade antes de entrar no acervo. Peça reprovada não é vendida.",
      },
      { property: "og:title", content: "Autenticidade — FLUENCY COLLECTION" },
      { property: "og:description", content: "Como verificamos cada peça antes de colocar à venda." },
    ],
  }),
  component: AutenticidadePage,
});

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
          existe. Por isso toda peça passa por verificação de autenticidade antes de entrar
          no acervo — e peça reprovada não é vendida.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55 }}
          className="glass glow-soft mt-16 rounded-3xl p-6 sm:p-8"
        >
          <div className="flex items-center gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cyan/40 text-cyan">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <h2 className="text-lg font-medium text-white">Verificação antes do acervo</h2>
          </div>
          <p className="mt-4 max-w-[55ch] text-sm leading-relaxed text-body">
            Nenhuma peça é anunciada sem passar por verificação de autenticidade. Se a peça
            não é aprovada, ela não entra no acervo e não é vendida. Na dúvida sobre um item
            específico, fale com a gente antes de comprar.
          </p>
        </motion.div>

        {/* EDITAR AQUI — descrição do processo real de autenticação */}
        <div className="mt-6 rounded-3xl border border-dashed border-cyan/40 bg-brand/5 p-8">
          <p className="text-[11px] uppercase tracking-[0.3em] text-cyan">Editar aqui</p>
          <p className="mt-3 text-sm font-medium text-white">
            Espaço para descrever o processo real de autenticação
          </p>
          <p className="mt-2 max-w-[55ch] text-[13px] leading-relaxed text-body">
            Este bloco está reservado. Assim que o processo oficial for definido, o texto
            entra aqui. Até lá, nada de etapa, técnica ou ferramenta é descrito.
          </p>
        </div>

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
