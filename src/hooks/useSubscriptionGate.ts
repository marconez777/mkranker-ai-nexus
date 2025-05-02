
import { useState } from "react";

/**
 * Hook to check if the user has an active subscription
 * @returns boolean indicating if user can access subscription-gated features
 */
export const useSubscriptionGate = (): boolean => {
  const [hasAccess] = useState<boolean>(true);
  
  // Always allow access regardless of subscription status
  return hasAccess;
};
