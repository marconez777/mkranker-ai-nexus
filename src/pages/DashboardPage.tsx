
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DashboardPage = () => {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      
      <Tabs defaultValue="visao-geral">
        <TabsList className="mb-6">
          <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="estatisticas">Estatísticas</TabsTrigger>
          <TabsTrigger value="projetos">Projetos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="visao-geral">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Análises</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">
                  +12% em relação ao mês anterior
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Textos SEO Gerados</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 18V2M10 18V6M4 18v-4" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">
                  +18% em relação ao mês anterior
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Palavras-Chave Pesquisadas</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">136</div>
                <p className="text-xs text-muted-foreground">
                  +24% em relação ao mês anterior
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Ferramentas Mais Utilizadas</CardTitle>
                <CardDescription>
                  Suas ferramentas favoritas nos últimos 30 dias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Mercado e Público Alvo</span>
                        <span className="text-sm text-gray-500">38%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-mkranker-purple h-2 rounded-full" style={{ width: "38%" }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Texto SEO para Blog</span>
                        <span className="text-sm text-gray-500">27%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-mkranker-purple h-2 rounded-full" style={{ width: "27%" }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Palavras Chaves</span>
                        <span className="text-sm text-gray-500">22%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-mkranker-purple h-2 rounded-full" style={{ width: "22%" }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Funil de Busca</span>
                        <span className="text-sm text-gray-500">13%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-mkranker-purple h-2 rounded-full" style={{ width: "13%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
                <CardDescription>
                  Suas últimas 5 atividades na plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">Análise de Mercado e Público Alvo</p>
                      <p className="text-xs text-gray-500">Criado há 5 minutos</p>
                    </div>
                    <div className="text-xs text-gray-500">Marketing Digital</div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">Texto SEO para Produto</p>
                      <p className="text-xs text-gray-500">Criado há 1 hora</p>
                    </div>
                    <div className="text-xs text-gray-500">Smartphone XYZ</div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">Palavras-Chave</p>
                      <p className="text-xs text-gray-500">Criado há 3 horas</p>
                    </div>
                    <div className="text-xs text-gray-500">Marketing Digital</div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">Texto SEO para Blog</p>
                      <p className="text-xs text-gray-500">Criado ontem</p>
                    </div>
                    <div className="text-xs text-gray-500">Como fazer SEO</div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">Funil de Busca</p>
                      <p className="text-xs text-gray-500">Criado ontem</p>
                    </div>
                    <div className="text-xs text-gray-500">Consultoria SEO</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="estatisticas">
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas Detalhadas</CardTitle>
              <CardDescription>
                Visualize o desempenho de suas ferramentas ao longo do tempo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Dados detalhados de estatísticas serão exibidos aqui
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="projetos">
          <Card>
            <CardHeader>
              <CardTitle>Seus Projetos</CardTitle>
              <CardDescription>
                Gerencie seus projetos de marketing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Lista de projetos será exibida aqui
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default DashboardPage;
