
import {
  BookOpen,
  Clipboard,
  File,
  FileText,
  Home,
  Search,
  Users,
} from "lucide-react";

export const generalMenuItems = [
  {
    icon: Home,
    text: "Dashboard",
    to: "/dashboard",
  },
  {
    icon: Users,
    text: "Administração",
    to: "/admin",
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
