# FLUENCY COLLECTION — site completo

Brechó de luxo masculino, conteúdo 100% em português do Brasil, tema escuro, mobile first.

## Notas de stack (importante)

O projeto já roda em **TanStack Start (React 19 + Vite 7 + TypeScript + Tailwind v4 + shadcn/ui)**, não em React Router. As rotas ficam em `src/routes/` e os tokens de design em `src/styles.css` (Tailwind v4 é CSS-first, não existe `tailwind.config.js`). O restante do pedido é atendido igual: Lovable Cloud (banco, autenticação, storage), react-three-fiber + drei para 3D e framer-motion para animação.

## Etapa 1 — Design system

- Tokens em `src/styles.css`: fundo `#05070F`, superfície `#0A0F1E`, borda branco 8%, azul de marca `#1B3BFF`, ciano `#4FD8FF`, azul profundo `#001B4D`, texto branco / corpo cinza-azulado 55%. Gradiente de destaque e brilhos internos como tokens. Zero cor quente, tema escuro fixo.
- Fontes via `<link>` no `__root.tsx`: sans geométrica + serifada itálica.
- Componente `<SplitTitle>` — recebe texto com `*trecho*` e renderiza o trecho em serifada itálica na mesma linha.
- Primitivos: pílula de vidro, botão glass com brilho azul, card de vidro com grade blueprint, skeletons.

## Etapa 2 — Banco de dados e storage (Lovable Cloud)

Tabelas `produtos`, `produto_imagens` (cascata), `configuracoes` (chave/valor: WhatsApp, textos da home, links) exatamente com os campos descritos. Bucket público `produtos`.

RLS: leitura pública nas três tabelas; escrita apenas para usuário autenticado. Sem cadastro público — o usuário admin é criado manualmente por você no painel do Cloud.

## Etapa 3 — Catálogo e página da peça (leve e rápido, sem 3D)

- `/pecas`: grade 2 colunas no celular / 3 no desktop, card 4:5 com marca, nome, tamanho, preço e selo "PEÇA ÚNICA"; hover troca para a segunda foto; vendidas em preto e branco com selo "VENDIDO", sem WhatsApp, empurradas para o fim. Filtros de categoria, marca, tamanho e faixa de preço; ordenação por recentes / menor / maior preço; "carregar mais"; skeleton e estado vazio.
- `/peca/:slug`: galeria deslizável com miniaturas e zoom, dados da peça, botão grande de WhatsApp com mensagem pronta (código, marca, nome, link), bloco de confiança, estado "Peça vendida" com atalho para o catálogo, "Você também pode gostar" (4 peças), e SEO por peça com open graph usando a foto de capa.

## Etapa 4 — Painel `/admin`

Login email + senha. Lista em tabela com miniatura, código, marca, nome, tamanho, preço e status; filtro por status e busca. Formulário "Nova peça" com todos os campos e slug automático (marca + nome + código). Upload múltiplo com preview, reordenação por arrastar e exclusão (primeira foto = capa). Botão rápido de status (disponível / reservado / vendido) direto na linha. Aba "Configurações" para WhatsApp e textos da home. Tudo confortável no celular.

## Etapa 5 — Home (o espetáculo)

Chrome fixo: topo transparente com blur ao rolar (logo, menu, botão WhatsApp), régua vertical de progresso à esquerda com porcentagem, botões sociais de vidro à direita, dica "↓ Role para ver".

Seções na ordem: hero com cubo 3D de blocos de vidro que se desmonta e remonta (paralaxe no mouse, rolagem no celular); três cards de vidro com o central ativo; "Acabaram de chegar" (8 recentes); manifesto revelado palavra por palavra sobre fitas de luz; destaques; autenticidade com campo isométrico de cubos azuis; como funciona em 4 passos; fechamento com campo de estrelas e chamada para @fluencycollection.

Movimento: transições geométricas (nunca fade simples), texto palavra a palavra, cards em cascata, ritmo lento, rolagem amortecida, brilho interno.

Desempenho: 3D carregado de forma assíncrona atrás de um gradiente azul, geometria e resolução reduzidas no celular, e fallback em gradiente estático quando não houver WebGL ou o usuário pedir movimento reduzido.

## Etapa 6 — Páginas institucionais

`/autenticidade` (processo em etapas numeradas, fundo de cubos azuis, com um espaço claramente marcado para você inserir depois o serviço de autenticação e o modelo de laudo — nenhum selo, parceria ou número inventado), `/como-comprar` (Pix ou cartão parcelado com juros, frete por conta do cliente, código de rastreio), `/sobre`, `/contato` (formulário que envia para o WhatsApp). Nenhuma página de devolução, prazo ou tabela de medidas.

## Etapa 7 — Acabamento

Botão flutuante de WhatsApp em todas as páginas, rodapé completo com espaço reservado para CNPJ e políticas, 404 na identidade, skeletons, estados vazios, acessibilidade básica e revisão final em tela de celular.

## Pendências suas

Número do WhatsApp e textos finais da home entram como valores padrão editáveis no painel de Configurações; nada de dado inventado sobre autenticação.
