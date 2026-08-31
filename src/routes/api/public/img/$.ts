import { createFileRoute } from "@tanstack/react-router";

const TIPOS: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
  gif: "image/gif",
};

/** Serve fotos do bucket privado "produtos" com cache longo. */
export const Route = createFileRoute("/api/public/img/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const caminho = params._splat ?? "";
        if (!caminho || caminho.includes("..")) {
          return new Response("not found", { status: 404 });
        }
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin.storage.from("produtos").download(caminho);
        if (error || !data) return new Response("not found", { status: 404 });
        const ext = caminho.split(".").pop()?.toLowerCase() ?? "";
        return new Response(data, {
          headers: {
            "content-type": TIPOS[ext] ?? "application/octet-stream",
            "cache-control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
});
