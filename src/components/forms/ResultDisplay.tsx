
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
}

export const ResultDisplay = ({ resultado }: ResultDisplayProps) => {
  if (!resultado) return null;
  
  // Process the resultado to handle both JSON and plain text formats
  let formattedResult = resultado;
  try {
    const parsedData = JSON.parse(resultado);
    if (parsedData && parsedData.output) {
      formattedResult = parsedData.output;
    }
  } catch (e) {
    console.log("Não foi possível analisar o resultado como JSON:", e);
  }
  
  // Clean up any escaped characters
  formattedResult = formattedResult
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '')
    .replace(/\\"/g, '"')
    .replace(/\\\*/g, '*')
    .replace(/\\#/g, '#')
    .replace(/\\_/g, '_');

  // Extract table data from markdown-formatted response
  const tableData = extractTableData(formattedResult);
  
  return (
    <div className="mt-6 space-y-2">
      <div className="flex items-center gap-2">
        <TableProperties className="h-5 w-5" />
        <h3 className="text-lg font-medium">Resultado da Análise de Palavras-Chave:</h3>
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
            {tableData.map((row, index) => (
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
};

// Helper function to extract table data from markdown text
function extractTableData(text: string) {
  const lines = text.split('\n');
  const tableData = [];
  
  let inTable = false;
  
  for (const line of lines) {
    // Skip empty lines
    if (!line.trim()) continue;
    
    // Check if we've found a table row with pipe separators
    if (line.includes('|')) {
      // Skip table header separator rows (containing ----)
      if (line.includes('--')) continue;
      
      // Mark that we're in a table
      inTable = true;
      
      // Split by | and remove empty entries from start/end
      const cells = line.split('|')
        .map(cell => cell.trim())
        .filter(cell => cell);
      
      // Only process if we have at least 3 columns
      if (cells.length >= 3) {
        tableData.push({
          palavraChave: cells[0],
          volumeBusca: cells[1],
          cpc: cells[2]
        });
      }
    } else if (inTable) {
      // If we were in a table but hit a non-table line, we're done with this table section
      inTable = false;
    }
  }
  
  return tableData;
}
