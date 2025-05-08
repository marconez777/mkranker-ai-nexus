
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PlanType } from "@/types/plans";

export function useAdminOperations(onUpdateCallback: () => void) {
  const [loading, setLoading] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'delete' | 'subscription'>('subscription');

  const handleActivateSubscription = async (userId: string, planType: PlanType, vencimento: string): Promise<boolean> => {
    try {
      setActionType('subscription');
      setLoading(userId);

      console.log("Ativando assinatura para o usuário:", userId, "plano:", planType, "vencimento:", vencimento);

      // Call the new edge function for activating subscriptions
      const { data, error } = await supabase.functions.invoke('manual-activate-plan', {
        body: { userId, planType, vencimento }
      });

      if (error) {
        console.error("Erro na função manual-activate-plan:", error);
        throw new Error(error.message || "Falha ao ativar assinatura");
      }

      if (!data || !data.success) {
        throw new Error(data?.error || "Falha ao ativar assinatura");
      }

      toast.success("Assinatura ativada com sucesso");
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

      const { data: result, error } = await supabase.functions.invoke('admin-user-operations', {
        body: { operation: 'delete', userId },
      });

      if (error || !result || result.success === false) {
        throw new Error(error?.message || result?.message || "Falha ao excluir usuário");
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
