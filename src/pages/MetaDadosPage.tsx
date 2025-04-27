
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function MetaDadosPage() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Meta-dados</h1>
      <Card>
        <CardHeader>
          <CardTitle>Meta-dados</CardTitle>
          <CardDescription>
            Configure e gerencie seus meta-dados para melhorar o SEO do seu site
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Conteúdo da página de meta-dados estará disponível em breve.
          </p>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
