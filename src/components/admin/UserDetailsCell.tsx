
import { TableCell } from "@/components/ui/table";

interface Usage {
  palavras_chaves: number;
  mercado_publico_alvo: number;
  funil_busca: number;
  texto_seo_blog: number;
  texto_seo_lp: number;
  texto_seo_produto: number;
  pautas_blog: number;
  meta_dados: number;
}

interface UserDetailsCellProps {
  usage?: Usage;
}

export function UserDetailsCell({ usage }: UserDetailsCellProps) {
  if (!usage) {
    return <TableCell>Nenhum uso registrado</TableCell>;
  }

  const totalUso = Object.values(usage).reduce((sum, val) => sum + val, 0);
  
  return (
    <TableCell>
      <div className="flex flex-col">
        <span className="font-medium">{totalUso} ações</span>
        <span className="text-xs text-muted-foreground">
          {usage.palavras_chaves > 0 && `${usage.palavras_chaves} palavras-chave, `}
          {usage.texto_seo_blog > 0 && `${usage.texto_seo_blog} textos blog`}
        </span>
      </div>
    </TableCell>
  );
}
