
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

  // Extract table data from markdown-formatted response and categorize by funnel stage
  const { topoFunil, meioFunil, fundoFunil } = extractTableData(formattedResult);
  
  const renderTable = (data: any[], title: string) => (
    <div className="mt-6 space-y-2">
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
    <div>
      {renderTable(topoFunil, "Palavras-Chave do Topo do Funil")}
      {renderTable(meioFunil, "Palavras-Chave do Meio do Funil")}
      {renderTable(fundoFunil, "Palavras-Chave do Fundo do Funil")}
    </div>
  );
};

// Helper function to extract and categorize table data from markdown text
function extractTableData(text: string) {
  const lines = text.split('\n');
  const topoFunil: any[] = [];
  const meioFunil: any[] = [];
  const fundoFunil: any[] = [];
  
  let currentSection = '';
  let isHeaderRow = false;
  let foundHeaderSeparator = false;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Identify the current section based on headers
    if (trimmedLine.toLowerCase().includes('topo do funil')) {
      currentSection = 'topo';
      isHeaderRow = true; // Next row will be the header
      foundHeaderSeparator = false;
      continue;
    } else if (trimmedLine.toLowerCase().includes('meio do funil')) {
      currentSection = 'meio';
      isHeaderRow = true; // Next row will be the header
      foundHeaderSeparator = false;
      continue;
    } else if (trimmedLine.toLowerCase().includes('fundo do funil')) {
      currentSection = 'fundo';
      isHeaderRow = true; // Next row will be the header
      foundHeaderSeparator = false;
      continue;
    }
    
    // Skip empty lines
    if (!trimmedLine) continue;
    
    // Check for header separator (line with dashes)
    if (trimmedLine.includes('--')) {
      foundHeaderSeparator = true;
      isHeaderRow = false;
      continue;
    }
    
    // Skip header rows
    if (isHeaderRow) {
      isHeaderRow = false;
      continue;
    }
    
    // Only process table rows after we've found the header separator
    if (line.includes('|') && foundHeaderSeparator) {
      const cells = line.split('|')
        .map(cell => cell.trim())
        .filter(cell => cell);
      
      if (cells.length >= 3) {
        const rowData = {
          palavraChave: cells[0],
          volumeBusca: cells[1],
          cpc: cells[2]
        };
        
        // Add to appropriate section
        switch (currentSection) {
          case 'topo':
            topoFunil.push(rowData);
            break;
          case 'meio':
            meioFunil.push(rowData);
            break;
          case 'fundo':
            fundoFunil.push(rowData);
            break;
        }
      }
    }
  }
  
  return { topoFunil, meioFunil, fundoFunil };
}
