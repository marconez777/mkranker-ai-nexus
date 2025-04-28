
import { useState, useEffect } from "react";
import { UsersTable } from "@/components/admin/UsersTable";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { UpdateAdminEmailForm } from "@/components/admin/UpdateAdminEmailForm";

export default function AdminPage() {
  const { users, loading, fetchUsers } = useAdminUsers();
  const { user, signOut, isUserAdmin } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        console.log("Nenhum usuário logado, redirecionando para login");
        setIsAdmin(false);
        navigate('/admin-login');
        setCheckingAdmin(false);
        return;
      }

      try {
        console.log("Verificando status de admin na página AdminPage para:", user.id);
        
        // Verificar admin com timeout
        const adminCheckPromise = isUserAdmin(user.id);
        
        // Timeout após 10 segundos
        const timeoutPromise = new Promise<boolean>((resolve) => {
          setTimeout(() => {
            console.log("Timeout na verificação de admin");
            resolve(false);
          }, 10000);
        });
        
        // Corrida entre as promises
        const adminStatus = await Promise.race([adminCheckPromise, timeoutPromise]);
        
        console.log("Resultado da verificação de admin:", adminStatus);
        setIsAdmin(adminStatus);
        
        if (!adminStatus) {
          toast.error("Acesso não autorizado - apenas administradores podem acessar");
          navigate('/');
        } else {
          // Se for admin, buscar os usuários
          fetchUsers();
        }
      } catch (error) {
        console.error("Erro ao verificar status de administrador:", error);
        setIsAdmin(false);
        toast.error("Erro ao verificar permissões de administrador");
        navigate('/');
      } finally {
        setCheckingAdmin(false);
      }
    };
    
    checkAdminStatus();
  }, [user, navigate, fetchUsers, isUserAdmin]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (checkingAdmin || loading || isAdmin === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-2">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will be redirected by useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-xl font-bold text-mkranker-purple">MKRanker - Painel Administrativo</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user?.email}
            </span>
            <Button variant="outline" onClick={handleLogout}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Gerenciamento de Usuários</h2>
              <p className="text-muted-foreground">
                Gerencie os usuários e suas permissões no sistema
              </p>
            </div>
            <Button onClick={fetchUsers}>Atualizar Lista</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 rounded-md border bg-card">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Carregando usuários...</span>
                </div>
              ) : (
                <UsersTable users={users} onUpdate={fetchUsers} />
              )}
            </div>
            <div className="rounded-md border bg-card p-6">
              <UpdateAdminEmailForm />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
