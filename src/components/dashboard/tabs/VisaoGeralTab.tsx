
import React from "react";
import { StatisticsCards } from "../statistics/StatisticsCards";
import { ToolsUsageCard } from "../statistics/ToolsUsageCard";
import { RecentActivityCard } from "../statistics/RecentActivityCard";
import { SubscriptionCard } from "../SubscriptionCard";

export const VisaoGeralTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <StatisticsCards />
        </div>
        <div className="lg:col-span-1">
          <SubscriptionCard />
        </div>
      </div>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <ToolsUsageCard />
        <RecentActivityCard />
      </div>
    </div>
  );
};
