
import { usePlan } from "@/contexts/PlanContext";

interface UsageLimitProps {
  featureKey: keyof ReturnType<typeof usePlan>['currentPlan']['limits'];
  className?: string;
}

export const UsageLimit = ({ featureKey, className = "" }: UsageLimitProps) => {
  const { getRemainingUses, currentPlan, usageCounts } = usePlan();
  const remaining = getRemainingUses(featureKey);
  const isUnlimited = currentPlan.limits[featureKey] === Infinity;
  const used = usageCounts[featureKey] || 0;
  const total = currentPlan.limits[featureKey];

  return (
    <div className={`text-sm ${className}`}>
      {isUnlimited ? (
        <span className="text-green-600 font-medium">Usos ilimitados</span>
      ) : (
        <div className="flex flex-col gap-1">
          <span className={`font-medium ${remaining > 3 ? 'text-green-600' : remaining > 0 ? 'text-amber-600' : 'text-red-600'}`}>
            {remaining} usos restantes
          </span>
          <span className="text-xs text-gray-500">
            {used} de {total} utilizados
          </span>
        </div>
      )}
    </div>
  );
};
