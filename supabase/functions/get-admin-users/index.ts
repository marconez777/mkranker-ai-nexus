
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
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Verificar se o usuário atual é um administrador
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
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
      .eq('user_id', user.id)
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

    // Se chegou aqui, o usuário é administrador
    // Use o supabase-js admin para acessar dados que normalmente não estariam disponíveis
    // Como não podemos acessar diretamente auth.users, vamos usar uma abordagem alternativa
    // Buscar todos os usuários baseado nos perfis
    const { data: profiles, error: profilesError } = await supabaseClient
      .from('profiles')
      .select('id')

    if (profilesError) {
      throw profilesError;
    }

    // Para cada perfil, buscar informações do usuário usando getUser (que é seguro)
    const userPromises = profiles.map(async (profile) => {
      try {
        // Obter o usuário pelo ID usando o método getUser do SDK
        const { data, error } = await supabaseClient.functions.invoke('get-user-by-id', {
          body: { userId: profile.id }
        });
        
        if (error || !data) {
          console.error(`Erro ao buscar usuário ${profile.id}:`, error);
          return null;
        }

        return data.user;
      } catch (err) {
        console.error(`Erro ao processar usuário ${profile.id}:`, err);
        return null;
      }
    });

    // Aguardar todas as promessas e filtrar resultados nulos
    let usersData = await Promise.all(userPromises);
    usersData = usersData.filter(user => user !== null);

    // Retornar os dados dos usuários
    return new Response(
      JSON.stringify({ users: usersData }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
