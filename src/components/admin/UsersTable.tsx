
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
import { supabase } from "@/integrations/supabase/client";
import { UserRow } from "./UserRow";
import { DeleteUserDialog } from "./DeleteUserDialog";

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
}

export function UsersTable({ users, onUpdate }: { users: User[], onUpdate: () => void }) {
  const [loading, setLoading] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'delete' | 'toggle' | 'role'>('role');
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const { user: currentUser } = useAuth();

  const callAdminFunction = async (operation: string, userId: string, data: any = {}) => {
    try {
      console.log(`Chamando função admin-user-operations: operação=${operation}, userId=${userId}, data:`, data);
      
      const { data: result, error } = await supabase.functions.invoke('admin-user-operations', {
        body: { operation, userId, data },
      });

      if (error) {
        console.error(`Erro na operação ${operation}:`, error);
        throw error;
      }
      
      console.log(`Resposta da função admin-user-operations:`, result);
      return result;
    } catch (error: any) {
      console.error(`Falha ao chamar função admin (${operation}):`, error);
      throw new Error(error.message || 'Erro ao processar solicitação');
    }
  };

  const handleRoleToggle = async (userId: string, currentRole: 'admin' | 'user') => {
    if (currentUser?.id === userId) {
      toast.error("Você não pode alterar seu próprio papel");
      return;
    }

    try {
      setActionType('role');
      setLoading(userId);
      const newRole = currentRole === 'admin' ? 'user' : 'admin';
      
      console.log("Atualizando papel do usuário:", userId, "de", currentRole, "para", newRole);
      
      await callAdminFunction('toggle_role', userId, { role: newRole });
      
      toast.success("Papel do usuário atualizado com sucesso");
      onUpdate();
    } catch (error: any) {
      console.error("Erro ao atualizar papel:", error);
      toast.error(`Erro ao atualizar papel: ${error.message}`);
    } finally {
      setLoading(null);
    }
  };

  const handleToggleActive = async (userId: string, isActive: boolean) => {
    if (currentUser?.id === userId) {
      toast.error("Você não pode desativar sua própria conta");
      return;
    }

    try {
      setActionType('toggle');
      setLoading(userId);
      
      // Mudamos o status para o oposto do atual (verdadeiro -> falso, falso -> verdadeiro)
      const newStatus = !isActive;
      
      console.log("Alterando status do usuário:", userId, "ativo atual:", isActive, "novo status:", newStatus);
      
      await callAdminFunction('toggle_active', userId, { isActive: newStatus });
      
      toast.success(`Usuário ${newStatus ? 'ativado' : 'desativado'} com sucesso`);
      
      // Forçando uma atualização imediata após o sucesso
      setTimeout(() => {
        onUpdate();
      }, 300);
      
    } catch (error: any) {
      console.error("Erro ao atualizar status:", error);
      toast.error(`Erro ao atualizar status: ${error.message}`);
    } finally {
      setLoading(null);
    }
  };

  const confirmDelete = (userId: string) => {
    setUserToDelete(userId);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    if (currentUser?.id === userToDelete) {
      toast.error("Você não pode excluir sua própria conta");
      setUserToDelete(null);
      return;
    }

    try {
      setActionType('delete');
      setLoading(userToDelete);
      
      await callAdminFunction('delete', userToDelete);
      
      toast.success("Usuário excluído com sucesso");
      onUpdate();
    } catch (error: any) {
      toast.error(`Erro ao excluir usuário: ${error.message}`);
    } finally {
      setLoading(null);
      setUserToDelete(null);
    }
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
              onToggleActive={handleToggleActive}
              onRoleToggle={handleRoleToggle}
              onDeleteConfirm={confirmDelete}
            />
          ))}
        </TableBody>
      </Table>

      <DeleteUserDialog
        isOpen={!!userToDelete}
        onOpenChange={(open) => !open && setUserToDelete(null)}
        onConfirm={handleDeleteUser}
        isDeleting={loading === userToDelete && actionType === 'delete'}
      />
    </>
  );
}
