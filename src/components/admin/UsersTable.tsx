
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

interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
}

export function UsersTable({ users, onUpdate }: { users: User[], onUpdate: () => void }) {
  const [loading, setLoading] = useState<string | null>(null);
  const { user: currentUser } = useAuth();

  const handleRoleToggle = async (userId: string, currentRole: 'admin' | 'user') => {
    if (currentUser?.id === userId) {
      toast.error("Você não pode alterar seu próprio papel");
      return;
    }

    try {
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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Papel</TableHead>
          <TableHead>Data de Criação</TableHead>
          <TableHead>Ações</TableHead>
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
              {new Date(user.created_at).toLocaleDateString('pt-BR')}
            </TableCell>
            <TableCell>
              <Button
                variant="outline"
                size="sm"
                disabled={loading === user.id || currentUser?.id === user.id}
                onClick={() => handleRoleToggle(user.id, user.role)}
              >
                {loading === user.id ? (
                  "Atualizando..."
                ) : (
                  user.role === 'admin' ? "Remover Admin" : "Tornar Admin"
                )}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
