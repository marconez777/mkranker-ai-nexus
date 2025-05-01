
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  // Check if there's an error message in the location state (redirected from subscription check)
  const errorMessage = location.state?.message;

  // Display error message if present
  if (errorMessage) {
    setTimeout(() => {
      toast.error(errorMessage);
      // Clear the location state
      navigate(location.pathname, { replace: true, state: {} });
    }, 0);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!username.trim() || !password.trim()) {
      toast.error("Por favor, preencha todos os campos");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Tentando login com usuário:", username);
      
      const result = await signIn(username, password);
      console.log("Resultado do login:", result);
      
      if (!result.user) {
        throw new Error("Erro na autenticação: usuário não encontrado");
      }
      
      toast.success("Login realizado com sucesso!");
      // A navegação será tratada pelo useEffect no LoginPage
      
    } catch (error: any) {
      console.error("Login error:", error);
      
      if (error.message?.includes("Invalid login credentials")) {
        toast.error("Credenciais inválidas. Por favor, verifique seu usuário e senha.");
      } else if (error.message?.includes("pendente de ativação")) {
        toast.error("Conta pendente de ativação pelo administrador. Por favor, aguarde a aprovação.");
      } else if (error.message?.includes("Assinatura inativa ou vencida")) {
        toast.error("Sua assinatura está inativa ou vencida. Renove seu plano para acessar a plataforma.");
      } else {
        toast.error("Erro ao fazer login: " + (error.message || "Ocorreu um erro inesperado"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Login MKRanker</CardTitle>
        <CardDescription className="text-center">
          Entre com suas credenciais para acessar a plataforma
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Usuário</Label>
            <Input
              id="username"
              type="email"
              placeholder="Seu e-mail"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <Button
            type="button"
            variant="link"
            className="p-0 h-auto font-normal"
            onClick={() => navigate("/reset-password")}
          >
            Esqueceu sua senha?
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : "Entrar"}
          </Button>
          <Button 
            variant="outline" 
            className="w-full" 
            type="button"
            onClick={() => navigate("/register")}
            disabled={isLoading}
          >
            Criar Conta
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
