
import { useState } from "react";
import { PalavrasChavesFormData } from "@/types/palavras-chaves";

export const useWebhookApi = () => {
  const [requestData, setRequestData] = useState<string>("");
  
  const sendToWebhook = async (palavras: string) => {
    const linhas = palavras
      .split('\n')
      .map(linha => linha.trim())
      .filter(linha => linha.length > 0);
    
    const linhasUnicas = [...new Set(linhas)];
    const textoFormatado = linhasUnicas.join('\n');
    
    console.log("===== DADOS A SEREM ENVIADOS =====");
    console.log(textoFormatado);
    console.log("==================================");
    
    const bodyData = { palavras: textoFormatado };
    setRequestData(JSON.stringify(bodyData, null, 2));
    
    console.log("Enviando requisição para webhook:", bodyData);
    
    const response = await fetch('https://mkseo77.app.n8n.cloud/webhook/palavras', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro na resposta do webhook:", response.status, errorText);
      throw new Error(`Erro HTTP: ${response.status} - ${errorText || response.statusText}`);
    }

    const responseData = await response.json();
    console.log("Resposta bruta do webhook:", responseData);
    return responseData;
  };

  return {
    requestData,
    sendToWebhook
  };
};
