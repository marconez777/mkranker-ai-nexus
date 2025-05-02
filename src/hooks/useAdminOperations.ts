
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function useAdminOperations(onUpdateCallback: () => void) {
  const [loading, setLoading] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'delete' | 'toggle' | 'role' | 'subscription'>('role');

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
      
      toast.success(result.message || "Papel do usuário atualizado com sucesso");
      return true;
    } catch (error: any) {
      console.error("Erro ao atualizar papel:", error);
      toast.error(`Erro ao atualizar papel: ${error.message}`);
      return false;
    } finally {
      setLoading(null);
      onUpdateCallback();
    }
  };

  const handleActivateSubscription = async (userId: string): Promise<boolean> => {
    try {
      setActionType('subscription');
      setLoading(userId);
      
      console.log("Ativando assinatura para o usuário:", userId);
      
      const result = await callAdminFunction('manual_activate_subscription', userId);
      
      if (result.success) {
        toast.success(result.message || "Assinatura ativada com sucesso");
        return true;
      } else {
        toast.error(result.message || "Erro ao ativar assinatura");
        return false;
      }
    } catch (error: any) {
      console.error("Erro ao ativar assinatura:", error);
      toast.error(`Erro ao ativar assinatura: ${error.message}`);
      return false;
    } finally {
      setLoading(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      setActionType('delete');
      setLoading(userId);
      
      const result = await callAdminFunction('delete', userId);
      
      toast.success(result.message || "Usuário excluído com sucesso");
      return true;
    } catch (error: any) {
      toast.error(`Erro ao excluir usuário: ${error.message}`);
      return false;
    } finally {
      setLoading(null);
      onUpdateCallback();
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
