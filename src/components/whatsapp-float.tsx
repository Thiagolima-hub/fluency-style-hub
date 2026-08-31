import { MessageCircle } from "lucide-react";
import { waLink } from "@/lib/loja";

export function WhatsAppFloat({ numero }: { numero: string }) {
  return (
    <a
      href={waLink(numero, "Olá! Vim pelo site da FLUENCY COLLECTION.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar no WhatsApp"
      className="glow-brand fixed bottom-5 right-5 z-50 flex h-13 w-13 items-center justify-center rounded-full bg-primary p-3.5 text-primary-foreground transition-transform hover:scale-105"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
