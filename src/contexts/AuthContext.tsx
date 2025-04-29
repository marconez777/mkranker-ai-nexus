
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
      return null;
    } catch (error) {
      console.error("Failed to refresh session:", error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error("Error signing in:", error);
        throw error;
      }
      if (data && data.session) {
        setSession(data.session);
        setUser(data.session?.user ?? null);
        setAuthInitialized(true);
        setLoading(false);
        return { user: data.user, session: data.session };
      }
      return { user: null, session: null };
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

  const signUp = async (email: string, password: string, fullName: string) => {
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
        return { user: data.user, session: data.session };
      }
      return { user: null, session: null };
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
      return { data: true, error: null };
    } catch (error) {
      console.error("Error resetting password:", error);
      return { data: null, error };
    }
  };
  
  const updatePassword = async (newPassword: string) => {
    try {
      const { data, error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        console.error("Error updating password:", error);
        throw error;
      }
      toast.success('Password updated successfully!');
      return { data, error: null };
    } catch (error) {
      console.error("Error updating password:", error);
      return { data: null, error };
    }
  };

  const isUserAdmin = async (userId: string) => {
    return await authOperations.isUserAdmin(userId);
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

  const value: AuthContextType = {
    session,
    user,
    profile,
    loading,
    authInitialized,
    signIn,
    signOut,
    signUp,
    resetPassword,
    updatePassword,
    isUserAdmin,
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
