import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Instagram, MessageCircle, Send } from "lucide-react";
import { configQuery } from "@/routes/__root";
import { waLink } from "@/lib/loja";
import { SplitTitle } from "@/components/split-title";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — FLUENCY COLLECTION" },
      {
        name: "description",
        content: "Fale com a FLUENCY COLLECTION pelo WhatsApp ou Instagram. Atendimento humano, direto e rápido.",
      },
      { property: "og:title", content: "Contato — FLUENCY COLLECTION" },
      { property: "og:description", content: "Fale com a gente pelo WhatsApp ou Instagram." },
    ],
  }),
  component: ContatoPage,
});

function ContatoPage() {
  const { data: config } = useSuspenseQuery(configQuery);
  const [nome, setNome] = useState("");
  const [mensagem, setMensagem] = useState("");

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    const texto = `Olá! Meu nome é ${nome}. ${mensagem}`;
    window.open(waLink(config.whatsapp, texto), "_blank", "noopener");
  }

  const inputCls =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-brand focus:outline-none";

  return (
    <main className="mx-auto max-w-3xl px-4 pb-24 pt-32 sm:px-6">
      <p className="text-[11px] uppercase tracking-[0.4em] text-cyan">Fale com a gente</p>
      <SplitTitle texto="Contato *direto*" className="mt-4 text-4xl text-white sm:text-6xl" />
      <p className="mt-6 max-w-[45ch] text-[15px] leading-relaxed text-body">
        Atendimento humano, sem robô. O caminho mais rápido é o WhatsApp — mas você também pode
        mandar mensagem pelo formulário, que cai direto na nossa conversa.
      </p>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        <a
          href={waLink(config.whatsapp, "Olá! Vim pelo site da FLUENCY COLLECTION.")}
          target="_blank"
          rel="noreferrer"
          className="glass glow-soft group flex items-center gap-4 rounded-3xl p-6 transition-transform hover:scale-[1.02]"
        >
          <span className="glass flex h-12 w-12 items-center justify-center rounded-2xl">
            <MessageCircle className="h-5 w-5 text-cyan" />
          </span>
          <span>
            <span className="block text-[15px] font-medium text-white">WhatsApp</span>
            <span className="text-[13px] text-body">Resposta rápida em horário comercial</span>
          </span>
        </a>
        <a
          href={`https://instagram.com/${config.instagram}`}
          target="_blank"
          rel="noreferrer"
          className="glass glow-soft group flex items-center gap-4 rounded-3xl p-6 transition-transform hover:scale-[1.02]"
        >
          <span className="glass flex h-12 w-12 items-center justify-center rounded-2xl">
            <Instagram className="h-5 w-5 text-cyan" />
          </span>
          <span>
            <span className="block text-[15px] font-medium text-white">Instagram</span>
            <span className="text-[13px] text-body">@{config.instagram}</span>
          </span>
        </a>
      </div>

      <form onSubmit={enviar} className="glass mt-10 space-y-4 rounded-3xl p-6 sm:p-8">
        <h2 className="text-base font-medium text-white">Enviar mensagem</h2>
        <div>
          <label htmlFor="c-nome" className="mb-1.5 block text-[11px] uppercase tracking-[0.2em] text-body">
            Seu nome
          </label>
          <input id="c-nome" required className={inputCls} value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Como podemos te chamar?" />
        </div>
        <div>
          <label htmlFor="c-msg" className="mb-1.5 block text-[11px] uppercase tracking-[0.2em] text-body">
            Mensagem
          </label>
          <textarea
            id="c-msg"
            required
            rows={4}
            className={inputCls}
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            placeholder="Conte o que você procura ou sobre qual peça quer falar…"
          />
        </div>
        <button
          type="submit"
          className="glow-brand flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.01]"
        >
          <Send className="h-4 w-4" /> Enviar pelo WhatsApp
        </button>
      </form>
    </main>
  );
}
