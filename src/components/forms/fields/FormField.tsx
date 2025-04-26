
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

interface FormFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
}

export const FormField = ({
  name,
  label,
  placeholder,
  required = false,
  type = "text"
}: FormFieldProps) => {
  const { register } = useFormContext();

  return (
    <FormItem>
      <FormLabel>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </FormLabel>
      <FormControl>
        <Input
          type={type}
          placeholder={placeholder}
          {...register(name, { required })}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};
