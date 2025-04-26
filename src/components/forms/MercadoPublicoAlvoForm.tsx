
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { AlertCircle, RefreshCw, AlertTriangle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export function MercadoPublicoAlvoForm() {
  const [nicho, setNicho] = useState("");
  const [servicoFoco, setServicoFoco] = useState("");
  const [segmento, setSegmento] = useState("");
  const [problema, setProblema] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resultado, setResultado] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [retryCount, setRetryCount] = useState(0);
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
    setErrorMessage("");
    
    try {
      console.log("Enviando dados para o webhook...");
      
      // Create the request payload
      const payload = {
        nicho,
        servicoFoco,
        segmento,
        problema
      };
      
      console.log("Dados sendo enviados:", payload);
      
      // Try using a no-cors approach to avoid CORS issues
      const response = await fetch('https://mkseo77.app.n8n.cloud/webhook-test/pesquisa-mercado', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log("Resposta recebida do servidor:", response);

      if (!response.ok) {
        throw new Error(`Erro na resposta: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Dados da resposta:", data);
      
      // Set the webhook response data as the resultado
      setResultado(data.message || JSON.stringify(data));
      setErrorMessage("");
      setRetryCount(0);
      
      toast({
        title: "Sucesso!",
        description: "Sua análise foi enviada com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
      setResultado("");
      
      // More detailed error message
      setErrorMessage("Não foi possível conectar ao servidor do webhook. O servidor pode estar indisponível ou existe um problema de conexão. Tente novamente mais tarde.");
      
      toast({
        variant: "destructive",
        title: "Erro na conexão",
        description: "Ocorreu um erro ao enviar os dados. O servidor pode estar indisponível.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle retry
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setErrorMessage("");
    // Re-submit the form
    handleSubmit(new Event('submit') as unknown as React.FormEvent);
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
              
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Gerando...
                  </>
                ) : "Gerar"}
              </Button>
              
              {errorMessage && (
                <Alert variant="destructive" className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Erro de conexão</AlertTitle>
                  <AlertDescription>
                    <p>{errorMessage}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleRetry} 
                      className="mt-2"
                      disabled={isLoading || retryCount >= 3}
                    >
                      {isLoading ? "Tentando..." : "Tentar novamente"}
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
              
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
