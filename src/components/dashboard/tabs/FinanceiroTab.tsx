
import React from "react";
import { SubscriptionCard } from "../SubscriptionCard";
import { PaymentHistoryCard } from "../PaymentHistoryCard";

export const FinanceiroTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <SubscriptionCard />
      <PaymentHistoryCard />
    </div>
  );
};
