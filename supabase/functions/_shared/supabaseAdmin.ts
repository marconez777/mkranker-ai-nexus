
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.25.0';

// Create Supabase admin client
export const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  {
    auth: {
      persistSession: false,
    },
  }
);
