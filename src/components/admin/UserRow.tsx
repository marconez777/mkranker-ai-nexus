
import { TableRow, TableCell } from "@/components/ui/table";
import { UserRolesBadge } from "./UserRolesBadge";
import { UserStatusBadge } from "./UserStatusBadge";
import { UserDetailsCell } from "./UserDetailsCell";
import { UserActionButtons } from "./UserActionButtons";

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

interface UserRowProps {
  user: User;
  currentUserId: string | undefined;
  loading: string | null;
  actionType: 'delete' | 'toggle' | 'role';
  onToggleActive: (userId: string, isActive: boolean) => void;
  onRoleToggle: (userId: string, currentRole: 'admin' | 'user') => void;
  onDeleteConfirm: (userId: string) => void;
}

export function UserRow({
  user,
  currentUserId,
  loading,
  actionType,
  onToggleActive,
  onRoleToggle,
  onDeleteConfirm
}: UserRowProps) {
  const isCurrentUser = currentUserId === user.id;
  const isActive = user.is_active !== false;
  
  return (
    <TableRow key={user.id} className={isActive ? "" : "bg-red-50"}>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        <UserRolesBadge role={user.role} />
      </TableCell>
      <TableCell>
        <UserStatusBadge isActive={isActive} />
      </TableCell>
      <TableCell>
        {new Date(user.created_at).toLocaleDateString('pt-BR')}
      </TableCell>
      <UserDetailsCell usage={user.usage} />
      <TableCell className="space-x-2 text-right">
        <UserActionButtons 
          userId={user.id}
          userEmail={user.email}
          userRole={user.role}
          isActive={isActive}
          isCurrentUser={isCurrentUser}
          loading={loading}
          actionType={actionType}
          onToggleActive={onToggleActive}
          onRoleToggle={onRoleToggle}
          onDeleteConfirm={onDeleteConfirm}
        />
      </TableCell>
    </TableRow>
  );
}
