
import { useFormContext } from "react-hook-form";
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface SegmentosInputProps {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
}

export const SegmentosInput = ({
  name = "segmentos",
  label = "Quais são seus segmentos:",
  placeholder = "Ex: Agência, Freelancer, Empresa...",
  required = false
}: SegmentosInputProps) => {
  const { register } = useFormContext();

  return (
    <FormItem className="text-left">
      <FormLabel>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </FormLabel>
      <FormControl>
        <Input
          placeholder={placeholder}
          {...register(name, { required })}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};
