
import {
  BookOpen,
  Clipboard,
  File,
  FileText,
  Home,
  KeySquare,
  Search,
} from "lucide-react";

export const generalMenuItems = [
  {
    icon: Home,
    text: "Dashboards",
    to: "/dashboard",
  },
];

export const appsMenuItems = [
  {
    icon: FileText,
    text: "Mercado e Público Alvo",
    to: "/mercado-publico-alvo",
  },
  {
    icon: Search,
    text: "Funil de Busca",
    to: "/funil-de-busca",
  },
  {
    icon: KeySquare,
    text: "Palavras Chaves",
    to: "/palavras-chaves",
  },
  {
    icon: File,
    text: "Texto SEO para LP",
    to: "/texto-seo-lp",
  },
  {
    icon: File,
    text: "Texto SEO para Produto",
    to: "/texto-seo-produto",
  },
  {
    icon: File,
    text: "Texto SEO para Blog",
    to: "/texto-seo-blog",
  },
  {
    icon: BookOpen,
    text: "Pautas para Blog",
    to: "/pautas-blog",
  },
  {
    icon: Clipboard,
    text: "Meta Dados",
    to: "/meta-dados",
  },
];
