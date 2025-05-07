
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetches or creates user profile
 */
export const fetchOrCreateUserProfile = async (userId: string) => {
  try {
    // Fetch profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error("Error fetching profile:", profileError);
      throw profileError;
    }

    // Create profile if it doesn't exist
    if (!profileData) {
      console.log("Profile not found. Creating new one for:", userId);
      const { error: createProfileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          is_active: true,
          plan_type: 'free'
        });
        
      if (createProfileError) {
        console.error("Error creating profile:", createProfileError);
      }
    }
    
    return profileData;
  } catch (error) {
    console.error("Error in fetchOrCreateUserProfile:", error);
    throw error;
  }
};
