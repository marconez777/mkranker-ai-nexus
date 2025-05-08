
import { useContext, useMemo } from 'react';
import { usePlan } from '@/contexts/PlanContext';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook para verificar se o usuário tem acesso liberado com base na assinatura
 * Retorna true apenas se a assinatura estiver ativa ou não existir restrição
 */
export const useSubscriptionGate = (): boolean => {
  const { currentPlan } = usePlan();

  const hasAccess = useMemo(() => {
    // No more free plan - users need to have a valid plan (solo, discovery, escala)
    return currentPlan && currentPlan.type !== undefined;
  }, [currentPlan]);

  return hasAccess;
};
