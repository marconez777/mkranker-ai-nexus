
import { supabaseAdmin } from '../_shared/supabaseAdmin.ts';

export async function deleteUser(userId: string) {
  try {
    console.log(`Excluindo dados relacionados para o usuário ${userId}`);
    
    // Deletar registros em todas as tabelas relacionadas antes de excluir o perfil
    const tables = [
      'analise_funil_busca',
      'analise_mercado',
      'palavras_chaves',
      'palavras_chaves_analises',
      'pautas_blog',
      'meta_dados',
      'texto_seo_blog',
      'texto_seo_produto',
      'texto_seo_lp',
      'user_usage',
      'user_subscription',
      'user_roles'
    ];
    
    // Deletar todos os registros relacionados em cada tabela
    for (const table of tables) {
      console.log(`Removendo dados de ${table} para usuário ${userId}`);
      const { error } = await supabaseAdmin
        .from(table)
        .delete()
        .eq("user_id", userId);
      
      if (error && !error.message.includes("does not exist")) {
        console.warn(`Erro ao excluir dados de ${table}: ${error.message}`);
      }
    }

    // Agora podemos excluir o perfil do usuário
    const { error: deleteProfileError } = await supabaseAdmin
      .from("profiles")
      .delete()
      .eq("id", userId);

    if (deleteProfileError) {
      console.error(`Erro ao excluir perfil: ${deleteProfileError.message}`);
      throw deleteProfileError;
    }

    // Por último, excluir o usuário do sistema Auth
    console.log(`Excluindo usuário ${userId} do sistema de autenticação`);
    const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(
      userId
    );

    if (deleteAuthError) {
      console.error(`Erro ao excluir usuário auth: ${deleteAuthError.message}`);
      throw deleteAuthError;
    }

    return new Response(JSON.stringify({ success: true, message: "Usuário excluído com sucesso" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error(`Erro ao excluir usuário: ${error.message || error}`);
    return new Response(JSON.stringify({ success: false, message: error.message || "Erro interno ao excluir usuário" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function manualActivateSubscription(userId: string, data: any) {
  try {
    const { planType, vencimento } = data;
    
    console.log(`Ativando assinatura manualmente para usuário ${userId} com plano ${planType} e vencimento ${vencimento}`);

    // Buscar plano do banco de dados para obter o ID
    let planId = null;
    try {
      const { data: planData, error: planError } = await supabaseAdmin
        .from('plans')
        .select('id')
        .eq('name', planType)
        .eq('is_active', true)
        .single();

      if (planError) {
        console.error(`Plano "${planType}" não encontrado ou inativo: ${planError}`);
      } else if (planData) {
        planId = planData.id;
      }
    } catch (err) {
      console.warn(`Erro ao buscar plano: ${err.message}`);
      // Continue mesmo sem o ID do plano
    }

    // Atualizar o perfil do usuário
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({ plan_type: planType })
      .eq('id', userId);

    if (profileError) {
      console.error(`Erro ao atualizar perfil: ${profileError.message}`);
      throw profileError;
    }

    // Upsert na tabela de assinatura
    const subscriptionData: any = {
      user_id: userId,
      plan_type: planType,
      vencimento,
      status: 'ativo',
      updated_at: new Date().toISOString()
    };
    
    // Adicionar plan_id apenas se encontrado
    if (planId) {
      subscriptionData.plan_id = planId;
    }

    const { error: subError } = await supabaseAdmin
      .from('user_subscription')
      .upsert(subscriptionData, { onConflict: 'user_id' });

    if (subError) {
      console.error(`Erro ao atualizar assinatura: ${subError.message}`);
      throw subError;
    }

    // Definir limites com base no tipo de plano
    const limits = {
      solo: {
        palavras_chaves: 20,
        texto_seo_blog: 15,
        funil_busca: 5,
        pautas_blog: 5,
        meta_dados: 50,
        texto_seo_lp: 10,
        texto_seo_produto: 10,
        mercado_publico_alvo: 5
      },
      discovery: {
        palavras_chaves: 60,
        texto_seo_blog: 60,
        funil_busca: 15,
        pautas_blog: 15,
        meta_dados: 100,
        texto_seo_lp: 30,
        texto_seo_produto: 30,
        mercado_publico_alvo: 15
      },
      escala: {
        palavras_chaves: 9999,
        texto_seo_blog: 9999,
        funil_busca: 9999,
        pautas_blog: 9999,
        meta_dados: 9999,
        texto_seo_lp: 9999,
        texto_seo_produto: 9999,
        mercado_publico_alvo: 9999
      }
    }[planType] || {
      palavras_chaves: 0,
      texto_seo_blog: 0,
      funil_busca: 0,
      pautas_blog: 0,
      meta_dados: 0,
      texto_seo_lp: 0,
      texto_seo_produto: 0,
      mercado_publico_alvo: 0
    };

    // Atualizar os limites de uso
    const { error: usageError } = await supabaseAdmin
      .from('user_usage')
      .upsert({
        user_id: userId,
        ...limits,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

    if (usageError) {
      console.error(`Erro ao atualizar limites de uso: ${usageError.message}`);
      throw usageError;
    }

    return new Response(JSON.stringify({
      success: true,
      message: "Assinatura ativada com sucesso"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error: any) {
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
