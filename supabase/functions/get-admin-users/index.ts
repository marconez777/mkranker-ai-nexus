
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.25.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Criar cliente Supabase com a chave de serviço para acesso admin
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      }
    );

    // Verificar autenticação
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Acesso não autorizado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Acesso não autorizado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verificar se o usuário é administrador
    const { data: isAdmin, error: roleCheckError } = await supabaseAdmin.rpc('is_admin', {
      user_id: user.id
    });

    if (roleCheckError || !isAdmin) {
      return new Response(
        JSON.stringify({ success: false, error: 'Acesso não autorizado' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Buscar todos os usuários
    const { data: users, error: usersError } = await supabaseAdmin.auth.admin.listUsers();

    if (usersError) {
      console.error('Erro ao buscar usuários:', usersError);
      return new Response(
        JSON.stringify({ success: false, error: 'Erro ao buscar usuários' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Buscar dados de perfis (para status ativo)
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('id, is_active');

    if (profilesError) {
      console.error('Erro ao buscar perfis:', profilesError);
      return new Response(
        JSON.stringify({ success: false, error: 'Erro ao buscar dados de perfis' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Buscar dados de roles dos usuários
    const { data: roles, error: rolesError } = await supabaseAdmin
      .from('user_roles')
      .select('user_id, role');

    if (rolesError) {
      console.error('Erro ao buscar roles:', rolesError);
      return new Response(
        JSON.stringify({ success: false, error: 'Erro ao buscar dados de roles' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Buscar dados de uso
    const { data: usage, error: usageError } = await supabaseAdmin
      .from('user_usage')
      .select('*');

    if (usageError) {
      console.error('Erro ao buscar dados de uso:', usageError);
      return new Response(
        JSON.stringify({ success: false, error: 'Erro ao buscar dados de uso' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Buscar dados de assinatura
    const { data: subscriptions, error: subscriptionError } = await supabaseAdmin
      .from('user_subscription')
      .select('user_id, status, vencimento')
      .order('created_at', { ascending: false });

    if (subscriptionError) {
      console.error('Erro ao buscar assinaturas:', subscriptionError);
      return new Response(
        JSON.stringify({ success: false, error: 'Erro ao buscar dados de assinatura' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Estruturar dados para incluir informações de todos os usuários
    const usersWithDetails = users.users.map(userData => {
      // Encontrar o perfil correspondente
      const userProfile = profiles?.find(p => p.id === userData.id);
      
      // Encontrar o papel do usuário
      const userRole = roles?.find(r => r.user_id === userData.id);
      
      // Encontrar dados de uso do usuário
      const userUsage = usage?.find(u => u.user_id === userData.id);
      
      // Encontrar a assinatura mais recente do usuário (já ordenada por created_at desc)
      const userSubscription = subscriptions?.find(s => s.user_id === userData.id);
      
      return {
        id: userData.id,
        email: userData.email,
        created_at: userData.created_at,
        role: userRole?.role || 'user',
        is_active: userProfile?.is_active !== undefined ? userProfile.is_active : false,
        usage: userUsage ? {
          palavras_chaves: userUsage.palavras_chaves || 0,
          mercado_publico_alvo: userUsage.mercado_publico_alvo || 0,
          funil_busca: userUsage.funil_busca || 0,
          texto_seo_blog: userUsage.texto_seo_blog || 0,
          texto_seo_lp: userUsage.texto_seo_lp || 0,
          texto_seo_produto: userUsage.texto_seo_produto || 0,
          pautas_blog: userUsage.pautas_blog || 0,
          meta_dados: userUsage.meta_dados || 0
        } : null,
        subscription: userSubscription ? {
          status: userSubscription.status,
          vencimento: userSubscription.vencimento
        } : null
      };
    });

    return new Response(
      JSON.stringify({ success: true, users: usersWithDetails }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Erro na função de admin:', error);
    
    return new Response(
      JSON.stringify({ success: false, error: 'Erro ao buscar usuários' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
