
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const useMercadoPublicoAlvo = () => {
  const [nicho, setNicho] = useState("");
  const [servicoFoco, setServicoFoco] = useState("");
  const [segmentos, setSegmentos] = useState<string[]>([""]);
  const [problema, setProblema] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resultado, setResultado] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();

  const addSegmento = () => {
    setSegmentos([...segmentos, ""]);
  };

  const removeSegmento = (index: number) => {
    if (segmentos.length > 1) {
      const newSegmentos = [...segmentos];
      newSegmentos.splice(index, 1);
      setSegmentos(newSegmentos);
    }
  };

  const updateSegmento = (index: number, value: string) => {
    const newSegmentos = [...segmentos];
    newSegmentos[index] = value;
    setSegmentos(newSegmentos);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const filledSegmentos = segmentos.filter(seg => seg.trim() !== "");
    if (!nicho || !servicoFoco || filledSegmentos.length === 0 || !problema) {
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
      
      const payload = {
        nicho,
        servicoFoco,
        segmentos: filledSegmentos,
        problema
      };
      
      console.log("Dados sendo enviados:", payload);
      
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

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setErrorMessage("");
    handleSubmit(new Event('submit') as unknown as React.FormEvent);
  };

  return {
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
  };
};

