
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export const useProfile = () => {
  const [profile, setProfile] = useState<any | null>(null);

  const fetchProfile = async (userId: string | undefined) => {
    if (!userId) return;
    
    try {
      console.log("Fetching profile for user:", userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error("Error fetching profile:", error);
        if (error.message === "JWT expired") {
          const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
          if (refreshError) {
            console.error("Não foi possível atualizar a sessão:", refreshError);
            return;
          }
          
          if (refreshedSession) {
            const { data: refreshedData, error: fetchError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', userId)
              .single();
              
            if (fetchError) {
              console.error("Erro ao buscar perfil após atualização de sessão:", fetchError);
              return;
            }
            
            setProfile(refreshedData);
            return;
          }
        }
        return;
      }
      
      console.log("Profile data:", data);
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  return { profile, setProfile, fetchProfile };
};
