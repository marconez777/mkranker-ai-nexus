
import { Button } from "@/components/ui/button";
import { ShieldAlert, Shield, Trash2, Check } from "lucide-react";

interface UserActionButtonsProps {
  userId: string;
  userEmail: string;
  userRole: 'admin' | 'user';
  isActive: boolean;
  isCurrentUser: boolean;
  loading: string | null;
  actionType: 'delete' | 'toggle' | 'role' | 'subscription';
  subscription?: {
    status: string;
    vencimento: string;
  } | null;
  onRoleToggle: (userId: string, currentRole: 'admin' | 'user') => void;
  onDeleteConfirm: (userId: string) => void;
  onActivateSubscription?: (userId: string) => void;
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
  onRoleToggle,
  onDeleteConfirm,
  onActivateSubscription
}: UserActionButtonsProps) {
  const handleRoleToggle = () => {
    console.log("[UserActionButtons] Tentando alterar papel para usuário:", userId, "email:", userEmail, "papel atual:", userRole);
    onRoleToggle(userId, userRole);
  };

  const handleDeleteConfirm = () => {
    console.log("[UserActionButtons] Tentando excluir usuário:", userId, "email:", userEmail);
    onDeleteConfirm(userId);
  };

  const handleActivateSubscription = () => {
    console.log("[UserActionButtons] Tentando ativar assinatura para usuário:", userId, "email:", userEmail);
    if (onActivateSubscription) {
      onActivateSubscription(userId);
    }
  };

  // Determinar se o botão está em carregamento
  const isRoleLoading = loading === userId && actionType === 'role';
  const isDeleteLoading = loading === userId && actionType === 'delete';
  const isSubscriptionLoading = loading === userId && actionType === 'subscription';
  
  // Verificar se o usuário precisa de ativação de assinatura
  const needsSubscriptionActivation = !subscription || subscription.status !== 'ativo';

  return (
    <div className="space-x-2 text-right">
      <Button
        variant="outline"
        size="sm"
        className="mr-2"
        disabled={isRoleLoading || isDeleteLoading || isSubscriptionLoading || isCurrentUser}
        onClick={handleRoleToggle}
        data-user-id={userId}
        data-action="toggle-role"
      >
        {isRoleLoading ? (
          "Atualizando..."
        ) : (
          <>
            {userRole === 'admin' ? (
              <>
                <Shield className="w-4 h-4 mr-1" />
                Remover Admin
              </>
            ) : (
              <>
                <ShieldAlert className="w-4 h-4 mr-1" />
                Tornar Admin
              </>
            )}
          </>
        )}
      </Button>
      
      {needsSubscriptionActivation && onActivateSubscription && (
        <Button
          variant="outline"
          size="sm"
          className="mr-2 bg-green-100 hover:bg-green-200 text-green-800 border-green-300"
          disabled={isRoleLoading || isDeleteLoading || isSubscriptionLoading}
          onClick={handleActivateSubscription}
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
      
      <Button
        variant="destructive"
        size="sm"
        disabled={isRoleLoading || isDeleteLoading || isSubscriptionLoading || isCurrentUser}
        onClick={handleDeleteConfirm}
        data-user-id={userId}
        data-action="delete"
      >
        <Trash2 className="w-4 h-4 mr-1" />
        {isDeleteLoading ? "Excluindo..." : "Excluir"}
      </Button>
    </div>
  );
}
