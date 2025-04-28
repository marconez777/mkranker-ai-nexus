
import { Button } from "@/components/ui/button";
import { UserCheck, UserMinus, Trash2 } from "lucide-react";
import { useState } from "react";

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
  userRole,
  isActive,
  isCurrentUser,
  loading,
  actionType,
  onToggleActive,
  onRoleToggle,
  onDeleteConfirm
}: UserActionButtonsProps) {
  return (
    <div className="space-x-2 text-right">
      <Button
        variant="outline"
        size="sm"
        className="mr-2"
        disabled={loading === userId}
        onClick={() => onToggleActive(userId, isActive !== false)}
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
        onClick={() => onRoleToggle(userId, userRole)}
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
        onClick={() => onDeleteConfirm(userId)}
      >
        <Trash2 className="w-4 h-4 mr-1" />
        Excluir
      </Button>
    </div>
  );
}
