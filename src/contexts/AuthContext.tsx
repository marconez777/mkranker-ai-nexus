
import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType } from './auth/types';
import { useProfile } from './auth/useProfile';
import { useAuthOperations } from './auth/useAuthOperations';

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { profile, setProfile, fetchProfile } = useProfile();
  const authOperations = useAuthOperations();

  useEffect(() => {
    let isMounted = true;

    // Inicializar sistema de autenticação com verificação de timeout para evitar bloqueios
    const initializeAuth = async () => {
      try {
        // Configurar listener de autenticação primeiro (importante para ordem de eventos)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, currentSession) => {
            console.log("Auth state changed:", event, currentSession?.user?.email);
            
            if (!isMounted) return;
            
            // Atualizar estados de sessão e usuário
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
            
            // Processar eventos específicos de autenticação
            if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && currentSession?.user?.id) {
              // Buscar perfil do usuário de forma segura usando setTimeout para evitar deadlocks
              setTimeout(() => {
                if (isMounted && currentSession?.user?.id) {
                  fetchProfile(currentSession.user.id);
                }
              }, 0);
            } else if (event === 'SIGNED_OUT') {
              if (isMounted) setProfile(null);
            }
          }
        );
        
        // Então verificar sessão existente com timeout de segurança
        const sessionTimeout = setTimeout(() => {
          if (isMounted) {
            console.warn("Timeout ao obter sessão inicial");
            setLoading(false);
          }
        }, 5000);
        
        // Buscar sessão atual
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        clearTimeout(sessionTimeout);
        
        if (!isMounted) return;
        
        console.log("Existing session check:", currentSession?.user?.email || "No session");
        
        if (!currentSession) {
          setLoading(false);
          return;
        }
        
        // Atualizar estados com a sessão encontrada
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Buscar perfil se usuário estiver autenticado
        if (currentSession?.user) {
          try {
            await fetchProfile(currentSession.user.id);
          } catch (profileError) {
            console.error("Error fetching initial profile:", profileError);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Auth initialization error:", error);
        if (isMounted) setLoading(false);
      }
    };
    
    // Iniciar processo de autenticação
    initializeAuth();
    
    // Limpar recursos ao desmontar componente
    return () => {
      isMounted = false;
    };
  }, [fetchProfile]);

  return (
    <AuthContext.Provider value={{
      session,
      user,
      profile,
      loading,
      ...authOperations
    }}>
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
