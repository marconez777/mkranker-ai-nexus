import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export function MercadoPublicoAlvoForm() {
  const [nicho, setNicho] = useState("");
  const [servicoFoco, setServicoFoco] = useState("");
  const [segmento, setSegmento] = useState("");
  const [problema, setProblema] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resultado, setResultado] = useState("");
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
      const response = await fetch('https://mkseo77.app.n8n.cloud/webhook-test/pesquisa-mercado', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nicho,
          servicoFoco,
          segmento,
          problema
        })
      });

      if (!response.ok) {
        throw new Error('Falha ao enviar dados');
      }

      const data = await response.json();
      
      // Set the webhook response data as the resultado
      setResultado(data.message || JSON.stringify(data));
      
      toast({
        title: "Sucesso!",
        description: "Sua análise foi enviada com sucesso.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao enviar os dados. Tente novamente.",
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
