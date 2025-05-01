
import { TableRow, TableCell } from "@/components/ui/table";
import { UserRolesBadge } from "./UserRolesBadge";
import { UserStatusBadge } from "./UserStatusBadge";
import { UserDetailsCell } from "./UserDetailsCell";
import { UserActionButtons } from "./UserActionButtons";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

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
  
  return (
    <TableRow key={user.id}>
      <TableCell>{user.email}</TableCell>
      <TableCell className="flex flex-col gap-1 md:flex-row md:items-center md:gap-2">
        <UserRolesBadge role={user.role} />
        
        {user.subscription ? (
          <Badge 
            variant={user.subscription.status === 'ativo' ? 'default' : 'destructive'}
            className="whitespace-nowrap text-xs font-normal"
          >
            {user.subscription.status === 'ativo' ? (
              <Check className="mr-1 h-3 w-3" />
            ) : (
              <X className="mr-1 h-3 w-3" />
            )}
            {user.subscription.status === 'ativo' ? 'Pago' : 'Vencido'}: {' '}
            {new Date(user.subscription.vencimento).toLocaleDateString('pt-BR')}
          </Badge>
        ) : null}
      </TableCell>
      <TableCell>
        <UserStatusBadge isActive={user.is_active !== false} />
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
          isActive={user.is_active !== false}
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
