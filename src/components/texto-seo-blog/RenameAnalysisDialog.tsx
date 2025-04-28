
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormField } from "@/components/forms/fields/FormField";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const renameSchema = z.object({
  tema: z.string().min(1, "Este campo é obrigatório"),
});

type RenameFormData = z.infer<typeof renameSchema>;

interface RenameAnalysisDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedAnalise: { id: string; tema: string } | null;
  onRename: (id: string, newTema: string) => void;
}

export function RenameAnalysisDialog({
  isOpen,
  onOpenChange,
  selectedAnalise,
  onRename,
}: RenameAnalysisDialogProps) {
  const methods = useForm<RenameFormData>({
    resolver: zodResolver(renameSchema),
    defaultValues: {
      tema: selectedAnalise?.tema || '',
    },
  });

  const onSubmit = (data: RenameFormData) => {
    if (!selectedAnalise) return;
    onRename(selectedAnalise.id, data.tema);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Renomear Análise</DialogTitle>
          <DialogDescription>
            Atualize o tema desta análise.
          </DialogDescription>
        </DialogHeader>

        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="tema"
              label="Tema:"
              placeholder="Digite o novo tema"
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
