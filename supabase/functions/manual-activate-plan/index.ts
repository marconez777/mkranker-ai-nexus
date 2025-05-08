
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Define types
type PlanType = 'solo' | 'discovery' | 'escala';

interface PlanLimits {
  mercado_publico_alvo: number;
  palavras_chaves: number;
  funil_busca: number;
  meta_dados: number;
  texto_seo_blog: number;
  texto_seo_lp: number;
  texto_seo_produto: number;
  pautas_blog: number;
}

interface RequestBody {
  userId: string;
  planType: PlanType;
  vencimento: string;
}

// CORS headers for browser access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Plan limits as defined in requirements
const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  solo: {
    palavras_chaves: 20,
    texto_seo_blog: 15,
    texto_seo_lp: 10,
    texto_seo_produto: 10,
    funil_busca: 5,
    mercado_publico_alvo: 5,
    pautas_blog: 5,
    meta_dados: 50
  },
  discovery: {
    palavras_chaves: 60,
    texto_seo_blog: 60,
    texto_seo_lp: 30,
    texto_seo_produto: 30,
    funil_busca: 15,
    mercado_publico_alvo: 15,
    pautas_blog: 15,
    meta_dados: 100
  },
  escala: {
    palavras_chaves: -1,
    texto_seo_blog: -1,
    texto_seo_lp: -1,
    texto_seo_produto: -1,
    funil_busca: -1,
    mercado_publico_alvo: -1,
    pautas_blog: -1,
    meta_dados: -1
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize the Supabase client with admin privileges
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request body
    const body: RequestBody = await req.json();
    const { userId, planType, vencimento } = body;

    console.log(`Activating plan ${planType} for user ${userId} with expiration ${vencimento}`);

    if (!userId || !planType || !vencimento) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Validate planType
    if (!['solo', 'discovery', 'escala'].includes(planType)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid plan type' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Fetch the plan ID from the plans table
    const { data: planData, error: planError } = await supabase
      .from("plans")
      .select("id")
      .eq("name", planType)
      .maybeSingle();

    if (planError) {
      console.error("Error fetching plan:", planError);
      return new Response(
        JSON.stringify({ success: false, error: `Error fetching plan: ${planError.message}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const planId = planData?.id;
    if (!planId) {
      return new Response(
        JSON.stringify({ success: false, error: `Plan "${planType}" not found in database` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    // Step 1: Update user profile
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ plan_type: planType })
      .eq("id", userId);

    if (profileError) {
      console.error("Error updating profile:", profileError);
      return new Response(
        JSON.stringify({ success: false, error: `Error updating profile: ${profileError.message}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Step 2: Update or insert subscription
    const { data: existingSub, error: checkError } = await supabase
      .from("user_subscription")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    let subscriptionResult;
    if (existingSub) {
      // Update existing subscription
      const { data: updatedSub, error: updateError } = await supabase
        .from("user_subscription")
        .update({
          plan_id: planId,
          plan_type: planType,
          status: "ativo",
          vencimento,
          updated_at: new Date().toISOString()
        })
        .eq("user_id", userId)
        .select()
        .single();

      if (updateError) {
        console.error("Error updating subscription:", updateError);
        return new Response(
          JSON.stringify({ success: false, error: `Error updating subscription: ${updateError.message}` }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }
      subscriptionResult = updatedSub;
    } else {
      // Create new subscription
      const { data: newSub, error: insertError } = await supabase
        .from("user_subscription")
        .insert({
          user_id: userId,
          plan_id: planId,
          plan_type: planType,
          status: "ativo",
          vencimento,
          updated_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (insertError) {
        console.error("Error creating subscription:", insertError);
        return new Response(
          JSON.stringify({ success: false, error: `Error creating subscription: ${insertError.message}` }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }
      subscriptionResult = newSub;
    }

    // Step 3: Update or insert usage records with plan limits
    const planLimits = PLAN_LIMITS[planType];
    
    // Check if user already has usage records
    const { data: existingUsage, error: usageError } = await supabase
      .from("user_usage")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (usageError && usageError.code !== 'PGRST116') {
      console.error("Error checking usage records:", usageError);
      return new Response(
        JSON.stringify({ success: false, error: `Error checking usage: ${usageError.message}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Reset usage counters based on the new plan
    if (existingUsage) {
      // Update existing usage record with zero counts
      const { error: resetError } = await supabase
        .from("user_usage")
        .update({
          mercado_publico_alvo: 0,
          palavras_chaves: 0,
          funil_busca: 0,
          meta_dados: 0,
          texto_seo_blog: 0,
          texto_seo_lp: 0,
          texto_seo_produto: 0,
          pautas_blog: 0,
          updated_at: new Date().toISOString()
        })
        .eq("user_id", userId);

      if (resetError) {
        console.error("Error resetting usage counters:", resetError);
        return new Response(
          JSON.stringify({ success: false, error: `Error resetting usage: ${resetError.message}` }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }
    } else {
      // Create new usage record with zero counts
      const { error: createError } = await supabase
        .from("user_usage")
        .insert({
          user_id: userId,
          mercado_publico_alvo: 0,
          palavras_chaves: 0,
          funil_busca: 0,
          meta_dados: 0,
          texto_seo_blog: 0,
          texto_seo_lp: 0,
          texto_seo_produto: 0,
          pautas_blog: 0,
          updated_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        });

      if (createError) {
        console.error("Error creating usage record:", createError);
        return new Response(
          JSON.stringify({ success: false, error: `Error creating usage: ${createError.message}` }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }
    }

    console.log("Successfully activated plan", planType, "for user", userId);

    return new Response(
      JSON.stringify({ success: true, data: subscriptionResult }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ success: false, error: `Unexpected error: ${error.message}` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
