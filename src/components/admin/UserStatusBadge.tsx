
interface UserStatusBadgeProps {
  isActive: boolean;
}

export function UserStatusBadge({ isActive }: UserStatusBadgeProps) {
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
      {isActive ? 'Ativo' : 'Inativo'}
    </span>
  );
}
