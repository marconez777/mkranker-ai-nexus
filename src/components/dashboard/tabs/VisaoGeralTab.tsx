
import React from "react";
import { StatisticsCards } from "../statistics/StatisticsCards";
import { ToolsUsageCard } from "../statistics/ToolsUsageCard";
import { RecentActivityCard } from "../statistics/RecentActivityCard";
import { PaymentHistoryCard } from "../PaymentHistoryCard";
import { SubscriptionCard } from "../SubscriptionCard";

export const VisaoGeralTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <StatisticsCards />
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <SubscriptionCard />
        </div>
        <div className="lg:col-span-2">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 h-full">
            <ToolsUsageCard />
            <RecentActivityCard />
          </div>
        </div>
      </div>
      
      <div>
        <PaymentHistoryCard />
      </div>
    </div>
  );
};
