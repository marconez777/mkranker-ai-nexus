
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders, authenticateAdmin } from './auth.ts';
import { deleteUser, toggleUserActive, toggleUserRole, manualActivateSubscription } from './operations.ts';

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Authentication and authorization
    const { user, supabaseAdmin } = await authenticateAdmin(req);
    
    // Process specific operation
    const { operation, userId, data } = await req.json();
    console.log(`Executando operação '${operation}' para o usuário ${userId}`);

    let result;
    
    switch (operation) {
      case 'delete':
        result = await deleteUser(supabaseAdmin, userId, user.id);
        break;
        
      case 'toggle_active':
        result = await toggleUserActive(supabaseAdmin, userId, data.isActive);
        break;
        
      case 'toggle_role':
        result = await toggleUserRole(supabaseAdmin, userId, data.role);
        break;
        
      case 'manual_activate_subscription':
        result = await manualActivateSubscription(supabaseAdmin, userId);
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

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : (result.message.includes('não encontrado') ? 404 : 400)
      }
    );

  } catch (error) {
    console.error('Erro na função de administração:', error);
    
    // Determine appropriate status code based on error message
    let status = 500;
    if (error.message.includes('Não autorizado')) {
      status = 401;
    } else if (error.message.includes('Acesso negado')) {
      status = 403;
    } else if (error.message.includes('não encontrado')) {
      status = 404;
    }
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: status
      }
    );
  }
});
