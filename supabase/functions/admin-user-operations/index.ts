
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
        JSON.stringify({ 
          success: false, 
          message: 'Não autorizado' 
        }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Não autorizado' 
        }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verificar se o usuário é administrador
    const { data: isAdmin, error: roleCheckError } = await supabaseAdmin.rpc('is_admin', {
      user_id: user.id
    });

    if (roleCheckError || !isAdmin) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Acesso negado: somente administradores podem acessar esta função' 
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Processar operação específica
    const { operation, userId, data } = await req.json();
    console.log(`Executando operação '${operation}' para o usuário ${userId}`);

    // Validar se o usuário alvo existe antes de executar qualquer operação
    const { data: targetUser, error: targetError } = await supabaseAdmin.auth.admin.getUserById(userId);
    if (targetError || !targetUser) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Usuário não encontrado' 
        }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let result;
    let responseMessage = '';
    
    switch (operation) {
      case 'delete':
        // Verificando se o usuário não está tentando excluir sua própria conta
        if (userId === user.id) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              message: 'Você não pode excluir sua própria conta' 
            }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        result = await supabaseAdmin.auth.admin.deleteUser(userId);
        responseMessage = 'Usuário excluído com sucesso';
        break;
        
      case 'toggle_active':
        const isActive = data.isActive;
        result = await supabaseAdmin
          .from('profiles')
          .update({ is_active: isActive })
          .eq('id', userId);
        responseMessage = isActive 
          ? 'Usuário ativado com sucesso' 
          : 'Usuário desativado com sucesso';
        break;
        
      case 'toggle_role':
        const newRole = data.role;
        result = await supabaseAdmin
          .from('user_roles')
          .update({ role: newRole })
          .eq('user_id', userId);
        responseMessage = newRole === 'admin'
          ? 'Usuário promovido para admin com sucesso'
          : 'Permissões de usuário atualizadas com sucesso';
        break;
        
      default:
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: 'Operação desconhecida' 
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    if (result.error) {
      console.error(`Erro na operação '${operation}':`, result.error);
      throw result.error;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: responseMessage,
        data: result.data 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Erro na função de administração:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
