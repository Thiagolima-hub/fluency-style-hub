# Fluency Luxe

Construa o site completo da FLUENCY COLLECTION — um brechó de luxo masculino brasileiro que vende peças de grife autênticas usadas e seminovas (Louis Vuitton, Gucci, Prada, Balenciaga, Off-White, Dior, Amiri). Todo o conteúdo em português do Brasil.

Stack: React + Vite + TypeScript + Tailwind + shadcn/ui, Supabase para banco de dados, autenticação e storage, react-three-fiber com @react-three/drei para 3D, framer-motion para animação.

================================
1. IDENTIDADE VISUAL
================================

Tema escuro sempre. Referência de linguagem: sites institucionais de tecnologia financeira de alto padrão — preto azulado, azul elétrico, vidro, brilho interno, muito respiro.

Paleta (defina como CSS custom properties no index.css e como tokens no tailwind.config; nenhuma cor hardcoded nos componentes):
- Fundo: #05070F. Superfícies: #0A0F1E. Bordas: branco a 8% de opacidade.
- Azul de marca: #1B3BFF. Gradiente de destaque: #1B3BFF para #4FD8FF (ciano).
- Azul profundo para sombras e brilhos: #001B4D.
- Texto: branco puro nos títulos, cinza-azulado a 55% no corpo.
- Zero cor quente. Tudo monocromático azul sobre preto.

A logo da marca é um "F" preto com um raio azul cortando, dentro de um arco azul. A linguagem visual deve conversar com isso: diagonais, energia, alto contraste, brilho azul.

ASSINATURA TIPOGRÁFICA — é o detalhe mais importante do design. Todo título grande mistura DOIS tipos na MESMA linha: sans-serif geométrica em peso regular, e uma serifada ITÁLICA elegante na palavra enfatizada. Crie um componente reutilizável que receba o texto e renderize o trecho marcado em serifada itálica. Use assim:
"Luxo masculino, *autenticado*"
"Peças *raras*, uma de cada"
"Grife de verdade, *procedência* de verdade"
Corpo de texto: sans pequena, coluna curta de cerca de 45 caracteres.

Botões e pílulas: totalmente arredondados, pequenos, com efeito de vidro fosco (glassmorphism) e brilho azul. Nada de sombra projetada dura — tudo tem brilho interno.

MOBILE FIRST, sem negociação: quase todo o tráfego vem do Instagram no celular. Todo layout precisa ficar impecável em tela de celular antes de qualquer coisa.

================================
2. BANCO DE DADOS (Supabase)
================================

Tabela produtos:
id (uuid), codigo (texto único, ex FC-001), marca, nome, slug (texto único), categoria (tenis, camiseta, polo, camisa, moletom, jaqueta, calca, short, acessorio), tamanho (PP, P, M, G, GG ou numeração), condicao (nova com etiqueta, seminova, usada em ótimo estado), preco (numérico), preco_parcelado_texto, descricao (texto longo), medidas (texto, opcional), status (disponivel, reservado, vendido), destaque (booleano), ordem (inteiro), created_at.

Tabela produto_imagens:
id, produto_id (referência a produtos, deleta em cascata), url, ordem, created_at.

Tabela configuracoes:
chave (texto único), valor (texto). Guarda número do WhatsApp, textos da home e links.

Storage: bucket público "produtos" para as fotos.

Segurança (RLS): visitante lê produtos, imagens e configurações. Apenas usuário autenticado cria, edita ou apaga.

================================
3. PAINEL ADMINISTRATIVO em /admin
================================

Login por email e senha via Supabase Auth. Sem cadastro público — o usuário será criado manualmente por mim no Supabase.

Depois de logado:
- Lista de todas as peças em tabela, com miniatura, código, marca, nome, tamanho, preço e status. Filtro por status e busca por texto.
- Botão "Nova peça" abrindo formulário com todos os campos.
- Upload de múltiplas fotos por peça, com preview, reordenação por arrastar e opção de excluir. A primeira foto é a capa.
- Slug gerado automaticamente a partir de marca, nome e código.
- Em cada linha, um botão rápido para alternar o status entre disponível, reservado e vendido, sem abrir o formulário. Isso é crítico: as peças são únicas, preciso marcar como vendida em segundos.
- Aba "Configurações" para editar o número do WhatsApp e os textos da home.
- O painel inteiro precisa ser confortável de operar pelo celular.

================================
4. CATÁLOGO E PÁGINA DA PEÇA
================================

CONCEITO CENTRAL: cada peça é ÚNICA. Não existe estoque, não existe variação de tamanho, não existe carrinho. Vendeu, acabou. Isso precisa estar visível na experiência, porque é o que gera urgência.

ATENÇÃO — o catálogo e a página da peça ficam LIMPOS E RÁPIDOS. Nada de 3D, scroll amortecido ou transição pesada aqui. Quem chega vem do Instagram e quer ver peça e preço. Animação pesada só na home e nas páginas institucionais.

/pecas — catálogo
- Grade de cards: 2 colunas no celular, 3 no desktop.
- Card: foto 4:5, marca em cima em letras pequenas espaçadas, nome, tamanho, preço, selo discreto "PEÇA ÚNICA".
- Hover: leve elevação, borda com brilho azul, troca para a segunda foto.
- Peça vendida: card em preto e branco, selo "VENDIDO" atravessado, sem link de WhatsApp. Vai para o fim da lista mas nunca some — é prova social de que a loja vende.
- Filtros no topo: categoria, marca, tamanho, faixa de preço. Ordenar por mais recentes, menor preço, maior preço.
- Carregamento em blocos com botão "carregar mais".

/peca/:slug — página da peça
- Galeria grande, deslizável no celular, com miniaturas e zoom ao clicar.
- Ao lado: marca, nome, código, tamanho, condição, preço à vista, texto do parcelamento, descrição, medidas quando existirem.
- Botão principal grande em azul com brilho: "Falar sobre esta peça no WhatsApp". Abre wa.me com mensagem pronta contendo código, marca, nome da peça e o link da página.
- Logo abaixo, bloco de confiança: peças autenticadas, envio para todo o Brasil, atendimento humano, peça única.
- Se estiver vendida: botão desabilitado "Peça vendida" e um segundo botão "Ver peças disponíveis".
- Ao final, "Você também pode gostar" com 4 peças da mesma categoria ou faixa de preço.
- SEO: título e meta descrição gerados da peça, e imagem de compartilhamento (open graph) usando a foto de capa. Quando eu mandar o link no WhatsApp precisa aparecer bonito.

================================
5. HOME — aqui mora o espetáculo
================================

Elementos fixos em toda a home, no estilo da referência de tecnologia financeira:
- Barra de topo transparente com blur ao rolar: logo à esquerda, menu ao centro (Peças, Autenticidade, Como comprar, Sobre), botão sólido de WhatsApp à direita.
- Na borda esquerda, um indicador de progresso de rolagem: barra vertical segmentada tipo régua, com a porcentagem em número pequeno embaixo.
- Na borda direita, botões sociais empilhados (Instagram e WhatsApp) em quadrados arredondados de vidro fosco com ícone azul.
- No canto inferior direito na primeira tela, a dica "↓ Role para ver".

Seções, nesta ordem:

1) HERO — tela inteira. Pílula pequena de vidro com "· Brechó de luxo masculino". Título com a assinatura tipográfica. No centro, cena 3D: um cubo grande formado por blocos menores de vidro translúcido, iluminados por dentro em branco e azul, girando devagar e se desmontando e remontando no ar, com blocos flutuando ao redor. Reage ao mouse com paralaxe leve; no celular, reage à rolagem. Ao rolar, os blocos se dispersam e a câmera avança. Dois botões: "Ver peças" e "Falar no WhatsApp".

2) TRÊS CARDS entrando por baixo do hero: cards escuros de vidro, borda fina, grade sutil tipo blueprint por dentro, ícone em linha no topo — "Peças autenticadas", "Envio para todo o Brasil", "Atendimento humano no WhatsApp". O card central em estado ativo: maior, iluminado, com brilho azul; os laterais mais apagados.

3) ACABARAM DE CHEGAR — carrossel com as 8 peças mais recentes.

4) MANIFESTO — texto curto sobre curadoria de luxo masculino, revelado PALAVRA POR PALAVRA conforme rola: as palavras já reveladas ficam brancas, as pendentes cinza-escuro. Ao fundo, fitas finas de luz branca cruzando o preto em curva.

5) DESTAQUES — as peças marcadas como destaque.

6) AUTENTICIDADE — fundo com campo isométrico de cubos azuis brilhantes ocupando a tela, câmera voando por dentro. Por cima, o processo de verificação em etapas numeradas e botão para a página completa.

7) COMO FUNCIONA — quatro passos: escolha a peça, chame no WhatsApp, pague no Pix ou parcelado, receba em casa.

8) FECHAMENTO — campo de pequenos quadrados brancos como estrelas, mais densos nas bordas. Texto centralizado com a assinatura tipográfica e chamada para o Instagram @fluencycollection.

MOVIMENTO — o que copiar da referência:
- Transições entre seções são geométricas, nunca fade simples: cubo explodindo, losango de luz girando como cortina, dissolução em mosaico de ladrilhos.
- Texto entra por revelação palavra a palavra ou linha a linha, nunca em bloco.
- Cards entram em cascata, com atraso entre eles.
- Ritmo lento e pesado, cada seção respira. Rolagem suave e amortecida.
- Tudo com brilho interno, nada com sombra dura.

DESEMPENHO — regra obrigatória:
- No celular, reduza drasticamente a quantidade de geometria e a resolução de renderização. O site precisa abrir rápido em 4G.
- Carregue as cenas 3D de forma assíncrona, depois do resto da página, exibindo um gradiente azul enquanto carrega.
- Se o aparelho não suportar WebGL ou o usuário tiver "reduzir movimento" ativado, troque a cena por um fundo em gradiente estático. O site NUNCA pode quebrar por causa do 3D.

================================
6. PÁGINAS INSTITUCIONAIS
================================

/autenticidade — a página mais importante depois do catálogo, porque o medo de réplica é a maior objeção de quem compra grife usada. Processo de verificação em etapas numeradas, visual forte, fundo com cubos azuis. Deixe um espaço claramente marcado para eu inserir depois o nome do serviço de autenticação e o modelo de laudo. NÃO invente selo, certificado, parceria ou número de peças autenticadas.

/como-comprar — escolher a peça no site ou no Instagram, chamar no WhatsApp, tirar dúvidas de tamanho e condição, pagar no Pix ou parcelado no cartão com juros, e receber com código de rastreio. Deixe claro que o frete é por conta do cliente.

/sobre — texto curto de marca sobre curadoria de luxo masculino, com link para o Instagram.

/contato — WhatsApp, Instagram e formulário simples que envia para o WhatsApp.

NÃO crie página de devolução, prazo de entrega ou tabela de medidas. A política ainda não está definida e não quero informação inventada no ar.

================================
7. ACABAMENTO
================================

- Botão flutuante de WhatsApp no canto inferior direito em todas as páginas, com o brilho azul da marca.
- Rodapé: logo, frase da marca, links das páginas, Instagram @fluencycollection, WhatsApp, e espaço reservado para CNPJ e políticas.
- Página 404 dentro da identidade visual.
- Esqueleto de carregamento (skeleton) em todas as listas.
- Estado vazio no catálogo quando o filtro não retornar nada.
- Acessibilidade básica: contraste, texto alternativo nas imagens, navegação por teclado.
- Revise o site inteiro em tela de celular antes de finalizar.

Comece pelo design system e pela estrutura de dados, depois construa da etapa 3 em diante na ordem.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://fluency-style-hub.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f2d6aa7e-9a94-4b7c-a6d3-bebcffc059d2).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
