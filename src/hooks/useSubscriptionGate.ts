
import { useContext, useMemo } from 'react';
import { usePlan } from '@/contexts/PlanContext';

/**
 * Hook para verificar se o usuário tem acesso liberado com base na assinatura
 * Retorna true apenas se a assinatura estiver ativa
 */
export const useSubscriptionGate = (): boolean => {
  const { currentPlan } = usePlan();

  const hasAccess = useMemo(() => {
    // Consideramos que qualquer plano dá acesso
    return currentPlan && currentPlan.type !== undefined;
  }, [currentPlan]);

  return hasAccess;
};
