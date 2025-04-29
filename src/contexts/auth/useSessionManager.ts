
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useSessionManager = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  const refreshSession = async () => {
    try {
      // Try to refresh the session
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error("Error refreshing session:", error);
        throw error;
      }
      if (data && data.session) {
        setSession(data.session);
        return data.session;
      }
      return null;
    } catch (error) {
      console.error("Failed to refresh session:", error);
      throw error;
    }
  };

  useEffect(() => {
    console.log("AuthContext initialization started");
    let isMounted = true;

    // Definir um timeout para garantir que eventualmente marcamos a auth como inicializada
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        console.log("Timeout de segurança atingido, marcando auth como inicializada");
        setAuthInitialized(true);
        setLoading(false);
      }
    }, 3000);

    // Configurar listener de estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event);
        
        if (!isMounted) return;
        
        // Atualizar estado de sessão e usuário
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          console.log("User signed in or token refreshed:", currentSession?.user?.email);
          setAuthInitialized(true);
          setLoading(false);
        } 
        else if (event === 'SIGNED_OUT') {
          console.log("User signed out, clearing profile");
          setAuthInitialized(true);
          setLoading(false);
        }
      }
    );
    
    // Verificar sessão existente
    const getInitialSession = async () => {
      try {
        console.log("Buscando sessão existente...");
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
          setSession(data.session);
          setUser(data.session?.user ?? null);
          setAuthInitialized(true);
          setLoading(false);
          clearTimeout(timeoutId);
          
          console.log("Session initialized:", !!data.session);
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
