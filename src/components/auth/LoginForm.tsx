
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, session } = useAuth();

  // If user is already authenticated, redirect to dashboard
  if (session) {
    console.log("User is already authenticated, redirecting to dashboard");
    navigate('/dashboard');
    return null;
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
      
      await signIn(username, password);
      
      // Don't navigate here - navigation will happen based on the auth state change
      // and is handled in the DashboardLayout component
      
      toast.success("Login realizado com sucesso!");
    } catch (error: any) {
      console.error("Login error details:", {
        message: error.message,
        code: error.code,
        statusCode: error.status,
        details: error
      });
      
      if (error.message?.includes("Invalid login credentials")) {
        toast.error("Credenciais inválidas. Por favor, verifique seu usuário e senha.");
      } else {
        toast.error("Erro ao fazer login: " + (error.message || "Ocorreu um erro inesperado"));
      }
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
