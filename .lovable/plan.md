# FLUENCY COLLECTION — site completo

Brechó de luxo masculino, conteúdo 100% em português do Brasil, tema escuro, mobile first.

## Notas de stack (importante)

O projeto já roda em **TanStack Start (React 19 + Vite 7 + TypeScript + Tailwind v4 + shadcn/ui)**, não em React Router. As rotas ficam em `src/routes/` e os tokens de design em `src/styles.css` (Tailwind v4 é CSS-first, não existe `tailwind.config.js`). O restante do pedido é atendido igual: Lovable Cloud (banco, autenticação, storage), react-three-fiber + drei para 3D e framer-motion para animação.

## Etapa 1 — Design system

- Tokens em `src/styles.css`: fundo `#05070F`, superfície `#0A0F1E`, borda branco 8%, azul de marca `#1B3BFF`, ciano `#4FD8FF`, azul profundo `#001B4D`, texto branco / corpo cinza-azulado 55%. Gradiente de destaque e brilhos internos como tokens. Zero cor quente, tema escuro fixo.
- Fontes via `<link>` no `__root.tsx`: sans geométrica + serifada itálica.
- Componente `<SplitTitle>` — recebe texto com `*trecho*` e renderiza o trecho em serifada itálica na mesma linha.
- Primitivos: pílula de vidro, botão glass com brilho azul, card de vidro com grade blueprint, skeletons.

## Sobre exportar os dados (resposta ao item 2)

Sim, dá para sair. O Lovable Cloud roda sobre Supabase e permite exportar tudo: o banco em Cloud → Overview → Advanced settings → Export data, e as fotos baixadas direto da view de Storage. Depois é possível conectar um Supabase da sua conta e recriar o schema lá. Não existe um botão único de migração, mas não há aprisionamento — o código também sai por Git. Por isso seguimos com Lovable Cloud (sem contas externas, mais rápido de montar).

## Etapa 2 — Banco de dados e storage (Lovable Cloud)

Tabelas `produtos`, `produto_imagens` (cascata), `configuracoes` (chave/valor: WhatsApp, textos da home, links) exatamente com os campos descritos. Bucket público `produtos`.

RLS: leitura pública nas três tabelas; escrita apenas para usuário autenticado. Sem cadastro público — o usuário admin é criado manualmente por você no painel do Cloud.

Na mesma migração entram **6 peças de exemplo** (marcas variadas, uma vendida e uma reservada) para você conseguir testar catálogo, filtros e página da peça antes de cadastrar as reais. São descartáveis: apagar pelo painel.

## Etapa 3 — Painel `/admin` (agora vem antes do catálogo)

Login email + senha. Lista em tabela com miniatura, código, marca, nome, tamanho, preço e status; filtro por status e busca. Formulário "Nova peça" com todos os campos e slug automático (marca + nome + código). Upload múltiplo com preview, reordenação por arrastar e exclusão (primeira foto = capa). Botão rápido de status (disponível / reservado / vendido) direto na linha. Aba "Configurações" para WhatsApp e textos da home. Tudo confortável no celular.

## Etapa 4 — Catálogo e página da peça (leve e rápido, sem 3D)

- `/pecas`: grade 2 colunas no celular / 3 no desktop, card 4:5 com marca, nome, tamanho, preço e selo "PEÇA ÚNICA"; hover troca para a segunda foto; vendidas em preto e branco com selo "VENDIDO", sem WhatsApp, empurradas para o fim. Filtros de categoria, marca, tamanho e faixa de preço; ordenação por recentes / menor / maior preço; "carregar mais"; skeleton e estado vazio.
- `/peca/:slug`: galeria deslizável com miniaturas e zoom, dados da peça, botão grande de WhatsApp com mensagem pronta (código, marca, nome, link), bloco de confiança, estado "Peça vendida" com atalho para o catálogo, "Você também pode gostar" (4 peças), e SEO por peça com open graph usando a foto de capa.


## Etapa 5 — Home versão vendedora (sem 3D)

Chrome fixo: topo transparente com blur ao rolar (logo, menu, botão WhatsApp), régua vertical de progresso à esquerda com porcentagem, botões sociais de vidro à direita, dica "↓ Role para ver".

Seções na ordem, já com o conteúdo final: hero em **gradiente azul estático** com a assinatura tipográfica e os dois botões; três cards de vidro com o central ativo; "Acabaram de chegar" (8 recentes); manifesto revelado palavra por palavra; destaques; autenticidade; como funciona em 4 passos; fechamento com chamada para @fluencycollection.

Movimento leve nesta fase: revelação de texto, cascata de cards, ritmo lento. Nada de 3D ainda.

## Etapa 6 — Páginas institucionais

`/autenticidade` (processo em etapas numeradas, com um espaço claramente marcado para você inserir depois o serviço de autenticação e o modelo de laudo — nenhum selo, parceria ou número inventado), `/como-comprar` (Pix ou cartão parcelado com juros, frete por conta do cliente, código de rastreio), `/sobre`, `/contato` (formulário que envia para o WhatsApp). Nenhuma página de devolução, prazo ou tabela de medidas.

## Etapa 7 — Acabamento

Botão flutuante de WhatsApp em todas as páginas, rodapé completo com espaço reservado para CNPJ e políticas, 404 na identidade, skeletons, estados vazios, acessibilidade básica e revisão final em tela de celular. Aqui o site já está no ar vendendo.

## Etapa 8 — O espetáculo 3D (por último)

Troca do hero estático pela cena 3D: cubo de blocos de vidro que se desmonta e remonta, paralaxe no mouse e reação à rolagem no celular; campo isométrico de cubos azuis no fundo da seção de autenticidade e da página `/autenticidade`; campo de estrelas no fechamento; transições geométricas entre seções e rolagem amortecida.

Desempenho: 3D carregado de forma assíncrona atrás do gradiente azul, geometria e resolução reduzidas no celular, e fallback no gradiente estático da etapa 5 quando não houver WebGL ou o usuário pedir movimento reduzido. O gradiente nunca é descartado — ele vira o fallback.


## Pendências suas

Número do WhatsApp e textos finais da home entram como valores padrão editáveis no painel de Configurações; nada de dado inventado sobre autenticação.
