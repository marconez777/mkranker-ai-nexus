
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export function UpdateAdminEmailForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [newEmail, setNewEmail] = useState("marco_nex7@hotmail.com");

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEmail || !newEmail.includes('@')) {
      toast.error("Por favor, insira um e-mail válido");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Get current user
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw sessionError;
      }
      
      if (!session || !session.user) {
        throw new Error("Usuário não autenticado");
      }
      
      const currentEmail = session.user.email;
      
      // Call the edge function to update the admin email
      const { data, error } = await supabase.functions.invoke("update-admin-email", {
        body: { currentEmail, newEmail },
      });
      
      if (error) {
        throw error;
      }
      
      if (!data.success) {
        throw new Error(data.error || "Falha ao atualizar e-mail do administrador");
      }
      
      toast.success("E-mail do administrador atualizado com sucesso. Por favor faça login novamente.");
      
      // Sign out the user after successful email update
      await supabase.auth.signOut();
      
    } catch (error: any) {
      console.error("Erro ao atualizar e-mail:", error);
      toast.error(`Erro ao atualizar e-mail: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpdateEmail} className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-xl font-bold">Alterar E-mail do Administrador</h2>
        <p className="text-gray-500 text-sm">
          Altere o e-mail da conta de administrador para o e-mail definido.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="newEmail" className="text-sm font-medium">
          Novo E-mail
        </label>
        <Input
          id="newEmail"
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="novo-email@exemplo.com"
          disabled={isLoading}
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Atualizando...
          </>
        ) : (
          "Atualizar E-mail"
        )}
      </Button>
    </form>
  );
}
