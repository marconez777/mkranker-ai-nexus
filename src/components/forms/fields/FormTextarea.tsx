
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

interface FormTextareaProps {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
}

export const FormTextarea = ({
  name,
  label,
  placeholder,
  required = false
}: FormTextareaProps) => {
  const { register } = useFormContext();

  return (
    <FormItem className="text-left">
      <FormLabel>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </FormLabel>
      <FormControl>
        <Textarea
          placeholder={placeholder}
          {...register(name, { required })}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};
