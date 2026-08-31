import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { formatPreco, imgSrc } from "@/lib/loja";
import type { ProdutoComImagens } from "@/lib/catalogo.functions";

export function ProductCard({ peca, prioridade }: { peca: ProdutoComImagens; prioridade?: boolean }) {
  const vendida = peca.status === "vendido";
  const reservada = peca.status === "reservado";
  const capa = peca.produto_imagens[0]?.url;
  const segunda = peca.produto_imagens[1]?.url;

  return (
    <Link
      to="/peca/$slug"
      params={{ slug: peca.slug }}
      className={cn(
        "group relative block overflow-hidden rounded-2xl border border-white/8 bg-surface transition-all duration-300",
        !vendida && "hover:-translate-y-1 hover:border-brand/50 hover:glow-brand",
        vendida && "opacity-90",
      )}
      aria-label={`${peca.marca} ${peca.nome}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-deep/30">
        <img
          src={imgSrc(capa)}
          alt={`${peca.marca} ${peca.nome}`}
          loading={prioridade ? "eager" : "lazy"}
          className={cn(
            "h-full w-full object-cover transition-all duration-500",
            vendida && "grayscale",
            !vendida && segunda && "group-hover:opacity-0",
          )}
        />
        {!vendida && segunda && (
          <img
            src={imgSrc(segunda)}
            alt=""
            loading="lazy"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
        <span className="glass absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.2em] text-white/85">
          Peça única
        </span>
        {vendida && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="-rotate-12 border-y border-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-white">
              Vendido
            </span>
          </span>
        )}
        {reservada && (
          <span className="absolute right-2.5 top-2.5 rounded-full bg-brand/80 px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.2em] text-white">
            Reservado
          </span>
        )}
      </div>
      <div className="space-y-1 p-3.5">
        <p className="text-[10px] uppercase tracking-[0.28em] text-cyan/90">{peca.marca}</p>
        <p className="line-clamp-1 text-sm text-white">{peca.nome}</p>
        <div className="flex items-center justify-between pt-1">
          <span className="text-sm font-medium text-white">{formatPreco(peca.preco)}</span>
          <span className="text-[11px] text-body">Tam. {peca.tamanho}</span>
        </div>
      </div>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/8 bg-surface">
      <div className="aspect-[4/5] animate-pulse bg-white/5" />
      <div className="space-y-2 p-3.5">
        <div className="h-2.5 w-16 animate-pulse rounded bg-white/8" />
        <div className="h-3.5 w-3/4 animate-pulse rounded bg-white/8" />
        <div className="h-3 w-24 animate-pulse rounded bg-white/8" />
      </div>
    </div>
  );
}
