import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PlanType } from "@/types/plans";

export function useAdminOperations(onUpdateCallback: () => void) {
  const [loading, setLoading] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'delete' | 'subscription'>('subscription');

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

  const handleActivateSubscription = async (userId: string, planType: PlanType = "solo", vencimento: string = ""): Promise<boolean> => {
    try {
      setActionType('subscription');
      setLoading(userId);

      console.log("Ativando assinatura para o usuário:", userId, "plano:", planType, "vencimento:", vencimento);

      // ✅ Correção: chamar 'admin-user-operations' com operation: 'manual_activate_subscription'
      const result = await callAdminFunction('manual_activate_subscription', userId, {
        planType,
        vencimento
      });

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
    handleActivateSubscription,
    handleDeleteUser
  };
}
