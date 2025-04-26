
import ReactMarkdown from 'react-markdown';

interface ResultDisplayProps {
  resultado: string;
}

export const ResultDisplay = ({ resultado }: ResultDisplayProps) => {
  if (!resultado) return null;
  
  // Se a resposta contém um campo output, vamos usar ele
  let formattedResult = resultado;
  try {
    const parsedData = JSON.parse(resultado);
    if (parsedData && parsedData.output) {
      formattedResult = parsedData.output;
    }
  } catch (e) {
    // Se falhar ao fazer o parse, usamos o resultado original
    console.log("Não foi possível analisar o resultado como JSON:", e);
  }

  return (
    <div className="mt-6 space-y-2">
      <h3 className="text-lg font-medium">O Resultado ficará visível abaixo:</h3>
      <div className="rounded-md border p-4 bg-white overflow-auto">
        <ReactMarkdown className="prose max-w-none">
          {formattedResult}
        </ReactMarkdown>
      </div>
    </div>
  );
};
