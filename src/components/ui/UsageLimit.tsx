
import { usePlan } from "@/contexts/PlanContext";

interface UsageLimitProps {
  featureKey: keyof ReturnType<typeof usePlan>['currentPlan']['limits'];
  className?: string;
}

export const UsageLimit = ({ featureKey, className = "" }: UsageLimitProps) => {
  const { getRemainingUses, currentPlan } = usePlan();
  const remaining = getRemainingUses(featureKey);
  const isUnlimited = currentPlan.limits[featureKey] === Infinity;

  return (
    <div className={`text-sm ${className}`}>
      {isUnlimited ? (
        <span className="text-green-600 font-medium">Usos ilimitados</span>
      ) : (
        <span className={`font-medium ${remaining > 3 ? 'text-green-600' : remaining > 0 ? 'text-amber-600' : 'text-red-600'}`}>
          {remaining} usos restantes
        </span>
      )}
    </div>
  );
};
