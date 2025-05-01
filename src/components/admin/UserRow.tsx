
import { TableCell, TableRow } from "@/components/ui/table";
import { UserActionButtons } from "./UserActionButtons";
import { UserRolesBadge } from "./UserRolesBadge";
import { UserStatusBadge } from "./UserStatusBadge";
import { UserDetailsCell } from "./UserDetailsCell";
import { format } from "date-fns";

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
    status: string;
    vencimento: string;
  } | null;
}

interface UserRowProps {
  user: User;
  currentUserId: string | undefined;
  loading: string | null;
  actionType: 'delete' | 'toggle' | 'role' | 'subscription';
  onRoleToggle: (userId: string, currentRole: 'admin' | 'user') => void;
  onDeleteConfirm: (userId: string) => void;
  onActivateSubscription?: (userId: string) => void;
}

export function UserRow({
  user,
  currentUserId,
  loading,
  actionType,
  onRoleToggle,
  onDeleteConfirm,
  onActivateSubscription
}: UserRowProps) {
  const isCurrentUser = currentUserId === user.id;
  const createdAtDate = new Date(user.created_at);
  
  return (
    <TableRow key={user.id}>
      <TableCell className="font-medium">
        {user.email}
      </TableCell>
      <TableCell>
        <UserRolesBadge role={user.role} />
      </TableCell>
      <TableCell>
        <UserStatusBadge 
          isActive={user.is_active} 
          subscription={user.subscription} 
        />
      </TableCell>
      <TableCell>
        {format(createdAtDate, "dd/MM/yyyy")}
      </TableCell>
      <TableCell>
        <UserDetailsCell usage={user.usage} />
      </TableCell>
      <TableCell>
        <UserActionButtons
          userId={user.id}
          userEmail={user.email}
          userRole={user.role}
          isActive={!!user.is_active}
          isCurrentUser={isCurrentUser}
          loading={loading}
          actionType={actionType}
          subscription={user.subscription}
          onRoleToggle={onRoleToggle}
          onDeleteConfirm={onDeleteConfirm}
          onActivateSubscription={onActivateSubscription}
        />
      </TableCell>
    </TableRow>
  );
}
