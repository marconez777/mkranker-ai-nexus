import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

import Index from "@/pages/Index";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
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
import AdminLoginPage from "@/pages/AdminLoginPage";
import AdminPage from "@/pages/AdminPage";
import CheckoutPage from "@/pages/CheckoutPage";
import CheckoutSuccessPage from "@/pages/CheckoutSuccessPage";

import { AuthProvider } from "@/contexts/AuthContext";
import { PlanProvider } from "@/contexts/PlanContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePlan } from "@/contexts/PlanContext";

import "./App.css";

const queryClient = new QueryClient();

// Protected route component that checks for authentication only
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, authInitialized } = useAuth();
  const location = useLocation();

  // Show nothing while initializing to avoid flashes
  if (!authInitialized) {
    return null;
  }

  // Redirect only if no session (no login)
  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Allow access to any authenticated user
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
      <Route path="/admin-login" element={<AdminLoginPage />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/mercado-publico-alvo" element={<ProtectedRoute><MercadoPublicoAlvoPage /></ProtectedRoute>} />
      <Route path="/funil-de-busca" element={<ProtectedRoute><FunilBuscaPage /></ProtectedRoute>} />
      <Route path="/palavras-chaves" element={<ProtectedRoute><PalavrasChavesPage /></ProtectedRoute>} />
      <Route path="/texto-seo-lp" element={<ProtectedRoute><TextoSeoLpPage /></ProtectedRoute>} />
      <Route path="/texto-seo-produto" element={<ProtectedRoute><TextoSeoProdutoPage /></ProtectedRoute>} />
      <Route path="/texto-seo-blog" element={<ProtectedRoute><TextoSeoBlogPage /></ProtectedRoute>} />
      <Route path="/pautas-blog" element={<ProtectedRoute><PautasBlogPage /></ProtectedRoute>} />
      <Route path="/meta-dados" element={<ProtectedRoute><MetaDadosPage /></ProtectedRoute>} />
      
      {/* Admin route - has its own auth check */}
      <Route path="/admin" element={<AdminPage />} />
      
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PlanProvider>
          <AppRoutes />
          <Toaster />
        </PlanProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
