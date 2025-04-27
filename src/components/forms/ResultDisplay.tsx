
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
        <ReactMarkdown 
          className="prose prose-sm max-w-none prose-headings:font-semibold prose-h1:text-xl prose-h2:text-lg prose-h3:text-base"
          components={{
            h1: ({node, ...props}) => <h1 className="text-xl font-bold mt-6 mb-4 first:mt-0" {...props} />,
            h2: ({node, ...props}) => <h2 className="text-lg font-semibold mt-5 mb-3" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-base font-medium mt-4 mb-2" {...props} />,
            p: ({node, ...props}) => <p className="mb-3 text-sm leading-relaxed" {...props} />,
            ul: ({node, ...props}) => <ul className="my-3 list-disc pl-5 space-y-1" {...props} />,
            ol: ({node, ...props}) => <ol className="my-3 list-decimal pl-5 space-y-1" {...props} />,
            li: ({node, ...props}) => <li className="text-sm ml-2" {...props} />
          }}
        >
          {formattedResult}
        </ReactMarkdown>
      </div>
    </div>
  );
};

