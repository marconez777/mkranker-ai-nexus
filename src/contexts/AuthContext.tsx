import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType } from './auth/types';
import { useProfile } from './auth/useProfile';
import { useAuthOperations } from './auth/useAuthOperations';
import { toast } from 'sonner';

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const { profile, setProfile, fetchProfile } = useProfile();
  const authOperations = useAuthOperations();

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
    } catch (error) {
      console.error("Failed to refresh session:", error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signIn({ email, password });
      if (error) {
        console.error("Error signing in:", error);
        throw error;
      }
      if (data && data.session) {
        setSession(data.session);
        setUser(data.session?.user ?? null);
        setAuthInitialized(true);
        setLoading(false);
        return data.session;
      }
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
        throw error;
      }
      setProfile(null);
      setAuthInitialized(true);
      setLoading(false);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        console.error("Error signing up:", error);
        throw error;
      }
      if (data && data.session) {
        setSession(data.session);
        setUser(data.session?.user ?? null);
        setAuthInitialized(true);
        setLoading(false);
        return data.session;
      }
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        console.error("Error resetting password:", error);
        throw error;
      }
      toast.success('Password reset email sent!');
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  };

  const isAdmin = () => {
    // Implement your logic to check if the user is an admin
    return false;
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
          setProfile(null);
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

  const value = {
    session,
    user: profile,
    isLoading,
    error,
    signIn,
    signOut,
    signUp,
    resetPassword,
    isAdmin,
    refreshSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
