
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export function MercadoPublicoAlvoForm() {
  const [nicho, setNicho] = useState("");
  const [servicoFoco, setServicoFoco] = useState("");
  const [segmento, setSegmento] = useState("");
  const [problema, setProblema] = useState("");
  const [resultado, setResultado] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nicho || !servicoFoco || !segmento || !problema) {
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
      const resposta = `Análise de mercado e público-alvo para:

Nicho: ${nicho}
Serviço em Foco: ${servicoFoco}
Segmento: ${segmento}
Problema/Necessidade: ${problema}

Análise de Mercado:
- O mercado de ${nicho} está em constante evolução
- Existe uma demanda crescente por ${servicoFoco}
- O segmento ${segmento} apresenta oportunidades significativas
- Há espaço para diferenciação através de soluções específicas

Público-Alvo:
- Profissionais e empresas que necessitam de ${servicoFoco}
- Foco em ${segmento} que buscam resolver: ${problema}
- Dispostos a investir em soluções profissionais
- Valorizam resultados e qualidade no serviço

Recomendações:
- Desenvolver uma proposta de valor única focada na solução do problema
- Criar conteúdo educativo específico para o nicho
- Estabelecer parcerias estratégicas no segmento
- Implementar casos de sucesso como prova social
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
                <Label htmlFor="nicho">Qual o seu Nicho:</Label>
                <Input
                  id="nicho"
                  placeholder="Ex: Marketing digital"
                  value={nicho}
                  onChange={(e) => setNicho(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="servicoFoco">Qual o Serviço em Foco:</Label>
                <Input
                  id="servicoFoco"
                  placeholder="Ex: Tráfego pago"
                  value={servicoFoco}
                  onChange={(e) => setServicoFoco(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="segmento">Qual o seu segmento:</Label>
                <Select value={segmento} onValueChange={setSegmento} required>
                  <SelectTrigger id="segmento">
                    <SelectValue placeholder="Ex: Agência, Freelancer, Empresa..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agencia">Agência</SelectItem>
                    <SelectItem value="freelancer">Freelancer</SelectItem>
                    <SelectItem value="empresa">Empresa</SelectItem>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="problema">Problema ou Necessidade:</Label>
                <Textarea
                  id="problema"
                  placeholder="Ex: Não está vendendo o quanto gostaria"
                  value={problema}
                  onChange={(e) => setProblema(e.target.value)}
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
