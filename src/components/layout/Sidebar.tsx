
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  ChevronDown,
  Clipboard,
  File,
  FileText,
  Home,
  KeySquare,
  Search,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger, 
} from "@/components/ui/collapsible";
import { useState } from "react";

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  to: string;
  active?: boolean;
}

const SidebarItem = ({ icon, text, to, active }: SidebarItemProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link to={to} className="w-full">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2 px-3",
                active && "bg-accent text-accent-foreground"
              )}
            >
              {icon}
              <span className="truncate">{text}</span>
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const SidebarSection = ({ title, children, defaultOpen = true }: SidebarSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full space-y-1"
    >
      <CollapsibleTrigger className="w-full">
        <div className="flex items-center justify-between px-3 py-2 text-xs font-medium text-muted-foreground">
          <span>{title}</span>
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")}
          />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-1">{children}</CollapsibleContent>
    </Collapsible>
  );
};

export function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="flex h-full min-h-screen w-64 flex-col border-r bg-sidebar">
      <div className="flex h-14 items-center border-b px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
          <span className="text-mkranker-purple">MKRanker</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <div className="flex flex-col gap-2 px-2">
          <SidebarSection title="GENERAL">
            <SidebarItem
              icon={<Home className="h-4 w-4" />}
              text="Dashboards"
              to="/dashboard"
              active={currentPath === "/dashboard"}
            />
          </SidebarSection>

          <SidebarSection title="APPS">
            <SidebarItem
              icon={<FileText className="h-4 w-4" />}
              text="Mercado e Público Alvo"
              to="/mercado-publico-alvo"
              active={currentPath === "/mercado-publico-alvo"}
            />
            <SidebarItem
              icon={<Search className="h-4 w-4" />}
              text="Funil de Busca"
              to="/funil-de-busca"
              active={currentPath === "/funil-de-busca"}
            />
            <SidebarItem
              icon={<KeySquare className="h-4 w-4" />}
              text="Palavras Chaves"
              to="/palavras-chaves"
              active={currentPath === "/palavras-chaves"}
            />
            <SidebarItem
              icon={<File className="h-4 w-4" />}
              text="Texto SEO para LP"
              to="/texto-seo-lp"
              active={currentPath === "/texto-seo-lp"}
            />
            <SidebarItem
              icon={<File className="h-4 w-4" />}
              text="Texto SEO para Produto"
              to="/texto-seo-produto"
              active={currentPath === "/texto-seo-produto"}
            />
            <SidebarItem
              icon={<File className="h-4 w-4" />}
              text="Texto SEO para Categoria"
              to="/texto-seo-categoria"
              active={currentPath === "/texto-seo-categoria"}
            />
            <SidebarItem
              icon={<File className="h-4 w-4" />}
              text="Texto SEO para Blog"
              to="/texto-seo-blog"
              active={currentPath === "/texto-seo-blog"}
            />
            <SidebarItem
              icon={<BookOpen className="h-4 w-4" />}
              text="Pautas para Blog"
              to="/pautas-blog"
              active={currentPath === "/pautas-blog"}
            />
            <SidebarItem
              icon={<Clipboard className="h-4 w-4" />}
              text="Meta Dados"
              to="/meta-dados"
              active={currentPath === "/meta-dados"}
            />
          </SidebarSection>
        </div>
      </div>
    </div>
  );
}
