
import { useFieldArray, Control } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus, Minus } from "lucide-react";
import type { MercadoPublicoAlvoFormData } from "@/types/mercado-publico-alvo";

interface SegmentosInputProps {
  control: Control<MercadoPublicoAlvoFormData>;
  name: "segmentos";
}

export const SegmentosInput = ({ control, name }: SegmentosInputProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <FormItem>
      <FormLabel>
        Quais são seus segmentos:
        <span className="text-destructive ml-1">*</span>
      </FormLabel>
      
      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2 items-center">
            <Input
              placeholder="Ex: Agência, Freelancer, Empresa..."
              {...control.register(`${name}.${index}`)}
            />
            {index > 0 && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => remove(index)}
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
          onClick={() => append("")}
          className="mt-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Segmento
        </Button>
      </div>
      <FormMessage />
    </FormItem>
  );
};
