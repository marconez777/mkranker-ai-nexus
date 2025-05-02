
import React from "react";
import { SubscriptionCard } from "./SubscriptionCard";

export const DashboardHeader: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 w-full">
      <div>
        {/* Title removed as it's redundant with individual page titles */}
      </div>
      <div className="w-full md:w-64">
        <SubscriptionCard />
      </div>
    </div>
  );
};
