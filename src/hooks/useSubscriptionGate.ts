import { useContext, useMemo } from 'react';
import { PlanContext } from '@/contexts/plan/PlanContext';

/**
 * Hook para verificar se o usuário tem acesso liberado com base na assinatura
 * Retorna true apenas se a assinatura estiver ativa
 */
export const useSubscriptionGate = (): boolean => {
  const { subscription } = useContext(PlanContext);

  const hasAccess = useMemo(() => {
    // Permite acesso apenas se a assinatura estiver ativa
    return subscription?.status === 'ativo';
  }, [subscription]);

  return hasAccess;
};
