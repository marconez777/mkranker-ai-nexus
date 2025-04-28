
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

    console.log("Tentando login com usuário:", username);

    try {
      await signIn(username, password);
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
              type="text"
              placeholder="Seu nome de usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
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
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
          <Button 
            variant="outline" 
            className="w-full" 
            type="button"
            onClick={() => navigate("/register")}
          >
            Criar Conta
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
