import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Instagram, Menu, MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { waLink } from "@/lib/loja";
import type { ConfigLoja } from "@/lib/loja";

const MENU = [
  { to: "/pecas", rotulo: "Peças" },
  { to: "/autenticidade", rotulo: "Autenticidade" },
  { to: "/como-comprar", rotulo: "Como comprar" },
  { to: "/sobre", rotulo: "Sobre" },
  { to: "/contato", rotulo: "Contato" },
] as const;

export { Logo };

export function SiteHeader({ config }: { config: ConfigLoja }) {
  const [rolou, setRolou] = useState(false);
  const [aberto, setAberto] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const fn = () => setRolou(window.scrollY > 24);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => setAberto(false), [pathname]);

  const wa = waLink(config.whatsapp, "Olá! Vim pelo site da FLUENCY COLLECTION.");

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        rolou || aberto ? "glass" : "bg-transparent border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-7 md:flex" aria-label="Principal">
          {MENU.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "text-[13px] tracking-wide transition-colors",
                pathname.startsWith(item.to) ? "text-white" : "text-body hover:text-white",
              )}
            >
              {item.rotulo}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`https://instagram.com/${config.instagram}`}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="glass hidden h-9 w-9 items-center justify-center rounded-full text-cyan transition-colors hover:text-white md:flex"
          >
            <Instagram className="h-4 w-4" />
          </a>
          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            className="glow-brand hidden items-center gap-2 rounded-full bg-primary px-4 py-2 text-[13px] font-medium text-primary-foreground transition-transform hover:scale-[1.03] md:inline-flex"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
          <button
            className="glass flex h-9 w-9 items-center justify-center rounded-full text-white md:hidden"
            onClick={() => setAberto((v) => !v)}
            aria-label={aberto ? "Fechar menu" : "Abrir menu"}
            aria-expanded={aberto}
          >
            {aberto ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {aberto && (
        <nav className="glass border-t px-4 py-4 md:hidden" aria-label="Menu móvel">
          <ul className="flex flex-col gap-1">
            {MENU.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="block rounded-lg px-3 py-3 text-sm text-white hover:bg-white/5"
                >
                  {item.rotulo}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={wa}
                target="_blank"
                rel="noreferrer"
                className="mt-2 flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-medium text-primary-foreground"
              >
                <MessageCircle className="h-4 w-4" /> Falar no WhatsApp
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
