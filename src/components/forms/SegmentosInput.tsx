
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import type { MercadoPublicoAlvoFormData } from "@/types/mercado-publico-alvo";

interface SegmentosInputProps {
  name: "segmentos";
  label: string;
  placeholder?: string;
  required?: boolean;
}

export const SegmentosInput = ({
  name,
  label,
  placeholder,
  required = false
}: SegmentosInputProps) => {
  const { register } = useFormContext<MercadoPublicoAlvoFormData>();

  return (
    <FormItem>
      <FormLabel>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </FormLabel>
      <FormControl>
        <Input
          placeholder={placeholder}
          {...register(name)}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};
