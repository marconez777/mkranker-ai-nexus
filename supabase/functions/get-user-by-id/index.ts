
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Criar um cliente Supabase com o contexto Auth do usuário logado
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Verificar se o usuário atual é um administrador
    const {
      data: { user: callerUser },
    } = await supabaseClient.auth.getUser()

    if (!callerUser) {
      return new Response(
        JSON.stringify({ error: "Usuário não autenticado" }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      )
    }

    // Verificar se o usuário é administrador consultando a tabela user_roles
    const { data: adminCheck, error: adminCheckError } = await supabaseClient
      .from('user_roles')
      .select('*')
      .eq('user_id', callerUser.id)
      .eq('role', 'admin')
      .single()

    if (adminCheckError || !adminCheck) {
      return new Response(
        JSON.stringify({ error: "Acesso não autorizado" }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403,
        }
      )
    }

    // Obter o ID de usuário da solicitação
    const { userId } = await req.json()

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "ID de usuário não fornecido" }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Usar o cliente admin para obter o usuário pelo ID
    const { data: user, error } = await supabaseClient.auth.admin.getUserById(userId)

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({ user: user.user }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
