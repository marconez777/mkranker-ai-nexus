
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface RenameAnalysisDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedAnalise: { id: string; micro_nicho: string } | null;
  onRename: (id: string, newName: string) => Promise<void>;
}

export const RenameAnalysisDialog = ({
  isOpen,
  onOpenChange,
  selectedAnalise,
  onRename
}: RenameAnalysisDialogProps) => {
  const [newMicroNicho, setNewMicroNicho] = useState(selectedAnalise?.micro_nicho || "");

  const handleRenameSubmit = async () => {
    if (selectedAnalise && newMicroNicho.trim()) {
      await onRename(selectedAnalise.id, newMicroNicho);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Renomear análise</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            value={newMicroNicho}
            onChange={(e) => setNewMicroNicho(e.target.value)}
            placeholder="Novo nome"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleRenameSubmit}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
