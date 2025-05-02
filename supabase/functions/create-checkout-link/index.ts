
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts"; // Necessário para algumas bibliotecas funcionarem no Deno

// SDK do Mercado Pago
import { MercadoPagoConfig, Preference } from "npm:mercadopago@2.0.6";

// Configuração CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Mapeamento de planos e preços (valores fixos para simplificar)
const PLANOS = {
  solo: { titulo: "Plano Solo MKRanker", preco: 97 },
  discovery: { titulo: "Plano Discovery MKRanker", preco: 297 },
  escala: { titulo: "Plano Escala MKRanker", preco: 997 },
  default: { titulo: "Plano Discovery MKRanker", preco: 297 },
};

interface CheckoutRequest {
  user_id?: string;
  plano_id?: string;
  nome_plano?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Obter o token do Mercado Pago das variáveis de ambiente
    const accessToken = Deno.env.get("MERCADO_PAGO_ACCESS_TOKEN");
    if (!accessToken) {
      throw new Error("Token do Mercado Pago não configurado");
    }

    // Inicializar o cliente do Mercado Pago
    const client = new MercadoPagoConfig({ accessToken });
    const preference = new Preference(client);

    // Extrair dados da requisição
    const { user_id, plano_id = "discovery", nome_plano } = await req.json() as CheckoutRequest;
    
    // Obter informações do plano
    const planoInfo = PLANOS[plano_id as keyof typeof PLANOS] || PLANOS.default;
    
    // URL base da aplicação (em produção, usar a URL real)
    const baseUrl = req.headers.get("origin") || "https://seu-site.com";
    
    // URLs de redirecionamento
    const successUrl = `${baseUrl}/checkout/success?user_id=${user_id || ""}&plano=${plano_id}`;
    const failureUrl = `${baseUrl}/checkout?error=payment_failed`;
    
    console.log("Gerando preferência para:", { 
      plano_id, 
      nome_plano: nome_plano || planoInfo.titulo,
      preco: planoInfo.preco
    });

    // Criar a preferência de pagamento
    const response = await preference.create({
      body: {
        items: [
          {
            id: plano_id,
            title: nome_plano || planoInfo.titulo,
            quantity: 1,
            unit_price: planoInfo.preco,
            currency_id: "BRL",
          },
        ],
        auto_return: "approved",
        back_urls: {
          success: successUrl,
          failure: failureUrl,
          pending: failureUrl,
        },
        notification_url: `${baseUrl}/api/webhook-mp`,
        external_reference: user_id ? `user_${user_id}_plan_${plano_id}` : `plan_${plano_id}`,
        expires: true,
        expiration_date_to: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutos
      },
    });

    console.log("Preferência gerada com sucesso:", response.id);

    // Retornar o link de checkout
    return new Response(
      JSON.stringify({
        checkout_url: response.init_point,
        preference_id: response.id,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Erro ao gerar link de checkout:", error);
    
    return new Response(
      JSON.stringify({
        error: error.message || "Erro ao gerar link de pagamento",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
