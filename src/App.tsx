
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { PlanProvider } from "@/contexts/PlanContext";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import HomePage from "@/pages/HomePage";
import RegisterPage from "@/pages/RegisterPage";
import LoginPage from "@/pages/LoginPage";
import NotFound from "@/pages/NotFound";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import DashboardPage from "@/pages/DashboardPage";
import MercadoPublicoAlvoPage from "@/pages/MercadoPublicoAlvoPage";
import PalavrasChavesPage from "@/pages/PalavrasChavesPage";
import FunilBuscaPage from "@/pages/FunilBuscaPage";
import MetaDadosPage from "@/pages/MetaDadosPage";
import TextoSeoBlogPage from "@/pages/TextoSeoBlogPage";
import TextoSeoLpPage from "@/pages/TextoSeoLpPage";
import TextoSeoProdutoPage from "@/pages/TextoSeoProdutoPage";
import PautasBlogPage from "@/pages/PautasBlogPage";
import Index from "@/pages/Index";
import AdminPage from "@/pages/AdminPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <PlanProvider>
              <Routes>
                <Route path="/" element={<Index />}>
                  <Route index element={<HomePage />} />
                  <Route path="login" element={<LoginPage />} />
                  <Route path="register" element={<RegisterPage />} />
                  <Route path="reset-password" element={<ResetPasswordPage />} />
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="mercado-publico-alvo" element={<MercadoPublicoAlvoPage />} />
                  <Route path="palavras-chaves" element={<PalavrasChavesPage />} />
                  <Route path="funil-de-busca" element={<FunilBuscaPage />} />
                  <Route path="meta-dados" element={<MetaDadosPage />} />
                  <Route path="texto-seo-blog" element={<TextoSeoBlogPage />} />
                  <Route path="texto-seo-lp" element={<TextoSeoLpPage />} />
                  <Route path="texto-seo-produto" element={<TextoSeoProdutoPage />} />
                  <Route path="pautas-blog" element={<PautasBlogPage />} />
                  <Route path="admin/login" element={<AdminLoginPage />} />
                  <Route path="admin" element={<AdminPage />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </PlanProvider>
          </AuthProvider>
        </BrowserRouter>
        <Toaster />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
