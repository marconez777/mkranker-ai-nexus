
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { UserRow } from "./UserRow";
import { DeleteUserDialog } from "./DeleteUserDialog";
import { useAdminOperations } from "@/hooks/useAdminOperations";

interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
  is_active?: boolean;
  usage?: {
    palavras_chaves: number;
    mercado_publico_alvo: number;
    funil_busca: number;
    texto_seo_blog: number;
    texto_seo_lp: number;
    texto_seo_produto: number;
    pautas_blog: number;
    meta_dados: number;
  };
  subscription?: {
    status: 'ativo' | 'inativo' | 'vencido';
    vencimento: string;
  } | null;
}

export function UsersTable({ users, onUpdate }: { users: User[], onUpdate: () => void }) {
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const { user: currentUser } = useAuth();
  
  const {
    loading,
    actionType,
    handleRoleToggle,
    handleActivateSubscription,
    handleDeleteUser
  } = useAdminOperations(onUpdate);

  const confirmDelete = (userId: string) => {
    setUserToDelete(userId);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    if (currentUser?.id === userToDelete) {
      toast.error("Você não pode excluir sua própria conta");
      setUserToDelete(null);
      return;
    }

    await handleDeleteUser(userToDelete);
    setUserToDelete(null);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Papel</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data de Criação</TableHead>
            <TableHead>Uso do Sistema</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              currentUserId={currentUser?.id}
              loading={loading}
              actionType={actionType}
              onRoleToggle={handleRoleToggle}
              onDeleteConfirm={confirmDelete}
              onActivateSubscription={handleActivateSubscription}
            />
          ))}
        </TableBody>
      </Table>

      <DeleteUserDialog
        isOpen={!!userToDelete}
        onOpenChange={(open) => !open && setUserToDelete(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={loading === userToDelete && actionType === 'delete'}
      />
    </>
  );
}
