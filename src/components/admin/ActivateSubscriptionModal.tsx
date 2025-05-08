
import { useState } from "react";
import { addDays, format } from "date-fns";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { PlanType } from "@/types/plans";

interface ActivateSubscriptionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  onActivate: (userId: string, planType: PlanType, vencimento: string) => Promise<boolean>;
  isActivating: boolean;
}

export function ActivateSubscriptionModal({
  isOpen,
  onOpenChange,
  userId,
  onActivate,
  isActivating,
}: ActivateSubscriptionModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("solo");
  const vencimento = format(addDays(new Date(), 30), "yyyy-MM-dd");

  const handleActivate = async () => {
    await onActivate(userId, selectedPlan, vencimento);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ativar Assinatura</DialogTitle>
          <DialogDescription>
            Escolha o plano para ativar a assinatura deste usuário.
            A assinatura terá validade de 30 dias.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup 
            value={selectedPlan} 
            onValueChange={(value) => setSelectedPlan(value as PlanType)}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="solo" id="solo" />
              <Label htmlFor="solo" className="font-medium">Solo (R$ 47)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="discovery" id="discovery" />
              <Label htmlFor="discovery" className="font-medium">Discovery (R$ 97)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="escala" id="escala" />
              <Label htmlFor="escala" className="font-medium">Escala (R$ 197)</Label>
            </div>
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isActivating}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleActivate}
            disabled={isActivating}
          >
            {isActivating ? "Ativando..." : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
