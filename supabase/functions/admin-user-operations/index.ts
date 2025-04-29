
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
        JSON.stringify({ error: 'Não autorizado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Não autorizado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verificar se o usuário é administrador
    const { data: isAdmin, error: roleCheckError } = await supabaseAdmin.rpc('is_admin', {
      user_id: user.id
    });

    if (roleCheckError || !isAdmin) {
      return new Response(
        JSON.stringify({ error: 'Acesso negado: somente administradores podem acessar esta função' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Processar operação específica
    const { operation, userId, data } = await req.json();
    console.log(`Executando operação '${operation}' para o usuário ${userId}`);

    let result;
    switch (operation) {
      case 'delete':
        // Verificando se o usuário não está tentando excluir sua própria conta
        if (userId === user.id) {
          return new Response(
            JSON.stringify({ error: 'Você não pode excluir sua própria conta' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        result = await supabaseAdmin.auth.admin.deleteUser(userId);
        break;
        
      case 'toggle_active':
        const isActive = data.isActive;
        
        // Log detalhado para depuração
        console.log(`Alterando status do usuário ${userId} para: ${isActive ? 'ativo' : 'inativo'}`);
        
        // Verifique se o perfil existe primeiro
        const { data: profileCheck, error: profileCheckError } = await supabaseAdmin
          .from('profiles')
          .select('id, is_active')
          .eq('id', userId)
          .single();
          
        if (profileCheckError) {
          console.error("Erro ao verificar perfil:", profileCheckError);
          
          if (profileCheckError.code === 'PGRST116') {
            // Perfil não existe, então vamos criar um
            console.log(`Perfil não encontrado para ${userId}, criando novo perfil`);
            
            const { data: insertResult, error: insertError } = await supabaseAdmin
              .from('profiles')
              .insert({ 
                id: userId,
                is_active: isActive
              });
              
            if (insertError) {
              throw insertError;
            }
            
            result = { data: insertResult, updated: false, created: true };
            break;
          }
          
          throw profileCheckError;
        }
        
        // Perfil existe, atualize-o
        const { data: updateResult, error: updateError } = await supabaseAdmin
          .from('profiles')
          .update({ is_active: isActive })
          .eq('id', userId);
          
        if (updateError) {
          console.error("Erro ao atualizar perfil:", updateError);
          throw updateError;
        }
        
        console.log(`Perfil atualizado com sucesso para ${userId}, novo status: ${isActive ? 'ativo' : 'inativo'}`);
        result = { data: updateResult, updated: true, created: false, previous: profileCheck };
        break;
        
      case 'toggle_role':
        const newRole = data.role;
        
        // Verifique se o registro de papel existe
        const { data: roleCheck, error: roleCheckError } = await supabaseAdmin
          .from('user_roles')
          .select('*')
          .eq('user_id', userId)
          .single();
          
        if (roleCheckError) {
          if (roleCheckError.code === 'PGRST116') {
            // Papel não existe, inserir novo
            const { data: insertResult, error: insertError } = await supabaseAdmin
              .from('user_roles')
              .insert({ 
                user_id: userId,
                role: newRole
              });
              
            if (insertError) {
              throw insertError;
            }
            
            result = { data: insertResult, updated: false, created: true };
            break;
          }
          throw roleCheckError;
        }
        
        // Papel existe, atualizar
        const { data: updateRoleResult, error: updateRoleError } = await supabaseAdmin
          .from('user_roles')
          .update({ role: newRole })
          .eq('user_id', userId);
          
        if (updateRoleError) {
          throw updateRoleError;
        }
        
        result = { data: updateRoleResult, updated: true, created: false };
        break;
        
      default:
        return new Response(
          JSON.stringify({ error: 'Operação desconhecida' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    if (result.error) {
      console.error(`Erro na operação '${operation}':`, result.error);
      throw result.error;
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Erro na função de administração:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
