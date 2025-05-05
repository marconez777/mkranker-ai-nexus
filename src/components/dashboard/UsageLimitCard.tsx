
import { usePlan } from "@/contexts/PlanContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Text, Search, Filter, File, List } from "lucide-react";

export function UsageLimitCard() {
  const { currentPlan, usageCounts } = usePlan();

  // Function to format limit display
  const formatLimit = (limit: number) => {
    return limit === Infinity ? "Ilimitado" : limit;
  };

  // Function to calculate percentage
  const calculatePercentage = (used: number, limit: number) => {
    if (limit === Infinity) return 0; // Show empty bar for unlimited
    return Math.min(Math.round((used / limit) * 100), 100);
  };

  // Function to get status color
  const getStatusColor = (used: number, limit: number) => {
    if (limit === Infinity) return "bg-gray-200";
    const percentage = (used / limit) * 100;
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-amber-500";
    return "bg-green-500";
  };

  const features = [
    {
      name: "Palavras Chaves",
      key: "palavrasChaves" as const,
      icon: <Search className="h-4 w-4 text-blue-500" />,
    },
    {
      name: "Textos SEO",
      key: "textoSeoBlog" as const,
      icon: <Text className="h-4 w-4 text-green-500" />,
      description: "Blog, Landing Page e Produto",
    },
    {
      name: "Funil de Busca",
      key: "funilBusca" as const,
      icon: <Filter className="h-4 w-4 text-purple-500" />,
    },
    {
      name: "Pautas de Blog",
      key: "pautasBlog" as const,
      icon: <List className="h-4 w-4 text-amber-500" />,
    },
    {
      name: "Meta Dados",
      key: "metaDados" as const,
      icon: <File className="h-4 w-4 text-indigo-500" />,
    },
  ];

  return (
    <Card className="border-gray-200 hover:border-gray-300 transition-all">
      <CardHeader>
        <CardTitle className="text-lg">Limites de Uso</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {features.map((feature) => {
          const used = usageCounts[feature.key];
          const limit = currentPlan.limits[feature.key];
          const percentage = calculatePercentage(used, limit);
          
          return (
            <div key={feature.key} className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {feature.icon}
                  <span className="text-sm font-medium">{feature.name}</span>
                </div>
                <span className="text-sm font-medium">
                  {used} / {formatLimit(limit)}
                </span>
              </div>
              
              <Progress 
                value={percentage} 
                className="h-2" 
                indicatorClassName={getStatusColor(used, limit)}
              />
              
              {feature.description && (
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
