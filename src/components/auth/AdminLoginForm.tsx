
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export function AdminLoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { signIn, isUserAdmin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!username.trim() || !password.trim()) {
      toast.error("Por favor, preencha todos os campos");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Tentando fazer login como admin...");
      
      // Login simples primeiro
      const { user } = await signIn(username, password, true);
      
      if (!user) {
        throw new Error("Credenciais inválidas");
      }
      
      console.log("Login bem-sucedido, verificando permissões de admin para:", user.id);
      
      // Verificar se é admin com um timeout para garantir que não fique preso
      const adminCheckPromise = isUserAdmin(user.id);
      
      // Timeout após 5 segundos
      const timeoutPromise = new Promise<boolean>((resolve) => {
        setTimeout(() => {
          console.log("Timeout na verificação de admin");
          resolve(false);
        }, 5000);
      });
      
      // Corrida entre as promises
      const isAdmin = await Promise.race([adminCheckPromise, timeoutPromise]);
      
      if (!isAdmin) {
        toast.error("Acesso não autorizado - apenas administradores podem entrar");
        setIsLoading(false);
        return;
      }
      
      // Se chegou aqui, é admin
      console.log("Verificação de admin bem-sucedida, redirecionando");
      toast.success("Login administrativo realizado com sucesso!");
      navigate('/admin');
    } catch (error: any) {
      console.error("Erro no login:", error);
      toast.error(error.message || "Credenciais inválidas ou acesso não autorizado");
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
              placeholder="Email de usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
              autoComplete="email"
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
                disabled={isLoading}
                autoComplete="current-password"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={togglePasswordVisibility}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : "Entrar"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
