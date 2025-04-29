
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

    // Set up auth state listener FIRST (before checking session)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event);
        
        if (!isMounted) return;
        
        // Update session and user state
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Handle specific auth events
        if (event === 'SIGNED_IN' && currentSession?.user) {
          console.log("User signed in:", currentSession.user.email);
          
          // Use setTimeout to avoid potential deadlocks
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
    
    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        // Set a short timeout to ensure we eventually mark auth as initialized
        const initTimeout = setTimeout(() => {
          if (isMounted && !authInitialized) {
            console.log("Auth initialization timed out, marking as initialized anyway");
            setAuthInitialized(true);
            setLoading(false);
          }
        }, 3000);
        
        console.log("Buscando sessão existente...");
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        // Clear the timeout as we got a response
        clearTimeout(initTimeout);
        
        if (!isMounted) return;
        
        if (error) {
          console.error("Error getting session:", error);
          toast.error("Erro ao carregar sessão");
          setAuthInitialized(true);
          setLoading(false);
          return;
        }
        
        console.log("Initial session check:", currentSession?.user?.email || "No session found");
        
        // Update session and user state
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Fetch profile if user is authenticated
        if (currentSession?.user) {
          try {
            await fetchProfile(currentSession.user.id);
          } catch (profileError) {
            console.error("Error fetching initial profile:", profileError);
          }
        }
        
        // Mark auth as initialized and complete loading
        console.log("Auth initialization complete");
        setAuthInitialized(true);
        setLoading(false);
      } catch (error) {
        console.error("Auth initialization error:", error);
        if (isMounted) {
          setAuthInitialized(true);
          setLoading(false);
          toast.error("Erro na inicialização da autenticação");
        }
      }
    };
    
    // Initialize auth immediately
    initializeAuth();
    
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  // Debug effect to log state changes
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
