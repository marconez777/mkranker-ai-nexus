
import { createContext, useContext, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { AuthContextType } from './auth/types';
import { useProfile } from './auth/useProfile';
import { useAuthOperations } from './auth/useAuthOperations';
import { useSessionManager } from './auth/useSessionManager';

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    session, 
    setSession, 
    user, 
    setUser, 
    loading, 
    setLoading, 
    authInitialized, 
    refreshSession 
  } = useSessionManager();
  
  const { profile, setProfile } = useProfile();
  const authOperations = useAuthOperations();

  const signIn = async (email: string, password: string, isAdminLogin = false) => {
    try {
      const result = await authOperations.signIn(email, password, isAdminLogin);
      if (result.session) {
        setSession(result.session);
        setUser(result.session?.user ?? null);
        setLoading(false);
        return { user: result.user, session: result.session };
      }
      return { user: null, session: null };
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authOperations.signOut();
      setProfile(null);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const result = await authOperations.signUp(email, password, fullName);
      return result;
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    return await authOperations.resetPassword(email);
  };
  
  const updatePassword = async (newPassword: string) => {
    return await authOperations.updatePassword(newPassword);
  };

  const isUserAdmin = async (userId: string) => {
    return await authOperations.isUserAdmin(userId);
  };

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
