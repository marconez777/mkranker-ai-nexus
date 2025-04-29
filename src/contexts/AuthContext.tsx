
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
  const { isUserAdmin, ...authOperations } = useAuthOperations();

  useEffect(() => {
    // Handle auth changes - this needs to be set up first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.email);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (currentSession?.user?.id) {
            // Use setTimeout to prevent deadlocks with Supabase client
            setTimeout(() => {
              fetchProfile(currentSession.user.id);
            }, 0);
          }
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
        }
      }
    );

    // Then check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log("Existing session check:", currentSession?.user?.email || "No session");
        
        if (!currentSession) {
          setLoading(false);
          return;
        }
        
        try {
          // Always try to refresh the session on initial load
          const { data: { session: refreshedSession }, error } = await supabase.auth.refreshSession();
          
          if (error) {
            console.error("Session refresh error:", error);
            // Clear invalid session
            await supabase.auth.signOut();
            setSession(null);
            setUser(null);
            setProfile(null);
          } else {
            setSession(refreshedSession);
            setUser(refreshedSession?.user ?? null);
            if (refreshedSession?.user) {
              fetchProfile(refreshedSession.user.id);
            }
          }
        } catch (refreshError) {
          console.error("Error refreshing token:", refreshError);
          // Handle refresh failure
          setSession(null);
          setUser(null);
          setProfile(null);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Auth initialization error:", error);
        setLoading(false);
      }
    };
    
    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{
      session,
      user,
      profile,
      loading,
      isUserAdmin,
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
