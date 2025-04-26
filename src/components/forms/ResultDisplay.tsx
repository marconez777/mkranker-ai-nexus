
interface ResultDisplayProps {
  resultado: string;
}

export const ResultDisplay = ({ resultado }: ResultDisplayProps) => {
  if (!resultado) return null;

  return (
    <div className="mt-6 space-y-2">
      <h3 className="text-lg font-medium">O Resultado ficará visível abaixo:</h3>
      <div className="rounded-md border p-4 bg-white whitespace-pre-wrap">
        {resultado}
      </div>
    </div>
  );
};
