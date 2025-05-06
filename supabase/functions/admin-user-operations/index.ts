
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { deleteUser, manualActivateSubscription } from "./operations.ts";

// Definir cabeçalhos CORS para permitir acesso da aplicação frontend
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

serve(async (req) => {
  // Lidar com solicitações OPTIONS (preflight CORS)
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Log da requisição
    console.log(`Recebendo requisição ${req.method} para admin-user-operations`);
    
    // Verificar se o corpo da requisição existe
    if (!req.body) {
      console.error("Corpo da requisição está vazio");
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Corpo da requisição inválido ou vazio" 
        }),
        {
          status: 400,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          },
        }
      );
    }

    // Processar o corpo da requisição como JSON
    let body;
    try {
      body = await req.json();
      console.log("Corpo da requisição:", JSON.stringify(body));
    } catch (e) {
      console.error("Erro ao analisar JSON:", e);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Corpo da requisição não é um JSON válido" 
        }),
        {
          status: 400,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          },
        }
      );
    }

    // Extrair parâmetros da requisição
    const { operation, userId, data } = body;

    if (!operation) {
      return new Response(
        JSON.stringify({ success: false, message: "Operação não especificada" }),
        {
          status: 400,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          },
        }
      );
    }

    if (!userId) {
      return new Response(
        JSON.stringify({ success: false, message: "ID de usuário não especificado" }),
        {
          status: 400,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          },
        }
      );
    }

    console.log(`Executando operação '${operation}' para o usuário ${userId}`);

    // Executar a operação solicitada
    let result;
    switch (operation) {
      case "delete":
        result = await deleteUser(userId);
        break;
        
      case "manual_activate_subscription":
        if (!data) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              message: "Dados de assinatura não especificados" 
            }),
            {
              status: 400,
              headers: { 
                "Content-Type": "application/json",
                ...corsHeaders
              },
            }
          );
        }
        result = await manualActivateSubscription(userId, data);
        break;

      default:
        return new Response(
          JSON.stringify({ success: false, message: "Operação desconhecida" }),
          {
            status: 400,
            headers: { 
              "Content-Type": "application/json",
              ...corsHeaders
            },
          }
        );
    }

    // Adicionar cabeçalhos CORS à resposta
    const originalResponse = await result.json();
    return new Response(
      JSON.stringify(originalResponse),
      {
        status: result.status,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
    
  } catch (error: any) {
    console.error(`Erro não tratado: ${error.message || error}`);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error.message || "Erro interno no servidor" 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        },
      }
    );
  }
});
