
import { TableProperties } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface FunnelTableProps {
  title: string;
  data: {
    palavraChave: string;
    volumeBusca: string;
    cpc: string;
  }[];
}

const FunnelTable = ({ title, data }: FunnelTableProps) => (
  <div className="mt-6 space-y-2 text-left">
    <div className="flex items-center gap-2">
      <TableProperties className="h-5 w-5" />
      <h3 className="text-lg font-medium">{title}:</h3>
    </div>
    <div className="rounded-md border bg-white overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Palavra-Chave</TableHead>
            <TableHead>Volume de Busca Mensal (Estimado)</TableHead>
            <TableHead>CPC (Estimado)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.palavraChave}</TableCell>
              <TableCell>{row.volumeBusca}</TableCell>
              <TableCell>{row.cpc}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
);

interface FunnelTableDisplayProps {
  formattedResult: string;
}

export const FunnelTableDisplay = ({ formattedResult }: FunnelTableDisplayProps) => {
  const { topoFunil, meioFunil, fundoFunil } = extractTableData(formattedResult);

  return (
    <div className="text-left">
      {topoFunil.length > 0 && <FunnelTable title="Palavras-Chave do Topo do Funil" data={topoFunil} />}
      {meioFunil.length > 0 && <FunnelTable title="Palavras-Chave do Meio do Funil" data={meioFunil} />}
      {fundoFunil.length > 0 && <FunnelTable title="Palavras-Chave do Fundo do Funil" data={fundoFunil} />}
    </div>
  );
};

// Helper function to extract and categorize table data from markdown text
function extractTableData(text: string) {
  const results = {
    topoFunil: [] as any[],
    meioFunil: [] as any[],
    fundoFunil: [] as any[]
  };

  // Verificar se temos dados para processar
  if (!text) return results;

  // Identificar as seções do funil no texto
  const sections = {
    topo: /\*\*1\s*-\s*Topo do Funil.*?\n\n(.*?)(?=\n\n\*\*2|\n\n\*\*3|$)/s,
    meio: /\*\*2\s*-\s*Meio do Funil.*?\n\n(.*?)(?=\n\n\*\*3|$)/s,
    fundo: /\*\*3\s*-\s*Fundo do Funil.*?\n\n(.*?)(?=$)/s,
  };

  // Função para extrair linhas de tabela da seção de markdown
  const extractTableRows = (sectionContent: string) => {
    if (!sectionContent) return [];
    
    // Extrair linhas da tabela (ignorando cabeçalho e separador)
    const lines = sectionContent.split('\n')
      .filter(line => line.trim().startsWith('|')) // Apenas linhas da tabela
      .filter((line, index) => index > 1); // Ignorar cabeçalho e separador
    
    return lines.map(line => {
      // Extrair valores das colunas
      const columns = line.split('|')
        .filter(col => col.trim() !== '')
        .map(col => col.trim());
      
      if (columns.length >= 3) {
        return {
          palavraChave: columns[0],
          volumeBusca: columns[1],
          cpc: columns[2]
        };
      }
      return null;
    }).filter(row => row !== null);
  };

  // Extrair dados das seções
  const topoMatch = text.match(sections.topo);
  if (topoMatch && topoMatch[1]) {
    results.topoFunil = extractTableRows(topoMatch[1]);
  }

  const meioMatch = text.match(sections.meio);
  if (meioMatch && meioMatch[1]) {
    results.meioFunil = extractTableRows(meioMatch[1]);
  }

  const fundoMatch = text.match(sections.fundo);
  if (fundoMatch && fundoMatch[1]) {
    results.fundoFunil = extractTableRows(fundoMatch[1]);
  }

  return results;
}
