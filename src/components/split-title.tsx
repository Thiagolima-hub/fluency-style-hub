import { cn } from "@/lib/utils";

/**
 * Assinatura tipográfica da marca: texto em sans geométrica com o trecho
 * marcado entre *asteriscos* renderizado em serifada itálica na mesma linha.
 * Ex.: "Luxo masculino, *autenticado*"
 */
export function SplitTitle({
  texto,
  className,
  as: Tag = "h1",
}: {
  texto: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}) {
  const partes = texto.split(/(\*[^*]+\*)/g).filter(Boolean);
  return (
    <Tag className={cn("font-sans font-normal tracking-tight", className)}>
      {partes.map((parte, i) =>
        parte.startsWith("*") && parte.endsWith("*") ? (
          <em
            key={i}
            className="font-serif italic font-normal text-cyan"
          >
            {parte.slice(1, -1)}
          </em>
        ) : (
          <span key={i}>{parte}</span>
        ),
      )}
    </Tag>
  );
}
