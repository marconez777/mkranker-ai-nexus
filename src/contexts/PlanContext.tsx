
import { createContext, useContext } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PlanContextType } from './plan/types';
import { usePlanData } from './plan/usePlanData';
import { useUsageOperations } from './plan/useUsageOperations';

const PlanContext = createContext<PlanContextType | null>(null);

export const PlanProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { currentPlan, usageCounts, setUsageCounts, isLoading, refreshPlan } = usePlanData(user?.id);
  const { getRemainingUses, incrementUsage, resetUsage } = useUsageOperations(usageCounts, setUsageCounts, user?.id);

  return (
    <PlanContext.Provider value={{
      currentPlan,
      getRemainingUses,
      incrementUsage,
      resetUsage,
      usageCounts,
      refreshPlan,
      isLoading
    }}>
      {children}
    </PlanContext.Provider>
  );
};

export const usePlan = () => {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
};

export type { Plan, PlanType, PlanLimits } from '@/types/plans';
