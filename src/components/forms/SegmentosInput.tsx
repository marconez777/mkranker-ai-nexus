
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus } from "lucide-react";

interface SegmentosInputProps {
  segmentos: string[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, value: string) => void;
}

export const SegmentosInput = ({ 
  segmentos, 
  onAdd, 
  onRemove, 
  onUpdate 
}: SegmentosInputProps) => {
  return (
    <div className="space-y-2">
      {segmentos.map((segmento, index) => (
        <div key={index} className="flex gap-2 items-center">
          <Input
            placeholder="Ex: Agência, Freelancer, Empresa..."
            value={segmento}
            onChange={(e) => onUpdate(index, e.target.value)}
            required
          />
          {index > 0 && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => onRemove(index)}
            >
              <Minus className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onAdd}
        className="mt-2"
      >
        <Plus className="h-4 w-4 mr-2" />
        Adicionar Segmento
      </Button>
    </div>
  );
};

