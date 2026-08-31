import { Users } from "lucide-react";

/** Botão flutuante: leva para a COMUNIDADE do WhatsApp (não para a conversa direta). */
export function WhatsAppFloat({ link }: { link: string }) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Entrar na comunidade do WhatsApp"
      title="Entrar na comunidade"
      className="glow-brand group fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-primary py-3 pl-3.5 pr-4 text-primary-foreground transition-transform hover:scale-105 sm:pr-3.5"
    >
      <Users className="h-6 w-6 shrink-0" />
      {/* Mobile: rótulo sempre visível ao lado do ícone */}
      <span className="text-[13px] font-medium sm:hidden">Entrar na comunidade</span>
      {/* Desktop: tooltip no hover */}
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full bg-surface px-3 py-2 text-[12px] text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 sm:block">
        Entrar na comunidade
      </span>
    </a>
  );
}
