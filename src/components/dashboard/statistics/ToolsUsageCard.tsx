
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserDashboardData } from "@/hooks/useUserDashboardData";
import { BarChart2 } from "lucide-react";

export const ToolsUsageCard: React.FC = () => {
  const { isLoading, toolsUsage } = useUserDashboardData();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            <Skeleton className="h-6 w-48" />
          </div>
          <Skeleton className="h-4 w-64 mt-1" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-8" />
              </div>
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChart2 className="h-4 w-4 text-primary" />
          <CardTitle>Ferramentas Mais Utilizadas</CardTitle>
        </div>
        <CardDescription>
          Suas ferramentas favoritas na plataforma
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {toolsUsage && toolsUsage.length > 0 ? (
            toolsUsage.map((tool, index) => (
              <div key={index} className="flex items-center">
                <div className="w-full">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{tool.name}</span>
                    <span className="text-sm text-gray-500">{Math.round(tool.percentage)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-mkranker-purple h-2 rounded-full"
                      style={{ width: `${tool.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">
              <p>Nenhuma ferramenta utilizada ainda</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
