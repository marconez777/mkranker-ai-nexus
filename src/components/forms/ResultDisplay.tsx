
import ReactMarkdown from 'react-markdown';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableProperties } from "lucide-react";

interface ResultDisplayProps {
  resultado: string;
  type?: 'funil' | 'mercado' | 'palavras' | 'texto';
}

export const ResultDisplay = ({ resultado, type = 'mercado' }: ResultDisplayProps) => {
  if (!resultado) return null;
  
  // Process the resultado to handle both JSON and plain text formats
  let formattedResult = resultado;
  try {
    // Only try to parse if it looks like JSON (starts with { or [)
    if (typeof resultado === 'string' && (resultado.trim().startsWith('{') || resultado.trim().startsWith('['))) {
      const parsedData = JSON.parse(resultado);
      if (parsedData && parsedData.output) {
        formattedResult = parsedData.output;
      }
    }
  } catch (e) {
    console.log("Resultado não é um JSON válido, usando texto original");
  }
  
  // Clean up any escaped characters
  if (typeof formattedResult === 'string') {
    formattedResult = formattedResult
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '')
      .replace(/\\"/g, '"')
      .replace(/\\\*/g, '*')
      .replace(/\\#/g, '#')
      .replace(/\\_/g, '_');
  }

  // For 'funil' type, extract and display table data
  if (type === 'funil') {
    // Extract table data from markdown-formatted response and categorize by funnel stage
    const { topoFunil, meioFunil, fundoFunil } = extractTableData(formattedResult);
    
    const renderTable = (data: any[], title: string) => (
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

    return (
      <div className="text-left">
        {topoFunil.length > 0 && renderTable(topoFunil, "Palavras-Chave do Topo do Funil")}
        {meioFunil.length > 0 && renderTable(meioFunil, "Palavras-Chave do Meio do Funil")}
        {fundoFunil.length > 0 && renderTable(fundoFunil, "Palavras-Chave do Fundo do Funil")}
      </div>
    );
  } else {
    // Default display with markdown for mercado, texto, and other types
    return (
      <div className="prose prose-sm max-w-none dark:prose-invert mt-4 text-left">
        <ReactMarkdown 
          className="prose prose-sm max-w-none dark:prose-invert text-left"
          components={{
            h1: ({node, ...props}) => <h1 className="text-xl font-bold mt-6 mb-4 first:mt-0 text-left" {...props} />,
            h2: ({node, ...props}) => <h2 className="text-lg font-semibold mt-5 mb-3 text-left" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-base font-medium mt-4 mb-2 text-left" {...props} />,
            h4: ({node, ...props}) => <h4 className="text-sm font-medium mt-3 mb-1 text-left" {...props} />,
            p: ({node, ...props}) => <p className="mb-3 text-sm leading-relaxed text-left" {...props} />,
            ul: ({node, ...props}) => <ul className="my-3 list-disc pl-5 space-y-1 text-left" {...props} />,
            ol: ({node, ...props}) => <ol className="my-3 list-decimal pl-5 space-y-1 text-left" {...props} />,
            li: ({node, ...props}) => <li className="text-sm ml-2 text-left" {...props} />
          }}
        >
          {formattedResult}
        </ReactMarkdown>
      </div>
    );
  }
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

