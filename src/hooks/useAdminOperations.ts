
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function useAdminOperations(onUpdateCallback: () => void) {
  const [loading, setLoading] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'delete' | 'role' | 'subscription'>('role');

  const callAdminFunction = async (operation: string, userId: string, data: any = {}) => {
    try {
      const { data: result, error } = await supabase.functions.invoke('admin-user-operations', {
        body: { operation, userId, data },
      });

      if (error) {
        console.error(`Erro na operação ${operation}:`, error);
        throw error;
      }

      return result;
    } catch (error: any) {
      console.error(`Falha ao chamar função admin (${operation}):`, error);
      throw new Error(error.message || 'Erro ao processar solicitação');
    }
  };

  const handleRoleToggle = async (userId: string, currentRole: 'admin' | 'user') => {
    try {
      setActionType('role');
      setLoading(userId);
      const newRole = currentRole === 'admin' ? 'user' : 'admin';
      
      console.log("Atualizando papel do usuário:", userId, "de", currentRole, "para", newRole);
      
      const result = await callAdminFunction('toggle_role', userId, { role: newRole });
      
      if (!result || result.success === false) {
        throw new Error(result?.message || "Falha ao atualizar papel do usuário");
      }
      
      toast.success(result.message || "Papel do usuário atualizado com sucesso");
      onUpdateCallback();
      return true;
    } catch (error: any) {
      console.error("Erro ao atualizar papel:", error);
      toast.error(`Erro ao atualizar papel: ${error.message}`);
      return false;
    } finally {
      setLoading(null);
    }
  };

  const handleActivateSubscription = async (userId: string): Promise<boolean> => {
    try {
      setActionType('subscription');
      setLoading(userId);
      
      console.log("Ativando assinatura para o usuário:", userId);
      
      const result = await callAdminFunction('manual_activate_subscription', userId);
      
      if (!result || result.success === false) {
        throw new Error(result?.message || "Falha ao ativar assinatura");
      }
      
      toast.success(result.message || "Assinatura ativada com sucesso");
      onUpdateCallback();
      return true;
    } catch (error: any) {
      console.error("Erro ao ativar assinatura:", error);
      toast.error(`Erro ao ativar assinatura: ${error.message}`);
      return false;
    } finally {
      setLoading(null);
    }
  };

  const handleDeleteUser = async (userId: string): Promise<boolean> => {
    try {
      setActionType('delete');
      setLoading(userId);
      
      console.log("Excluindo usuário:", userId);
      
      const result = await callAdminFunction('delete', userId);
      
      if (!result || result.success === false) {
        throw new Error(result?.message || "Falha ao excluir usuário");
      }
      
      toast.success(result.message || "Usuário excluído com sucesso");
      onUpdateCallback();
      return true;
    } catch (error: any) {
      console.error("Erro ao excluir usuário:", error);
      toast.error(`Erro ao excluir usuário: ${error.message}`);
      return false;
    } finally {
      setLoading(null);
    }
  };

  return {
    loading,
    actionType,
    handleRoleToggle,
    handleActivateSubscription,
    handleDeleteUser
  };
}
