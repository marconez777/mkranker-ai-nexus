import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserRolesBadge } from "./UserRolesBadge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, UserCheck, UserMinus } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

  const handleRoleToggle = async (userId: string, currentRole: 'admin' | 'user') => {
    if (currentUser?.id === userId) {
      toast.error("Você não pode alterar seu próprio papel");
      return;
    }

    try {
      setActionType('role');
      setLoading(userId);
      const newRole = currentRole === 'admin' ? 'user' : 'admin';
      
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;
      
      toast.success("Papel do usuário atualizado com sucesso");
      onUpdate();
    } catch (error: any) {
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
      
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: !isActive })
        .eq('id', userId);

      if (error) throw error;
      
      toast.success(`Usuário ${!isActive ? 'ativado' : 'desativado'} com sucesso`);
      onUpdate();
    } catch (error: any) {
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
      
      const { error } = await supabase.auth.admin.deleteUser(userToDelete);

      if (error) throw error;
      
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
            <TableRow key={user.id}>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <UserRolesBadge role={user.role} />
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {user.is_active ? 'Ativo' : 'Inativo'}
                </span>
              </TableCell>
              <TableCell>
                {new Date(user.created_at).toLocaleDateString('pt-BR')}
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <p>Palavras-chave: {user.usage?.palavras_chaves || 0}</p>
                  <p>Mercado/Público: {user.usage?.mercado_publico_alvo || 0}</p>
                  <p>Funil de busca: {user.usage?.funil_busca || 0}</p>
                  <p>Blog SEO: {user.usage?.texto_seo_blog || 0}</p>
                </div>
              </TableCell>
              <TableCell className="space-x-2 text-right">
                <Button
                  variant="outline"
                  size="sm"
                  className="mr-2"
                  disabled={loading === user.id}
                  onClick={() => handleToggleActive(user.id, user.is_active !== false)}
                >
                  {loading === user.id && actionType === 'toggle' ? (
                    "Atualizando..."
                  ) : user.is_active !== false ? (
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
                  disabled={loading === user.id || currentUser?.id === user.id}
                  onClick={() => handleRoleToggle(user.id, user.role)}
                >
                  {loading === user.id && actionType === 'role' ? (
                    "Atualizando..."
                  ) : (
                    user.role === 'admin' ? "Remover Admin" : "Tornar Admin"
                  )}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={loading === user.id || currentUser?.id === user.id}
                  onClick={() => confirmDelete(user.id)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Excluir
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Esta operação excluirá permanentemente a conta
              do usuário e todos os seus dados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteUser}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading === userToDelete && actionType === 'delete' ? "Excluindo..." : "Sim, excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
