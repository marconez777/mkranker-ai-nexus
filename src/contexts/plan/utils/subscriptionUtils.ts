
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";

/**
 * Checks if subscription is expired
 */
export const checkSubscriptionExpiry = (subscription: any): boolean => {
  if (!subscription || !subscription.vencimento) return true;
  
  const expiryDate = new Date(subscription.vencimento);
  const today = new Date();
  return expiryDate < today;
};

/**
 * Updates expired subscription status in the database
 */
export const markSubscriptionExpired = async (userId: string) => {
  const { error } = await supabase
    .from('user_subscription')
    .update({ status: 'expirado' })
    .eq('user_id', userId);

  if (error) {
    console.error("Error updating subscription status:", error);
  }
};
