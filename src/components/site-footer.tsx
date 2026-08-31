import { Link } from "@tanstack/react-router";
import { Instagram, MessageCircle } from "lucide-react";
import { waLink, type ConfigLoja } from "@/lib/loja";
import { Logo } from "@/components/site-header";

export function SiteFooter({ config }: { config: ConfigLoja }) {
  const wa = waLink(config.whatsapp, "Olá! Vim pelo site da FLUENCY COLLECTION.");
  return (
    <footer className="border-t border-white/8 bg-surface/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-[45ch] text-sm leading-relaxed text-body">
            Brechó de luxo masculino. Grife autêntica, curadoria rigorosa, peças únicas.
          </p>
        </div>
        <nav aria-label="Rodapé" className="text-sm">
          <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-body">Páginas</p>
          <ul className="grid grid-cols-2 gap-2">
            {[
              { to: "/pecas", rotulo: "Peças" },
              { to: "/autenticidade", rotulo: "Autenticidade" },
              { to: "/como-comprar", rotulo: "Como comprar" },
              { to: "/sobre", rotulo: "Sobre" },
              { to: "/contato", rotulo: "Contato" },
            ].map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="text-body transition-colors hover:text-white">
                  {item.rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="text-sm">
          <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-body">Contato</p>
          <div className="flex flex-col gap-3">
            <a
              href={`https://instagram.com/${config.instagram}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-body transition-colors hover:text-white"
            >
              <Instagram className="h-4 w-4 text-cyan" /> @{config.instagram}
            </a>
            <a
              href={wa}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-body transition-colors hover:text-white"
            >
              <MessageCircle className="h-4 w-4 text-cyan" /> WhatsApp
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/8 px-4 py-5 text-center text-[11px] tracking-wide text-body">
        <p>© {new Date().getFullYear()} FLUENCY COLLECTION · CNPJ e políticas em definição</p>
      </div>
    </footer>
  );
}
