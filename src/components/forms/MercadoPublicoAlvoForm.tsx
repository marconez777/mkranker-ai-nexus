
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw } from "lucide-react";
import { useMercadoPublicoAlvo } from "@/hooks/useMercadoPublicoAlvo";
import { SegmentosInput } from "./SegmentosInput";
import { ErrorDisplay } from "./ErrorDisplay";
import { ResultDisplay } from "./ResultDisplay";

export function MercadoPublicoAlvoForm() {
  const {
    nicho,
    setNicho,
    servicoFoco,
    setServicoFoco,
    segmentos,
    problema,
    setProblema,
    isLoading,
    resultado,
    errorMessage,
    retryCount,
    addSegmento,
    removeSegmento,
    updateSegmento,
    handleSubmit,
    handleRetry
  } = useMercadoPublicoAlvo();

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
                <Label>Quais são seus segmentos:</Label>
                <SegmentosInput
                  segmentos={segmentos}
                  onAdd={addSegmento}
                  onRemove={removeSegmento}
                  onUpdate={updateSegmento}
                />
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
              
              <ErrorDisplay
                message={errorMessage}
                onRetry={handleRetry}
                retryCount={retryCount}
                isLoading={isLoading}
              />
              
              <ResultDisplay resultado={resultado} />
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

