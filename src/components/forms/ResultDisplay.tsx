
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

  // Split the content into lines and identify headers
  const lines = formattedResult.split('\n').filter(line => line.trim());
  const tableData = lines.map(line => {
    const isHeader = line.startsWith('#') || line.startsWith('*');
    return {
      content: line.replace(/^[#*\s]+/, '').trim(),
      isHeader
    };
  });

  return (
    <div className="mt-6 space-y-2">
      <div className="flex items-center gap-2">
        <TableProperties className="h-5 w-5" />
        <h3 className="text-lg font-medium">Resultado da Análise:</h3>
      </div>
      <div className="rounded-md border bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Análise do Funil de Busca</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((row, index) => (
              <TableRow key={index}>
                <TableCell className={row.isHeader ? "font-semibold bg-muted/50" : ""}>
                  {row.content}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

