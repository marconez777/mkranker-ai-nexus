
import React from "react";
import { StatisticsCards } from "../statistics/StatisticsCards";
import { ToolsUsageCard } from "../statistics/ToolsUsageCard";
import { RecentActivityCard } from "../statistics/RecentActivityCard";

export const VisaoGeralTab: React.FC = () => {
  return (
    <>
      <StatisticsCards />
      
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <ToolsUsageCard />
        <RecentActivityCard />
      </div>
    </>
  );
};
