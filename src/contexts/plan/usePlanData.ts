
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PLANS } from '@/types/plans';
import type { Plan, PlanType } from '@/types/plans';
import { toast } from "@/components/ui/use-toast";
import { UsageData, DEFAULT_USAGE } from './types';
import { determinePlanFromSubscription, buildPlanWithDbLimits } from './utils/planUtils';
import { checkSubscriptionExpiry, markSubscriptionExpired, adjustCreditsAfterUpgrade } from './utils/subscriptionUtils';
import { fetchOrCreateUserProfile } from './utils/profileUtils';
import { fetchOrCreateUsageRecord, mapUsageDataToFrontend } from './utils/usageUtils';

export const usePlanData = (userId: string | undefined) => {
  const [currentPlan, setCurrentPlan] = useState<Plan>(PLANS.free);
  const [usageCounts, setUsageCounts] = useState(DEFAULT_USAGE);
  const [isLoading, setIsLoading] = useState(true);
  const [previousPlanType, setPreviousPlanType] = useState<PlanType | null>(null);

  const refreshPlan = async () => {
    if (!userId) return;

    try {
      setIsLoading(true);

      // Fetch or create user profile
      const profileData = await fetchOrCreateUserProfile(userId);
      
      // Set default plan type
      let planType: PlanType = 'free';
      let oldPlanType: PlanType | null = previousPlanType;
      
      if (profileData?.plan_type) {
        // Certifique-se de que o valor seja um PlanType válido
        const profilePlanType = profileData.plan_type.toLowerCase();
        oldPlanType = oldPlanType || (profilePlanType as PlanType);
      }
      
      // Fetch active subscription
      const { data: subscription, error: subscriptionError } = await supabase
        .from('user_subscription')
        .select('*, plans(*)')
        .eq('user_id', userId)
        .eq('status', 'ativo')
        .maybeSingle();

      if (subscriptionError && subscriptionError.code !== 'PGRST116') {
        console.error("Error fetching subscription:", subscriptionError);
      }

      // Check subscription expiry
      let isSubscriptionExpired = false;
      if (subscription) {
        isSubscriptionExpired = checkSubscriptionExpiry(subscription);

        if (isSubscriptionExpired && subscription.status === 'ativo') {
          await markSubscriptionExpired(userId);
        }
      }

      // Determine plan type
      if (subscription && !isSubscriptionExpired) {
        planType = determinePlanFromSubscription(subscription);
        
        // Atualizar o perfil do usuário com o tipo de plano atual
        if (profileData && profileData.plan_type !== planType) {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ plan_type: planType })
            .eq('id', userId);
            
          if (updateError) {
            console.error("Error updating profile plan type:", updateError);
          } else {
            console.log("Profile plan type updated to:", planType);
          }
        }
      } else if (profileData?.plan_type) {
        const profilePlanType = profileData.plan_type.toLowerCase();
        if (profilePlanType === 'solo' || profilePlanType === 'discovery' || profilePlanType === 'escala') {
          planType = profilePlanType as PlanType;
        }
      }

      // Build final plan with limits
      let finalPlan = { ...PLANS[planType] };

      if (subscription?.plans && !isSubscriptionExpired) {
        finalPlan = buildPlanWithDbLimits(finalPlan, subscription.plans);
      }

      console.log("Setting current plan to:", planType, finalPlan);
      setCurrentPlan(finalPlan);

      // Fetch or create usage record
      let usageData = await fetchOrCreateUsageRecord(userId);

      // Adjust credits when upgrading from free plan
      if (usageData && oldPlanType === 'free' && planType !== 'free' && oldPlanType !== planType) {
        console.log("Upgrade detected from free plan to paid plan:", planType);
        
        const updatedUsage = await adjustCreditsAfterUpgrade(userId, usageData);
        if (updatedUsage) {
          usageData = updatedUsage;
        }
        
        // Update previous plan type
        setPreviousPlanType(planType);
      } else if (planType !== oldPlanType) {
        // Update previous plan type on any plan change
        setPreviousPlanType(planType);
      }

      // Map usage data to frontend format
      setUsageCounts(mapUsageDataToFrontend(usageData));

    } catch (error: any) {
      console.error("Error loading plan:", error);
      toast({
        title: "Erro ao carregar plano",
        description: "Não foi possível carregar seu plano. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      refreshPlan();
    } else {
      setIsLoading(false);
    }
  }, [userId]);

  return {
    currentPlan,
    usageCounts,
    setUsageCounts,
    isLoading,
    refreshPlan
  };
};
