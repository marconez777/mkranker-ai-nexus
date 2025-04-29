
import { useState, useEffect, useRef } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useSessionManager = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  
  // Controle de cooldown para evitar múltiplos refreshes
  const refreshingRef = useRef(false);
  const lastRefreshRef = useRef(0);
  const MIN_REFRESH_INTERVAL = 10000; // 10 segundos de intervalo mínimo

  const refreshSession = async () => {
    try {
      // Verificar se já está atualizando ou se tentou recentemente
      const now = Date.now();
      if (refreshingRef.current || (now - lastRefreshRef.current < MIN_REFRESH_INTERVAL)) {
        console.log("Ignorando refresh de sessão devido ao cooldown");
        return session;
      }
      
      refreshingRef.current = true;
      console.log("Tentando atualizar sessão...");
      
      // Verificar primeiro se já existe uma sessão válida
      const { data: currentSession } = await supabase.auth.getSession();
      if (currentSession?.session) {
        console.log("Sessão existente encontrada, usando-a");
        setSession(currentSession.session);
        setUser(currentSession.session.user);
        refreshingRef.current = false;
        lastRefreshRef.current = now;
        return currentSession.session;
      }

      // Se não houver sessão, tente refresh
      const { data, error } = await supabase.auth.refreshSession();
      refreshingRef.current = false;
      lastRefreshRef.current = now;
      
      if (error) {
        console.error("Erro ao atualizar sessão:", error);
        throw error;
      }
      
      if (data && data.session) {
        console.log("Sessão atualizada com sucesso");
        setSession(data.session);
        setUser(data.session.user);
        return data.session;
      }
      
      console.log("Não foi possível atualizar sessão - nenhuma sessão válida encontrada");
      return null;
    } catch (error) {
      console.error("Falha ao atualizar sessão:", error);
      refreshingRef.current = false;
      return null;
    }
  };

  useEffect(() => {
    console.log("AuthContext initialization started");
    let isMounted = true;
    
    // Definir um timeout de segurança mais longo
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        console.log("Timeout de segurança atingido, marcando auth como inicializada");
        setAuthInitialized(true);
        setLoading(false);
      }
    }, 5000);

    // Configurar listener de estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event);
        
        if (!isMounted) return;
        
        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
          
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            console.log("User signed in or token refreshed:", currentSession.user?.email);
            setAuthInitialized(true);
            setLoading(false);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log("User signed out, clearing profile");
          setSession(null);
          setUser(null);
          setAuthInitialized(true);
          setLoading(false);
        }
      }
    );
    
    // Verificar sessão existente
    const getInitialSession = async () => {
      try {
        console.log("Buscando sessão existente...");
        
        // Garantir que o localStorage persiste a sessão
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          if (isMounted) {
            setAuthInitialized(true);
            setLoading(false);
            clearTimeout(timeoutId);
          }
          return;
        }
        
        if (isMounted) {
          if (data?.session) {
            setSession(data.session);
            setUser(data.session.user);
            console.log("Session initialized successfully");
          } else {
            console.log("No active session found");
          }
          
          setAuthInitialized(true);
          setLoading(false);
          clearTimeout(timeoutId);
        }
      } catch (error) {
        console.error("Session initialization error:", error);
        if (isMounted) {
          setAuthInitialized(true);
          setLoading(false);
          clearTimeout(timeoutId);
        }
      }
    };
    
    // Executar inicialização
    getInitialSession();
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  return {
    session,
    setSession,
    user,
    setUser,
    loading,
    setLoading,
    authInitialized,
    setAuthInitialized,
    refreshSession
  };
};
