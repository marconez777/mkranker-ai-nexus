
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
  
  // Clean up any escaped newlines or markdown characters
  formattedResult = formattedResult
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '')
    .replace(/\\"/g, '"')
    .replace(/\\\*/g, '*')
    .replace(/\\#/g, '#')
    .replace(/\\_/g, '_');

  // Parse the result into table data
  const lines = formattedResult.split('\n')
    .filter(line => line.trim() && !line.startsWith('#') && !line.startsWith('*'));
  
  const tableData = lines.map(line => {
    const [palavraChave, volumeBusca, cpc] = line.split('|').map(cell => cell.trim());
    return { palavraChave, volumeBusca, cpc };
  }).filter(row => row.palavraChave && row.volumeBusca && row.cpc);

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
