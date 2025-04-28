
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase URL or service key is not set");
    }

    // Create a Supabase client with the service key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse the request body
    const { currentEmail, newEmail } = await req.json();
    
    if (!currentEmail || !newEmail) {
      throw new Error("Current email and new email are required");
    }

    console.log(`Attempting to update admin email from ${currentEmail} to ${newEmail}`);

    // Find the user by email
    const { data: users, error: findError } = await supabase
      .from('user_roles')
      .select('user_id, role')
      .eq('role', 'admin');

    if (findError) {
      throw new Error(`Error finding admin user: ${findError.message}`);
    }

    if (!users || users.length === 0) {
      throw new Error("No admin users found");
    }

    console.log(`Found ${users.length} admin users`);

    // Update the user's email using the admin API
    const { data, error } = await supabase.auth.admin.updateUserById(
      users[0].user_id,
      { email: newEmail }
    );

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true, message: "Admin email updated successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error updating admin email:", error.message);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
