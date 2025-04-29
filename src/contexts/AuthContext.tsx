
import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType } from './auth/types';
import { useProfile } from './auth/useProfile';
import { useAuthOperations } from './auth/useAuthOperations';
import { toast } from 'sonner';

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  
  const { profile, setProfile, fetchProfile } = useProfile();
  const authOperations = useAuthOperations();

  useEffect(() => {
    let isMounted = true;
    console.log("AuthContext initialization started");

    // Configurar um timeout para garantir que eventualmente marcaremos a auth como inicializada
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        console.log("Timeout de segurança atingido, marcando auth como inicializada");
        setAuthInitialized(true);
        setLoading(false);
      }
    }, 5000);

    // Configurar listener de estado de autenticação PRIMEIRO (antes de verificar sessão)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event);
        
        if (!isMounted) return;
        
        // Atualizar estado de sessão e usuário
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Lidar com eventos de autenticação específicos
        if (event === 'SIGNED_IN' && currentSession?.user) {
          console.log("User signed in:", currentSession.user.email);
          
          // Usar setTimeout para evitar bloqueios potenciais
          setTimeout(() => {
            if (isMounted && currentSession?.user) {
              fetchProfile(currentSession.user.id);
            }
          }, 0);
        } 
        else if (event === 'SIGNED_OUT') {
          console.log("User signed out, clearing profile");
          setProfile(null);
        }
      }
    );
    
    // DEPOIS verificar sessão existente
    const initializeAuth = async () => {
      try {
        console.log("Buscando sessão existente...");
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        // Limpar o timeout assim que obtemos uma resposta
        clearTimeout(timeoutId);
        
        if (!isMounted) return;
        
        if (error) {
          console.error("Error getting session:", error);
          toast.error("Erro ao carregar sessão");
          setAuthInitialized(true);
          setLoading(false);
          return;
        }
        
        console.log("Verificação inicial de sessão:", currentSession?.user?.email || "Nenhuma sessão encontrada");
        
        // Atualizar estado de sessão e usuário
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Buscar perfil se o usuário estiver autenticado
        if (currentSession?.user) {
          try {
            await fetchProfile(currentSession.user.id);
          } catch (profileError) {
            console.error("Erro ao buscar perfil inicial:", profileError);
          }
        }
        
        // Marcar auth como inicializada e completar carregamento
        console.log("Inicialização de autenticação completa");
        setAuthInitialized(true);
        setLoading(false);
      } catch (error) {
        console.error("Erro de inicialização de autenticação:", error);
        if (isMounted) {
          setAuthInitialized(true);
          setLoading(false);
          toast.error("Erro na inicialização da autenticação");
        }
      }
    };
    
    // Inicializar auth imediatamente
    initializeAuth();
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  // Efeito de debug para registrar mudanças de estado
  useEffect(() => {
    console.log("Auth state updated:", { 
      user: user?.email || null, 
      sessionActive: !!session,
      loading, 
      authInitialized,
      profile: profile?.id || null
    });
  }, [user, session, loading, authInitialized, profile]);

  return (
    <AuthContext.Provider value={{
      session,
      user,
      profile,
      loading,
      authInitialized,
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
