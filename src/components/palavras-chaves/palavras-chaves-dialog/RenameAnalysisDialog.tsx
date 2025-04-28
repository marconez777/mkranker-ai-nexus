
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormTextarea } from "@/components/forms/fields/FormTextarea";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const renameSchema = z.object({
  palavrasFundo: z.string().min(1, "Este campo é obrigatório"),
});

type RenameFormData = z.infer<typeof renameSchema>;

interface RenameAnalysisDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedAnalise: { id: string; palavras_fundo: string[] } | null;
  onRename: (id: string, newPalavrasFundo: string[]) => void;
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
      palavrasFundo: selectedAnalise?.palavras_fundo.join('\n') || '',
    },
  });

  const onSubmit = (data: RenameFormData) => {
    if (!selectedAnalise) return;

    const palavrasFundoArray = data.palavrasFundo
      .split('\n')
      .map(word => word.trim())
      .filter(word => word.length > 0);

    onRename(selectedAnalise.id, palavrasFundoArray);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Renomear Análise</DialogTitle>
          <DialogDescription>
            Atualize as palavras-chave desta análise.
          </DialogDescription>
        </DialogHeader>

        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            <FormTextarea
              name="palavrasFundo"
              label="Palavras-chave:"
              placeholder="Digite uma palavra-chave por linha"
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
