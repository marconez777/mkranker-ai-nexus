
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
        {topoFunil.length > 0 && renderTable(topoFunil, "Palavras-Chave do Topo do Funil")}
        {meioFunil.length > 0 && renderTable(meioFunil, "Palavras-Chave do Meio do Funil")}
        {fundoFunil.length > 0 && renderTable(fundoFunil, "Palavras-Chave do Fundo do Funil")}
      </div>
    );
  } else {
    // Default display with markdown for mercado, texto, and other types
    return (
      <div className="prose prose-sm max-w-none dark:prose-invert mt-4">
        <ReactMarkdown 
          className="prose prose-sm max-w-none dark:prose-invert"
          components={{
            h1: ({node, ...props}) => <h1 className="text-xl font-bold mt-6 mb-4 first:mt-0" {...props} />,
            h2: ({node, ...props}) => <h2 className="text-lg font-semibold mt-5 mb-3" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-base font-medium mt-4 mb-2" {...props} />,
            h4: ({node, ...props}) => <h4 className="text-sm font-medium mt-3 mb-1" {...props} />,
            p: ({node, ...props}) => <p className="mb-3 text-sm leading-relaxed" {...props} />,
            ul: ({node, ...props}) => <ul className="my-3 list-disc pl-5 space-y-1" {...props} />,
            ol: ({node, ...props}) => <ol className="my-3 list-decimal pl-5 space-y-1" {...props} />,
            li: ({node, ...props}) => <li className="text-sm ml-2" {...props} />
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
  // Initialize with empty arrays
  const topoFunil: any[] = [];
  const meioFunil: any[] = [];
  const fundoFunil: any[] = [];
  
  // If text isn't a string, return empty arrays
  if (typeof text !== 'string') {
    return { topoFunil, meioFunil, fundoFunil };
  }
  
  const lines = text.split('\n');
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
