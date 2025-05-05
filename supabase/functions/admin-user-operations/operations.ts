
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.25.0';

export interface OperationResult {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * Validates target user existence
 * @param supabaseAdmin Supabase admin client
 * @param userId ID of the user to validate
 * @returns The user data
 */
export async function validateTargetUser(supabaseAdmin: ReturnType<typeof createClient>, userId: string) {
  const { data: targetUser, error: targetError } = await supabaseAdmin.auth.admin.getUserById(userId);
  if (targetError || !targetUser) {
    throw new Error('Usuário não encontrado');
  }
  return targetUser;
}

/**
 * Deletes a user
 * @param supabaseAdmin Supabase admin client
 * @param userId ID of the user to delete
 * @param currentUserId ID of the current admin user
 * @returns Operation result
 */
export async function deleteUser(
  supabaseAdmin: ReturnType<typeof createClient>, 
  userId: string,
  currentUserId: string
): Promise<OperationResult> {
  console.log(`Tentando excluir usuário ${userId} (solicitado por admin ${currentUserId})`);
  
  // Check if the user is trying to delete their own account
  if (userId === currentUserId) {
    return {
      success: false,
      message: 'Você não pode excluir sua própria conta'
    };
  }
  
  try {
    // Validate target user
    await validateTargetUser(supabaseAdmin, userId);
    
    // Delete related data first
    console.log(`Excluindo dados relacionados para o usuário ${userId}`);
    
    // Delete from profiles
    const { error: profilesError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId);
    
    if (profilesError) {
      console.error(`Erro ao excluir perfil: ${profilesError.message}`);
    }
    
    // Delete from user_subscription
    const { error: subscriptionError } = await supabaseAdmin
      .from('user_subscription')
      .delete()
      .eq('user_id', userId);
    
    if (subscriptionError) {
      console.error(`Erro ao excluir assinatura: ${subscriptionError.message}`);
    }
    
    // Delete from user_usage
    const { error: usageError } = await supabaseAdmin
      .from('user_usage')
      .delete()
      .eq('user_id', userId);
    
    if (usageError) {
      console.error(`Erro ao excluir dados de uso: ${usageError.message}`);
    }
    
    // Delete from user_roles
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .delete()
      .eq('user_id', userId);
    
    if (roleError) {
      console.error(`Erro ao excluir papéis: ${roleError.message}`);
    }
    
    // Finally delete the user from auth
    console.log(`Excluindo usuário ${userId} do sistema de autenticação`);
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    
    if (error) {
      throw error;
    }
    
    return {
      success: true,
      message: 'Usuário excluído com sucesso',
    };
  } catch (error) {
    console.error(`Erro ao excluir usuário: ${error.message}`);
    return {
      success: false,
      message: `Erro ao excluir usuário: ${error.message}`
    };
  }
}

/**
 * Toggles a user's active status
 * @param supabaseAdmin Supabase admin client
 * @param userId ID of the user to toggle
 * @param isActive New active status
 * @returns Operation result
 */
export async function toggleUserActive(
  supabaseAdmin: ReturnType<typeof createClient>, 
  userId: string,
  isActive: boolean
): Promise<OperationResult> {
  // Validate target user
  await validateTargetUser(supabaseAdmin, userId);
  
  // Check current is_active value
  const { data: currentProfile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('is_active')
    .eq('id', userId)
    .single();
    
  if (profileError) {
    throw new Error('Erro ao buscar perfil do usuário');
  }
  
  // If the current status is the same as requested, return without making changes
  if (currentProfile.is_active === isActive) {
    return {
      success: false,
      message: 'O status do usuário já está como solicitado'
    };
  }
  
  const result = await supabaseAdmin
    .from('profiles')
    .update({ is_active: isActive })
    .eq('id', userId);
    
  if (result.error) {
    throw result.error;
  }
    
  return {
    success: true,
    message: isActive ? 'Usuário ativado com sucesso' : 'Usuário desativado com sucesso',
    data: result.data
  };
}

/**
 * Manually activates a user's subscription
 * @param supabaseAdmin Supabase admin client
 * @param userId ID of the user to update
 * @param planType Type of plan to activate (solo, discovery, escala)
 * @param vencimento Date when the subscription expires
 * @returns Operation result
 */
export async function manualActivateSubscription(
  supabaseAdmin: ReturnType<typeof createClient>, 
  userId: string,
  planType: string = "solo",
  vencimento: string = ""
): Promise<OperationResult> {
  // Validate target user
  await validateTargetUser(supabaseAdmin, userId);
  
  // Get plan based on planType
  let planQuery = supabaseAdmin
    .from('plans')
    .select('id')
    .eq('is_active', true);
    
  // Filter by name if provided
  if (planType) {
    planQuery = planQuery.eq('name', planType);
  }
  
  const { data: plan, error: planError } = await planQuery.limit(1).single();
    
  if (planError || !plan) {
    return {
      success: false,
      message: `Plano "${planType}" não encontrado ou inativo.`
    };
  }
  
  // Use provided vencimento or calculate based on current date + 30 days
  let expirationDate = vencimento;
  if (!expirationDate) {
    const now = new Date();
    const expireDate = new Date(now.setDate(now.getDate() + 30));
    expirationDate = expireDate.toISOString().split('T')[0];
  }
  
  // Update profile to set is_active and plan_type
  await supabaseAdmin
    .from('profiles')
    .update({ 
      is_active: true,
      plan_type: planType
    })
    .eq('id', userId);
    
  // Create or update user subscription
  await supabaseAdmin
    .from('user_subscription')
    .upsert({
      user_id: userId,
      plan_id: plan.id,
      status: 'ativo',
      vencimento: expirationDate,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });
  
  return {
    success: true,
    message: `Assinatura do plano "${planType}" ativada manualmente com sucesso`,
    data: { vencimento: expirationDate, planType }
  };
}
