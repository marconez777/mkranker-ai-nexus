
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get Supabase client with admin permissions
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log("Starting verification of expired subscriptions...");
    
    // Get all active subscriptions
    const { data: activeSubscriptions, error: fetchError } = await supabase
      .from("user_subscription")
      .select("id, user_id, vencimento")
      .eq("status", "ativo");

    if (fetchError) {
      throw new Error(`Error fetching subscriptions: ${fetchError.message}`);
    }

    console.log(`Found ${activeSubscriptions?.length || 0} active subscriptions to check`);

    // Current date for comparison
    const today = new Date();
    
    // Array to store expired subscription IDs
    const expiredSubscriptionIds: string[] = [];

    // Check each subscription
    activeSubscriptions?.forEach(subscription => {
      const expiryDate = new Date(subscription.vencimento);
      if (expiryDate < today) {
        expiredSubscriptionIds.push(subscription.id);
      }
    });

    console.log(`Found ${expiredSubscriptionIds.length} expired subscriptions`);

    // Update expired subscriptions if any
    if (expiredSubscriptionIds.length > 0) {
      const { data: updateResult, error: updateError } = await supabase
        .from("user_subscription")
        .update({ status: "expirado" })
        .in("id", expiredSubscriptionIds);

      if (updateError) {
        throw new Error(`Error updating subscriptions: ${updateError.message}`);
      }

      console.log(`Successfully updated ${expiredSubscriptionIds.length} expired subscriptions`);
    }

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Verified ${activeSubscriptions?.length || 0} subscriptions, updated ${expiredSubscriptionIds.length} expired ones.` 
      }),
      { 
        status: 200, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        } 
      }
    );
  } catch (error) {
    console.error("Error in verify-expired-subscriptions:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        } 
      }
    );
  }
});
