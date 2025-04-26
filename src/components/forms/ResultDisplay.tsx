
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
          className="prose max-w-none prose-headings:mb-4 prose-headings:mt-6 prose-h2:text-xl prose-h2:font-semibold prose-h3:text-lg prose-h3:font-medium"
          components={{
            h2: ({node, ...props}) => <h2 className="text-xl font-semibold mb-4 mt-6" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-lg font-medium mb-3 mt-5" {...props} />,
            ul: ({node, ...props}) => <ul className="list-disc ml-6 mb-4 space-y-2" {...props} />,
            ol: ({node, ...props}) => <ol className="list-decimal ml-6 mb-4 space-y-2" {...props} />,
            li: ({node, ...props}) => <li className="text-gray-700" {...props} />,
            p: ({node, ...props}) => <p className="mb-4 text-gray-700 leading-relaxed" {...props} />
          }}
        >
          {formattedResult}
        </ReactMarkdown>
      </div>
    </div>
  );
};

