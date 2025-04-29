
import { Button } from "@/components/ui/button";
import { UserCheck, UserMinus, Trash2 } from "lucide-react";

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
    console.log("Tentando alterar status para usuário:", userId, "email:", userEmail, "estado atual:", isActive);
    onToggleActive(userId, isActive !== false);
  };

  const handleRoleToggle = () => {
    console.log("Tentando alterar papel para usuário:", userId, "email:", userEmail, "papel atual:", userRole);
    onRoleToggle(userId, userRole);
  };

  const handleDeleteConfirm = () => {
    console.log("Tentando excluir usuário:", userId, "email:", userEmail);
    onDeleteConfirm(userId);
  };

  return (
    <div className="space-x-2 text-right">
      <Button
        variant="outline"
        size="sm"
        className="mr-2"
        disabled={loading === userId}
        onClick={handleToggleActive}
        data-user-id={userId}
        data-action="toggle-active"
      >
        {loading === userId && actionType === 'toggle' ? (
          "Atualizando..."
        ) : isActive !== false ? (
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
        disabled={loading === userId || isCurrentUser}
        onClick={handleRoleToggle}
        data-user-id={userId}
        data-action="toggle-role"
      >
        {loading === userId && actionType === 'role' ? (
          "Atualizando..."
        ) : (
          userRole === 'admin' ? "Remover Admin" : "Tornar Admin"
        )}
      </Button>
      
      <Button
        variant="destructive"
        size="sm"
        disabled={loading === userId || isCurrentUser}
        onClick={handleDeleteConfirm}
        data-user-id={userId}
        data-action="delete"
      >
        <Trash2 className="w-4 h-4 mr-1" />
        Excluir
      </Button>
    </div>
  );
}
