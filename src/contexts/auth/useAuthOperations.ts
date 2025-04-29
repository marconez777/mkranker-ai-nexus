
import { useNavigate } from 'react-router-dom';
import { signIn } from './operations/authSignIn';
import { signUp } from './operations/authSignUp';
import { signOut as signOutOperation } from './operations/authSignOut';
import { resetPassword, updatePassword } from './operations/authPasswordReset';
import { isUserAdmin } from './operations/authRoleChecks';

export const useAuthOperations = () => {
  const navigate = useNavigate();

  return {
    signIn,
    signUp,
    signOut: () => signOutOperation(navigate),
    resetPassword,
    updatePassword: (newPassword: string) => updatePassword(newPassword, navigate),
    isUserAdmin
  };
};

// Export the standalone function for use outside of components
export { isUserAdmin } from './operations/authRoleChecks';
