
import { useToast } from "@/hooks/use-toast";
import { FunilBuscaFormData } from "@/types/funil-busca";
import { supabase } from "@/integrations/supabase/client";

export const sendToWebhook = async (data: FunilBuscaFormData) => {
  try {
    console.log("Enviando dados para o webhook:", data);
    
    const response = await fetch('https://mkseo77.app.n8n.cloud/webhook/f403ed72-e710-4b5d-a2bb-5c57679857d3', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'no-cors',
      body: JSON.stringify(data)
    });
    
    console.log("Dados enviados para webhook com sucesso");
    return true;
  } catch (error) {
    console.error("Erro ao enviar dados para webhook:", error);
    return false;
  }
};

export const parseWebhookResponse = (responseText: string) => {
  try {
    if (!responseText || typeof responseText !== 'string') {
      console.log("Resposta vazia ou inválida");
      return responseText || "Sem resposta do servidor";
    }
    
    // Only try to parse if it looks like JSON
    if (responseText.trim().startsWith('{') || responseText.trim().startsWith('[')) {
      const responseData = JSON.parse(responseText);
      console.log("Dados da resposta parseados:", responseData);
      
      if (typeof responseData === 'string') {
        return responseData;
      } else if (responseData && responseData.message) {
        return responseData.message;
      } else if (responseData && responseData.output) {
        return responseData.output;
      } else {
        return JSON.stringify(responseData);
      }
    } else {
      console.log("Resposta não é formato JSON, retornando como texto");
      return responseText;
    }
  } catch (parseError) {
    console.log("Resposta não é JSON válido, usando texto bruto:", parseError);
    return responseText;
  }
};

export const saveAnalysisToDatabase = async (data: FunilBuscaFormData, resultText: string) => {
  try {
    // First refresh the session
    await supabase.auth.refreshSession();
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error("Usuário não autenticado");
      return false;
    }
    
    const { error: saveError } = await supabase
      .from('analise_funil_busca')
      .insert({
        micro_nicho: data.microNicho,
        publico_alvo: data.publicoAlvo,
        segmento: data.segmento,
        resultado: resultText,
        user_id: user.id
      });

    if (saveError) {
      console.error("Erro ao salvar no Supabase:", saveError);
      return false;
    }
    
    console.log("Análise salva com sucesso no banco de dados");
    return true;
  } catch (error) {
    console.error("Erro ao salvar análise:", error);
    return false;
  }
};
