
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Lidar com solicitações CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Obter as credenciais de ambiente
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error("Variáveis de ambiente SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não configuradas");
    }

    // Inicializar cliente Supabase com a service role key
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    
    console.log("Tentando criar usuário administrador...");
    
    // Criar usuário com admin API
    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email: 'marco_next7@hotmail.com',
      password: '558166zx.123456==',
      email_confirm: true,
      user_metadata: { full_name: 'Administrador' }
    });

    if (createError) {
      console.error("Erro ao criar usuário:", createError);
      return new Response(JSON.stringify({ 
        success: false, 
        error: createError.message 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    console.log("Usuário criado com sucesso:", userData.user.id);
    
    // Adicionar o usuário à tabela user_roles com papel admin
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({ user_id: userData.user.id, role: 'admin' });

    if (roleError) {
      console.error("Erro ao atribuir papel admin:", roleError);
      return new Response(JSON.stringify({ 
        success: false, 
        userId: userData.user.id,
        error: "Usuário criado mas não foi possível atribuir papel admin: " + roleError.message 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      userId: userData.user.id,
      message: "Usuário administrador criado com sucesso"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Erro na função create-admin-user:", error.message);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
