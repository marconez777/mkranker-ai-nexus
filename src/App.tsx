
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

import Index from "@/pages/Index";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import AdminPage from "@/pages/AdminPage";
import NotFoundPage from "@/pages/NotFoundPage";
import DashboardPage from "@/pages/DashboardPage";
import MercadoPublicoAlvoPage from "@/pages/MercadoPublicoAlvoPage";
import FunilBuscaPage from "@/pages/FunilBuscaPage";
import PalavrasChavesPage from "@/pages/PalavrasChavesPage";
import TextoSeoLpPage from "@/pages/TextoSeoLpPage";
import TextoSeoProdutoPage from "@/pages/TextoSeoProdutoPage";
import TextoSeoBlogPage from "@/pages/TextoSeoBlogPage";
import PautasBlogPage from "@/pages/PautasBlogPage";
import MetaDadosPage from "@/pages/MetaDadosPage";

import { AuthProvider } from "@/contexts/AuthContext";
import { PlanProvider } from "@/contexts/PlanContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PlanProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/admin-login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/mercado-publico-alvo" element={<MercadoPublicoAlvoPage />} />
            <Route path="/funil-de-busca" element={<FunilBuscaPage />} />
            <Route path="/palavras-chaves" element={<PalavrasChavesPage />} />
            <Route path="/texto-seo-lp" element={<TextoSeoLpPage />} />
            <Route path="/texto-seo-produto" element={<TextoSeoProdutoPage />} />
            <Route path="/texto-seo-blog" element={<TextoSeoBlogPage />} />
            <Route path="/pautas-blog" element={<PautasBlogPage />} />
            <Route path="/meta-dados" element={<MetaDadosPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Toaster />
        </PlanProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
