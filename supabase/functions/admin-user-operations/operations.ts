
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
  // Check if the user is trying to delete their own account
  if (userId === currentUserId) {
    return {
      success: false,
      message: 'Você não pode excluir sua própria conta'
    };
  }
  
  // Validate target user
  await validateTargetUser(supabaseAdmin, userId);
  
  const result = await supabaseAdmin.auth.admin.deleteUser(userId);
  
  if (result.error) {
    throw result.error;
  }
  
  return {
    success: true,
    message: 'Usuário excluído com sucesso',
    data: result.data
  };
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
 * Toggles a user's role
 * @param supabaseAdmin Supabase admin client
 * @param userId ID of the user to update
 * @param newRole New role value
 * @returns Operation result
 */
export async function toggleUserRole(
  supabaseAdmin: ReturnType<typeof createClient>, 
  userId: string,
  newRole: string
): Promise<OperationResult> {
  // Validate target user
  await validateTargetUser(supabaseAdmin, userId);
  
  // Check current role
  const { data: currentUserRole, error: roleError } = await supabaseAdmin
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single();
    
  if (roleError && roleError.code !== 'PGRST116') {
    // PGRST116 is the code when no record is found
    throw new Error('Erro ao buscar papel do usuário');
  }
  
  // If current role is the same as requested, return without making changes
  if (currentUserRole && currentUserRole.role === newRole) {
    return {
      success: false,
      message: 'Usuário já possui este papel'
    };
  }
  
  let result;
  
  // If no record exists, insert a new one, otherwise update
  if (!currentUserRole) {
    result = await supabaseAdmin
      .from('user_roles')
      .insert({ user_id: userId, role: newRole });
  } else {
    result = await supabaseAdmin
      .from('user_roles')
      .update({ role: newRole })
      .eq('user_id', userId);
  }
  
  if (result.error) {
    throw result.error;
  }
  
  return {
    success: true,
    message: newRole === 'admin'
      ? 'Usuário promovido para admin com sucesso'
      : 'Permissões de usuário atualizadas com sucesso',
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
