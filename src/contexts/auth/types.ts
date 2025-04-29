
import { Session, User } from '@supabase/supabase-js';
import { Profile } from '@/types/profile';

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  authInitialized: boolean;
  refreshSession: () => Promise<Session | null>;
  signIn: (email: string, password: string, isAdminLogin?: boolean) => Promise<{ user: User | null; session: Session | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ user: User | null; session: Session | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ data: any; error: any }>;
  updatePassword: (newPassword: string) => Promise<{ data: any; error: any }>;
  isUserAdmin: (userId: string) => Promise<boolean>;
}
