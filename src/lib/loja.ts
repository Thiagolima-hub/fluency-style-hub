export const CATEGORIAS = [
  { valor: "tenis", rotulo: "Tênis" },
  { valor: "camiseta", rotulo: "Camiseta" },
  { valor: "polo", rotulo: "Polo" },
  { valor: "camisa", rotulo: "Camisa" },
  { valor: "moletom", rotulo: "Moletom" },
  { valor: "jaqueta", rotulo: "Jaqueta" },
  { valor: "calca", rotulo: "Calça" },
  { valor: "short", rotulo: "Short" },
  { valor: "acessorio", rotulo: "Acessório" },
] as const;

export const CONDICOES = [
  "nova com etiqueta",
  "seminova",
  "usada em ótimo estado",
] as const;

export const STATUS = [
  { valor: "disponivel", rotulo: "Disponível" },
  { valor: "reservado", rotulo: "Reservado" },
  { valor: "vendido", rotulo: "Vendido" },
] as const;

export type StatusPeca = (typeof STATUS)[number]["valor"];

export function rotuloCategoria(valor: string) {
  return CATEGORIAS.find((c) => c.valor === valor)?.rotulo ?? valor;
}

export function formatPreco(valor: number | string) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

export function slugify(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function slugPeca(marca: string, nome: string, codigo: string) {
  return slugify(`${marca} ${nome} ${codigo}`);
}

/** Resolve o campo `url` de produto_imagens: caminho do bucket vira rota pública de imagem. */
export function imgSrc(url: string | null | undefined) {
  if (!url) return "/exemplos/peca-1.jpg";
  if (url.startsWith("http") || url.startsWith("/")) return url;
  return `/api/public/img/${url}`;
}

export function waLink(numero: string, mensagem: string) {
  return `https://wa.me/${numero.replace(/\D/g, "")}?text=${encodeURIComponent(mensagem)}`;
}

export function waMensagemPeca(
  numero: string,
  peca: { codigo: string; marca: string; nome: string; slug: string },
  origem?: string,
) {
  const link = `${origem ?? ""}/peca/${peca.slug}`;
  return waLink(
    numero,
    `Olá! Tenho interesse na peça ${peca.codigo} — ${peca.marca} ${peca.nome}. Link: ${link}`,
  );
}

export interface ConfigLoja {
  whatsapp: string;
  instagram: string;
  home_hero_titulo: string;
  home_hero_subtitulo: string;
  home_manifesto: string;
  home_fechamento: string;
}

export const CONFIG_PADRAO: ConfigLoja = {
  whatsapp: "5511999999999",
  instagram: "fluencycollection",
  home_hero_titulo: "Luxo masculino, *autenticado*",
  home_hero_subtitulo:
    "Peças de grife selecionadas uma a uma. Cada peça é única: vendeu, acabou.",
  home_manifesto:
    "Curadoria de luxo masculino. Nada de lote, nada de repetição: cada peça entra na coleção porque passou por conferência de procedência, condição e caimento. O que você vê aqui existe uma vez só.",
  home_fechamento: "Peças *raras*, uma de cada",
};
