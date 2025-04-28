import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Documentação MKRanker</h1>
            <Link 
              to="/" 
              className="text-primary hover:underline"
            >
              Voltar para Home
            </Link>
          </div>
          
          <Tabs defaultValue="design">
            <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-3">
              <TabsTrigger value="design">Design System</TabsTrigger>
              <TabsTrigger value="components">Componentes</TabsTrigger>
              <TabsTrigger value="structure">Estrutura</TabsTrigger>
            </TabsList>
            
            <TabsContent value="design" className="space-y-8">
              <Card className="w-full text-left">
                <CardHeader>
                  <CardTitle>Cores</CardTitle>
                  <CardDescription>Paleta de cores do projeto MKRanker</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-2">
                      <div className="h-24 rounded-md bg-mkranker-purple"></div>
                      <p className="font-medium">Purple</p>
                      <p className="text-sm text-muted-foreground">#8054A1</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="h-24 rounded-md bg-mkranker-blue"></div>
                      <p className="font-medium">Blue</p>
                      <p className="text-sm text-muted-foreground">#3b82f6</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="h-24 rounded-md bg-mkranker-light"></div>
                      <p className="font-medium">Light</p>
                      <p className="text-sm text-muted-foreground">#F5F7F9</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="h-24 rounded-md bg-mkranker-dark"></div>
                      <p className="font-medium text-white">Dark</p>
                      <p className="text-sm text-muted-foreground">#1E293B</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    <div className="flex flex-col gap-2">
                      <div className="h-24 rounded-md bg-primary"></div>
                      <p className="font-medium">Primary</p>
                      <p className="text-sm text-muted-foreground">hsl(var(--primary))</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="h-24 rounded-md bg-secondary"></div>
                      <p className="font-medium">Secondary</p>
                      <p className="text-sm text-muted-foreground">hsl(var(--secondary))</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="h-24 rounded-md bg-accent"></div>
                      <p className="font-medium">Accent</p>
                      <p className="text-sm text-muted-foreground">hsl(var(--accent))</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="h-24 rounded-md bg-muted"></div>
                      <p className="font-medium">Muted</p>
                      <p className="text-sm text-muted-foreground">hsl(var(--muted))</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="w-full text-left">
                <CardHeader>
                  <CardTitle>Tipografia</CardTitle>
                  <CardDescription>Fontes utilizadas no projeto</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <h1 className="text-4xl font-bold">Heading 1</h1>
                    <p className="text-sm text-muted-foreground">Font size: 2.25rem (36px)</p>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold">Heading 2</h2>
                    <p className="text-sm text-muted-foreground">Font size: 1.875rem (30px)</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Heading 3</h3>
                    <p className="text-sm text-muted-foreground">Font size: 1.5rem (24px)</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold">Heading 4</h4>
                    <p className="text-sm text-muted-foreground">Font size: 1.25rem (20px)</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-base">Parágrafo (Base)</p>
                    <p className="text-sm text-muted-foreground">Font size: 1rem (16px)</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm">Parágrafo (Small)</p>
                    <p className="text-sm text-muted-foreground">Font size: 0.875rem (14px)</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="w-full text-left">
                <CardHeader>
                  <CardTitle>Elementos de UI</CardTitle>
                  <CardDescription>Componentes principais do design system</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-medium">Botões</h3>
                    <div className="flex flex-wrap gap-4">
                      <Button>Default</Button>
                      <Button variant="secondary">Secondary</Button>
                      <Button variant="outline">Outline</Button>
                      <Button variant="ghost">Ghost</Button>
                      <Button variant="link">Link</Button>
                      <Button variant="destructive">Destructive</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl font-medium">Cards</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Card Title</CardTitle>
                          <CardDescription>Card Description</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p>Card content goes here</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="components" className="space-y-8">
              <Card className="w-full text-left">
                <CardHeader>
                  <CardTitle>Componentes do Projeto</CardTitle>
                  <CardDescription>Principais componentes utilizados</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-medium">Layout</h3>
                    <p>O layout do painel utiliza o componente <code>DashboardLayout</code> que gerencia a estrutura com sidebar e conteúdo principal.</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-medium">Formulários</h3>
                    <p>Os formulários das ferramentas seguem um padrão comum usando os componentes:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li><code>FormField</code> - Componente base para campos de formulário</li>
                      <li><code>FormTextarea</code> - Campo de texto multilinha</li>
                      <li><code>ResultDisplay</code> - Exibe o resultado da análise</li>
                      <li><code>ErrorDisplay</code> - Exibe mensagens de erro</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-medium">Navegação</h3>
                    <p>A navegação é gerenciada por:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li><code>Header</code> - Cabeçalho com navegação principal</li>
                      <li><code>Sidebar</code> - Menu lateral com opções do painel</li>
                      <li><code>SidebarItem</code> - Item de menu da sidebar</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="structure" className="space-y-8">
              <Card className="w-full text-left">
                <CardHeader>
                  <CardTitle>Estrutura do Projeto</CardTitle>
                  <CardDescription>Organização de arquivos e diretórios</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-xl font-medium mb-3">Diretórios Principais</h3>
                    <ul className="space-y-2 list-disc pl-6">
                      <li>
                        <strong>src/components/</strong> - Componentes React reutilizáveis
                        <ul className="pl-6 list-disc">
                          <li><strong>ui/</strong> - Componentes básicos da UI (buttons, cards, etc.)</li>
                          <li><strong>layout/</strong> - Componentes de estrutura da página</li>
                          <li><strong>forms/</strong> - Componentes específicos para formulários</li>
                          <li><strong>home/</strong> - Componentes da página inicial</li>
                        </ul>
                      </li>
                      <li>
                        <strong>src/pages/</strong> - Componentes de página
                      </li>
                      <li>
                        <strong>src/hooks/</strong> - Custom React hooks
                      </li>
                      <li>
                        <strong>src/contexts/</strong> - Context providers
                      </li>
                      <li>
                        <strong>src/lib/</strong> - Utilitários genéricos
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-3">Arquivos Importantes</h3>
                    <ul className="space-y-2 list-disc pl-6">
                      <li><strong>tailwind.config.ts</strong> - Configuração do Tailwind CSS</li>
                      <li><strong>src/App.tsx</strong> - Componente principal da aplicação</li>
                      <li><strong>src/main.tsx</strong> - Ponto de entrada da aplicação</li>
                      <li><strong>src/index.css</strong> - Estilos globais e variáveis CSS</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
