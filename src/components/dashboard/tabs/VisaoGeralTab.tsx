
import React from "react";
import { StatisticsCards } from "../statistics/StatisticsCards";
import { ToolsUsageCard } from "../statistics/ToolsUsageCard";
import { RecentActivityCard } from "../statistics/RecentActivityCard";

export const VisaoGeralTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <StatisticsCards />
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <ToolsUsageCard />
        <RecentActivityCard />
      </div>
    </div>
  );
};
