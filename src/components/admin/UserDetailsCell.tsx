
import { TableCell } from "@/components/ui/table";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface UserUsage {
  palavras_chaves: number;
  mercado_publico_alvo: number;
  funil_busca: number;
  texto_seo_blog: number;
  texto_seo_lp: number;
  texto_seo_produto: number;
  pautas_blog: number;
  meta_dados: number;
}

interface UserDetailsProps {
  usage?: UserUsage;
}

export function UserDetailsCell({ usage }: UserDetailsProps) {
  // Calcular o uso total para fins de indicador visual
  const totalUsage = usage ? Object.values(usage).reduce((sum, curr) => sum + curr, 0) : 0;
  
  return (
    <TableCell>
      <div className="text-sm space-y-1">
        <div className="flex justify-between items-center">
          <p className="font-medium text-xs text-muted-foreground">USO DO SISTEMA</p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="w-80">
                <p className="text-xs">Contagem de todas as ferramentas utilizadas pelo usuário</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <p>Palavras-chave: {usage?.palavras_chaves || 0}</p>
        <p>Mercado/Público: {usage?.mercado_publico_alvo || 0}</p>
        <p>Funil de busca: {usage?.funil_busca || 0}</p>
        <p>Blog SEO: {usage?.texto_seo_blog || 0}</p>
        <p>LP SEO: {usage?.texto_seo_lp || 0}</p>
        <p>Produto SEO: {usage?.texto_seo_produto || 0}</p>
        <p>Pautas Blog: {usage?.pautas_blog || 0}</p>
        <p>Meta Dados: {usage?.meta_dados || 0}</p>
        
        <div className="mt-2 pt-2 border-t">
          <p className="font-medium">Total: {totalUsage}</p>
        </div>
      </div>
    </TableCell>
  );
}
