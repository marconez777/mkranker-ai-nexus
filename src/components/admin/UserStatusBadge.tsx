
import { format } from "date-fns";

interface UserStatusBadgeProps {
  isActive: boolean | undefined;
  subscription?: {
    status: string;
    vencimento: string;
  } | null;
}

export function UserStatusBadge({ isActive, subscription }: UserStatusBadgeProps) {
  // If there is an active subscription, show "Pago até" with the expiration date
  if (subscription && subscription.status === 'ativo') {
    const expirationDate = new Date(subscription.vencimento);
    return (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
        Pago até {format(expirationDate, "dd/MM/yyyy")}
      </span>
    );
  }
  
  // If subscription exists but is not active, show "Assinatura Vencida"
  if (subscription) {
    return (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
        Assinatura Vencida
      </span>
    );
  }
  
  // If no subscription, show "Sem Assinatura"
  return (
    <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
      Sem Assinatura
    </span>
  );
}
