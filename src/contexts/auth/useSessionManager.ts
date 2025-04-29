
import { useState, useEffect, useRef } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useSessionManager = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  
  // Control cooldown to prevent multiple refreshes
  const refreshingRef = useRef(false);
  const lastRefreshRef = useRef(0);
  const MIN_REFRESH_INTERVAL = 30000; // Increase to 30 seconds to prevent rate limiting
  const MAX_REFRESH_RETRIES = 3;
  const retryCountRef = useRef(0);

  const refreshSession = async () => {
    try {
      // Check if already refreshing or tried recently
      const now = Date.now();
      if (refreshingRef.current || (now - lastRefreshRef.current < MIN_REFRESH_INTERVAL)) {
        console.log("Ignoring session refresh due to cooldown");
        return session;
      }
      
      refreshingRef.current = true;
      console.log("Attempting to refresh session...");
      
      // Check first if a valid session already exists
      const { data: currentSession } = await supabase.auth.getSession();
      if (currentSession?.session) {
        console.log("Existing session found, using it");
        setSession(currentSession.session);
        setUser(currentSession.session.user);
        refreshingRef.current = false;
        lastRefreshRef.current = now;
        retryCountRef.current = 0; // Reset retry counter on success
        return currentSession.session;
      }

      // If no session, try refresh
      const { data, error } = await supabase.auth.refreshSession();
      refreshingRef.current = false;
      lastRefreshRef.current = now;
      
      if (error) {
        console.error("Error refreshing session:", error);
        retryCountRef.current++; // Increment retry counter
        
        // If we've tried too many times, sign out to reset state
        if (retryCountRef.current > MAX_REFRESH_RETRIES) {
          console.warn("Max refresh retries reached, signing out");
          await supabase.auth.signOut();
          setSession(null);
          setUser(null);
          retryCountRef.current = 0;
        }
        
        throw error;
      }
      
      if (data && data.session) {
        console.log("Session refreshed successfully");
        setSession(data.session);
        setUser(data.session.user);
        retryCountRef.current = 0; // Reset retry counter on success
        return data.session;
      }
      
      console.log("Could not refresh session - no valid session found");
      return null;
    } catch (error) {
      console.error("Failed to refresh session:", error);
      refreshingRef.current = false;
      return null;
    }
  };

  useEffect(() => {
    console.log("AuthContext initialization started");
    let isMounted = true;
    
    // Set a longer safety timeout
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        console.log("Safety timeout reached, marking auth as initialized");
        setAuthInitialized(true);
        setLoading(false);
      }
    }, 8000); // Increased to 8 seconds for better reliability

    // Set up auth state listener
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
    
    // Check for existing session
    const getInitialSession = async () => {
      try {
        console.log("Fetching existing session...");
        
        // Ensure localStorage persists the session
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
    
    // Run initialization
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
