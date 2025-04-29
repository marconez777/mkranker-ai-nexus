
import { Button } from "@/components/ui/button";
import { UserCheck, UserMinus, Trash2, Shield, ShieldAlert } from "lucide-react";

interface UserActionButtonsProps {
  userId: string;
  userEmail: string;
  userRole: 'admin' | 'user';
  isActive: boolean;
  isCurrentUser: boolean;
  loading: string | null;
  actionType: 'delete' | 'toggle' | 'role';
  onToggleActive: (userId: string, isActive: boolean) => void;
  onRoleToggle: (userId: string, currentRole: 'admin' | 'user') => void;
  onDeleteConfirm: (userId: string) => void;
}

export function UserActionButtons({
  userId,
  userEmail,
  userRole,
  isActive,
  isCurrentUser,
  loading,
  actionType,
  onToggleActive,
  onRoleToggle,
  onDeleteConfirm
}: UserActionButtonsProps) {
  const handleToggleActive = () => {
    console.log("[UserActionButtons] Tentando alterar status para usuário:", userId, "email:", userEmail, "estado atual:", isActive);
    onToggleActive(userId, isActive);
  };

  const handleRoleToggle = () => {
    console.log("[UserActionButtons] Tentando alterar papel para usuário:", userId, "email:", userEmail, "papel atual:", userRole);
    onRoleToggle(userId, userRole);
  };

  const handleDeleteConfirm = () => {
    console.log("[UserActionButtons] Tentando excluir usuário:", userId, "email:", userEmail);
    onDeleteConfirm(userId);
  };

  // Determinar se o botão está em carregamento
  const isToggleLoading = loading === userId && actionType === 'toggle';
  const isRoleLoading = loading === userId && actionType === 'role';
  const isDeleteLoading = loading === userId && actionType === 'delete';

  return (
    <div className="space-x-2 text-right">
      <Button
        variant="outline"
        size="sm"
        className="mr-2"
        disabled={isToggleLoading || isRoleLoading || isDeleteLoading}
        onClick={handleToggleActive}
        data-user-id={userId}
        data-action="toggle-active"
        data-is-active={isActive.toString()}
      >
        {isToggleLoading ? (
          "Atualizando..."
        ) : isActive ? (
          <>
            <UserMinus className="w-4 h-4 mr-1" />
            Desativar
          </>
        ) : (
          <>
            <UserCheck className="w-4 h-4 mr-1" />
            Ativar
          </>
        )}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        className="mr-2"
        disabled={isToggleLoading || isRoleLoading || isDeleteLoading || isCurrentUser}
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
      
      <Button
        variant="destructive"
        size="sm"
        disabled={isToggleLoading || isRoleLoading || isDeleteLoading || isCurrentUser}
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
