
// Configuração necessária para o webhook
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Criar o cliente do Supabase
export const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
export const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// Token de acesso do Mercado Pago
export const mercadoPagoAccessToken = Deno.env.get("MERCADO_PAGO_ACCESS_TOKEN") || "";
