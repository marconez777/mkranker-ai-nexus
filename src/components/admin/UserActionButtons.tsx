
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Check } from "lucide-react";
import { ActivateSubscriptionModal } from "./ActivateSubscriptionModal";
import { PlanType } from "@/types/plans";

interface UserActionButtonsProps {
  userId: string;
  userEmail: string;
  userRole: 'admin' | 'user';
  isActive: boolean;
  isCurrentUser: boolean;
  loading: string | null;
  actionType: 'delete' | 'subscription';
  subscription?: {
    status: string;
    vencimento: string;
  } | null;
  onDeleteConfirm: (userId: string) => void;
  onActivateSubscription?: (userId: string, planType: PlanType, vencimento: string) => Promise<boolean>;
  onUpdate: () => void;
}

export function UserActionButtons({
  userId,
  userEmail,
  userRole,
  isActive,
  isCurrentUser,
  loading,
  actionType,
  subscription,
  onDeleteConfirm,
  onActivateSubscription,
  onUpdate
}: UserActionButtonsProps) {
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  const handleDeleteConfirm = () => {
    console.log("[UserActionButtons] Tentando excluir usuário:", userId, "email:", userEmail);
    onDeleteConfirm(userId);
  };

  const handleOpenSubscriptionModal = () => {
    console.log("[UserActionButtons] Abrindo modal de ativação de assinatura para usuário:", userId, "email:", userEmail);
    setIsSubscriptionModalOpen(true);
  };

  const handleActivateSubscription = async (userId: string, planType: PlanType, vencimento: string) => {
    console.log("[UserActionButtons] Tentando ativar assinatura para usuário:", userId, "email:", userEmail, "plano:", planType, "vencimento:", vencimento);
    if (onActivateSubscription) {
      const success = await onActivateSubscription(userId, planType, vencimento);
      if (success) {
        console.log("[UserActionButtons] Assinatura ativada com sucesso, chamando onUpdate()");
        onUpdate();
      }
      return success;
    }
    return false;
  };

  // Determinar se o botão está em carregamento
  const isDeleteLoading = loading === userId && actionType === 'delete';
  const isSubscriptionLoading = loading === userId && actionType === 'subscription';
  
  // Verificar se o usuário precisa de ativação de assinatura
  const needsSubscriptionActivation = !subscription || subscription.status !== 'ativo';
  
  // Verificar se o usuário já tem assinatura ativa
  const hasActiveSubscription = subscription && subscription.status === 'ativo';

  return (
    <div className="space-x-2 text-right">
      {needsSubscriptionActivation && onActivateSubscription && (
        <Button
          variant="outline"
          size="sm"
          className="mr-2 bg-green-100 hover:bg-green-200 text-green-800 border-green-300"
          disabled={isDeleteLoading || isSubscriptionLoading}
          onClick={handleOpenSubscriptionModal}
          data-user-id={userId}
          data-action="activate-subscription"
        >
          {isSubscriptionLoading ? (
            "Ativando..."
          ) : (
            <>
              <Check className="w-4 h-4 mr-1" />
              Ativar Assinatura
            </>
          )}
        </Button>
      )}
      
      {hasActiveSubscription && (
        <Button
          variant="outline"
          size="sm"
          className="mr-2 bg-green-100 hover:bg-green-200 text-green-800 border-green-300"
          disabled={true}
        >
          <Check className="w-4 h-4 mr-1" />
          Assinatura Ativada
        </Button>
      )}
      
      <Button
        variant="destructive"
        size="sm"
        disabled={isDeleteLoading || isSubscriptionLoading || isCurrentUser}
        onClick={handleDeleteConfirm}
        data-user-id={userId}
        data-action="delete"
      >
        <Trash2 className="w-4 h-4 mr-1" />
        {isDeleteLoading ? "Excluindo..." : "Excluir"}
      </Button>

      {/* Modal para seleção de plano */}
      {onActivateSubscription && (
        <ActivateSubscriptionModal
          isOpen={isSubscriptionModalOpen}
          onOpenChange={setIsSubscriptionModalOpen}
          userId={userId}
          onActivate={handleActivateSubscription}
          isActivating={isSubscriptionLoading}
        />
      )}
    </div>
  );
}
