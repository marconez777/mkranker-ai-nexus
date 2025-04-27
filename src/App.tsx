import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import MercadoPublicoAlvoPage from "./pages/MercadoPublicoAlvoPage";
import FunilBuscaPage from "./pages/FunilBuscaPage";
import NotFoundPage from "./pages/NotFoundPage";
import PalavrasChavesPage from "./pages/PalavrasChavesPage";
import TextoSeoLpPage from "./pages/TextoSeoLpPage";
import TextoSeoProdutoPage from "./pages/TextoSeoProdutoPage";
import TextoSeoBlogPage from "./pages/TextoSeoBlogPage";
import MetaDadosPage from "./pages/MetaDadosPage";
import PautasBlogPage from "./pages/PautasBlogPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
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
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
