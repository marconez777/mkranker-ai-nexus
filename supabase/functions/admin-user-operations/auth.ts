
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.25.0';

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export interface AuthResult {
  user: any;
  supabaseAdmin: ReturnType<typeof createClient>;
}

/**
 * Verifies if the user is authenticated and is an admin
 * @param req The request object
 * @returns An object with the user and Supabase admin client
 */
export async function authenticateAdmin(req: Request): Promise<AuthResult> {
  // Create Supabase admin client
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    {
      auth: {
        persistSession: false,
      },
    }
  );

  // Verify authentication
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    throw new Error('Não autorizado');
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

  if (authError || !user) {
    throw new Error('Não autorizado');
  }

  // Check if the user is an administrator
  const { data: isAdmin, error: roleCheckError } = await supabaseAdmin.rpc('is_admin', {
    user_id: user.id
  });

  if (roleCheckError || !isAdmin) {
    throw new Error('Acesso negado: somente administradores podem acessar esta função');
  }

  return { user, supabaseAdmin };
}
