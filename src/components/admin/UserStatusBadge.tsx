
interface UserStatusBadgeProps {
  isActive: boolean | undefined;
  subscription?: {
    status: string;
    vencimento: string;
  } | null;
}

export function UserStatusBadge({ isActive, subscription }: UserStatusBadgeProps) {
  // Display "Assinatura Vencida" if the user is active but subscription is expired
  if (isActive && subscription && subscription.status !== 'ativo') {
    return (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
        Assinatura Vencida
      </span>
    );
  }

  // Display "Pendente" or "Ativo" based on isActive status
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${isActive ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
      {isActive ? 'Ativo' : 'Pendente'}
    </span>
  );
}
