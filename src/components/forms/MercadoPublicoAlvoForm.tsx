
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function MercadoPublicoAlvoForm() {
  const [servicoFoco, setServicoFoco] = useState("");
  const [resultado, setResultado] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!servicoFoco) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simular a chamada para o n8n
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Resposta simulada
      const resposta = `Análise de mercado e público-alvo para: ${servicoFoco}

Mercado:
- O mercado de ${servicoFoco} está em crescimento constante
- Existem oportunidades para diferenciação por qualidade e atendimento
- Concorrentes principais focam em preço, não em valor

Público-Alvo:
- Profissionais entre 30-45 anos
- Buscam soluções eficientes e de qualidade
- Valorizam tempo e resultados tangíveis
- Dispostos a pagar mais por serviços que realmente resolvem seus problemas

Recomendações:
- Focar comunicação nos benefícios e não nas características
- Evidenciar casos de sucesso com métricas concretas
- Criar conteúdo educativo que demonstre expertise
`;
      
      setResultado(resposta);
      
      toast({
        title: "Sucesso!",
        description: "Análise gerada com sucesso.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao gerar a análise. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <Tabs defaultValue="form">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Mercado e Público Alvo</CardTitle>
            <CardDescription>
              Preencha as informações abaixo e clique em gerar
            </CardDescription>
          </div>
          <TabsList>
            <TabsTrigger value="form">Form</TabsTrigger>
            <TabsTrigger value="basic-element">Basic Element</TabsTrigger>
          </TabsList>
        </CardHeader>
        <TabsContent value="form">
          <CardContent className="space-y-4 pt-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="servicoFoco">Qual o Serviço em Foco:</Label>
                <Input
                  id="servicoFoco"
                  placeholder="Ex: Marketing digital"
                  value={servicoFoco}
                  onChange={(e) => setServicoFoco(e.target.value)}
                  required
                />
              </div>
              
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Gerando..." : "Gerar"}
              </Button>
              
              {resultado && (
                <div className="mt-6 space-y-2">
                  <h3 className="text-lg font-medium">O Resultado ficará visível abaixo:</h3>
                  <div className="rounded-md border p-4 bg-white">
                    <Textarea 
                      className="min-h-[200px] resize-none"
                      value={resultado}
                      readOnly
                    />
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="basic-element">
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Configurações de elementos básicos e opções avançadas estarão disponíveis aqui.
            </p>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
