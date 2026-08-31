import { QueryClient, QueryClientProvider, queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { supabase } from "@/integrations/supabase/client";
import { obterConfiguracoes } from "@/lib/catalogo.functions";
import { CONFIG_PADRAO } from "@/lib/loja";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";

export const configQuery = queryOptions({
  queryKey: ["configuracoes"],
  queryFn: () => obterConfiguracoes(),
  staleTime: 60_000,
});

function NotFoundComponent() {
  return (
    <div className="gradient-hero flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="text-[11px] uppercase tracking-[0.4em] text-cyan">Erro 404</p>
        <h1 className="mt-4 text-6xl font-light text-white">
          Página <em className="font-serif italic text-cyan">perdida</em>
        </h1>
        <p className="mt-4 text-sm text-body">
          Esta página não existe ou foi movida. As peças boas continuam no catálogo.
        </p>
        <div className="mt-8">
          <Link
            to="/pecas"
            className="glow-brand inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
          >
            Ver peças disponíveis
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="gradient-hero flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-medium tracking-tight text-white">Esta página não carregou</h1>
        <p className="mt-2 text-sm text-body">Algo deu errado do nosso lado. Tente de novo ou volte ao início.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="glow-brand rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
          >
            Tentar de novo
          </button>
          <a href="/" className="glass rounded-full px-5 py-2.5 text-sm text-white">
            Voltar ao início
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: ({ context }) => context.queryClient.ensureQueryData(configQuery),
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "FLUENCY COLLECTION — Brechó de luxo masculino" },
      {
        name: "description",
        content:
          "Brechó de luxo masculino. Peças de grife autênticas, verificadas uma a uma. Louis Vuitton, Gucci, Prada, Balenciaga e mais. Cada peça é única.",
      },
      { property: "og:title", content: "FLUENCY COLLECTION — Brechó de luxo masculino" },
      {
        property: "og:description",
        content: "Peças de grife autênticas, verificadas uma a uma. Cada peça é única: vendeu, acabou.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&family=Instrument+Serif:ital@0;1&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => sub.subscription.unsubscribe();
  }, [router, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <Chrome antes={<Outlet />} />
      <Toaster theme="dark" position="bottom-center" />
    </QueryClientProvider>
  );
}

function Chrome({ antes }: { antes: ReactNode }) {
  const { data: config } = useSuspenseQuery(configQuery);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const areaAdmin = pathname.startsWith("/admin") || pathname === "/auth";
  if (areaAdmin) return <>{antes}</>;
  const cfg = config ?? CONFIG_PADRAO;
  return (
    <>
      <SiteHeader config={cfg} />
      {antes}
      <SiteFooter config={cfg} />
      <WhatsAppFloat numero={cfg.whatsapp} />
    </>
  );
}
