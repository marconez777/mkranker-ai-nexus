
import { Badge } from "@/components/ui/badge";

interface UserRolesBadgeProps {
  role: 'admin' | 'user';
}

export function UserRolesBadge({ role }: UserRolesBadgeProps) {
  return (
    <Badge variant={role === 'admin' ? 'destructive' : 'secondary'}>
      {role === 'admin' ? 'Administrador' : 'Usuário'}
    </Badge>
  );
}
