
import { TableCell } from "@/components/ui/table";

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
  return (
    <TableCell>
      <div className="text-sm">
        <p>Palavras-chave: {usage?.palavras_chaves || 0}</p>
        <p>Mercado/Público: {usage?.mercado_publico_alvo || 0}</p>
        <p>Funil de busca: {usage?.funil_busca || 0}</p>
        <p>Blog SEO: {usage?.texto_seo_blog || 0}</p>
      </div>
    </TableCell>
  );
}
