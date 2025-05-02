
import React from 'react';
import { PLANS } from "@/types/plans";
import PlanCard from './PlanCard';

const PlansGrid: React.FC = () => {
  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      <PlanCard plan={PLANS.solo} />
      <PlanCard plan={PLANS.discovery} isPopular={true} />
      <PlanCard plan={PLANS.escala} />
    </div>
  );
};

export default PlansGrid;
