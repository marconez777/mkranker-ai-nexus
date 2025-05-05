import { supabaseAdmin } from '../_shared/supabaseAdmin.ts';

export async function deleteUser(userId: string) {
  try {
    const { error: deleteProfileError } = await supabaseAdmin
      .from("profiles")
      .delete()
      .eq("id", userId);

    if (deleteProfileError) throw deleteProfileError;

    return new Response(JSON.stringify({ success: true, message: "Usuário excluído com sucesso" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, message: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function manualActivateSubscription(userId: string, data: any) {
  const { planType, vencimento } = data;

  try {
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({ plan_type: planType })
      .eq('id', userId);

    if (profileError) throw profileError;

    const { error: subError } = await supabaseAdmin
      .from('user_subscription')
      .upsert({
        user_id: userId,
        plan_type: planType,
        vencimento,
        status: 'ativo'
      }, { onConflict: 'user_id' });

    if (subError) throw subError;

    const limits = {
      solo: {
        palavras_chaves: 20,
        texto_seo_blog: 15,
        funil_busca: 5,
        pautas_blog: 5,
        meta_dados: 50,
      },
      discovery: {
        palavras_chaves: 60,
        texto_seo_blog: 60,
        funil_busca: 15,
        pautas_blog: 15,
        meta_dados: 100,
      },
      escala: {
        palavras_chaves: 9999,
        texto_seo_blog: 9999,
        funil_busca: 9999,
        pautas_blog: 9999,
        meta_dados: 9999,
      }
    }[planType];

    const { error: usageError } = await supabaseAdmin
      .from('user_usage')
      .upsert({
        user_id: userId,
        ...limits,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

    if (usageError) throw usageError;

    return new Response(JSON.stringify({
      success: true,
      message: "Assinatura ativada com sucesso"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Erro na ativação manual:", error.message || error);
    return new Response(JSON.stringify({
      success: false,
      message: error.message || "Erro interno ao ativar assinatura"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
