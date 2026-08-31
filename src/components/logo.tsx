import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

/**
 * Logo da marca. Basta subir o arquivo em `public/logo.png`
 * (ou .svg, ajustando LOGO_SRC) que ele passa a ser usado automaticamente.
 * Sem arquivo, cai num símbolo vetorial simples — nunca colado no texto.
 */
const LOGO_SRC = "/logo.png";

export function Logo({
  className,
  compacto = false,
}: {
  className?: string;
  compacto?: boolean;
}) {
  const [semArquivo, setSemArquivo] = useState(false);

  return (
    <Link
      to="/"
      className={cn("flex items-center gap-3", className)}
      aria-label="FLUENCY COLLECTION — início"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center">
        {semArquivo ? (
          <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
            <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand" />
            <path d="M18 6 L11 17 L16 17 L14 26 L22 14 L17 14 Z" fill="currentColor" className="text-cyan" />
          </svg>
        ) : (
          <img
            src={LOGO_SRC}
            alt=""
            className="h-9 w-9 object-contain"
            onError={() => setSemArquivo(true)}
          />
        )}
      </span>
      {!compacto && (
        <span className="text-[12px] font-medium leading-none tracking-[0.26em] text-white">
          FLUENCY <span className="text-cyan">COLLECTION</span>
        </span>
      )}
    </Link>
  );
}
