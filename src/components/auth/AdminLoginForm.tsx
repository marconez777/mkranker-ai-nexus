
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function AdminLoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!username.trim() || !password.trim()) {
      toast.error("Por favor, preencha todos os campos");
      setIsLoading(false);
      return;
    }

    try {
      // Primeiro faça login com as credenciais fornecidas
      await signIn(username, password);
      
      // Obtenha o usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Erro ao verificar permissões de administrador");
        await supabase.auth.signOut();
        setIsLoading(false);
        return;
      }
      
      // Verifique se o usuário tem função de administrador usando a função RPC is_admin
      const { data: isAdmin, error } = await supabase.rpc('is_admin', { 
        user_id: user.id
      });
      
      if (error) {
        console.error("Erro ao verificar status de administrador:", error);
        toast.error(`Erro ao verificar permissões: ${error.message}`);
        await supabase.auth.signOut();
        setIsLoading(false);
        return;
      }
      
      if (!isAdmin) {
        toast.error("Acesso não autorizado - apenas administradores podem entrar");
        await supabase.auth.signOut();
        setIsLoading(false);
        return;
      }
      
      navigate('/admin');
      toast.success("Login administrativo realizado com sucesso!");
    } catch (error: any) {
      console.error("Erro no login:", error);
      toast.error("Credenciais inválidas ou acesso não autorizado");
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Login Administrativo</CardTitle>
        <CardDescription className="text-center">
          Área restrita - Acesso apenas para administradores
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Usuário</Label>
            <Input
              id="username"
              type="text"
              placeholder="Nome de usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
