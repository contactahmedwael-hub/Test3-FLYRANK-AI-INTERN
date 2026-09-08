import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { subscribeToAuthChanges, type AuthUser } from '../pages/Auth/AuthModel';

interface AuthContextValue {
  currentUser: AuthUser | null;
  /** True once Firebase has reported the initial auth state (avoids a
   * flash of "logged out" UI before the SDK has had a chance to check). */
  authChecked: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      setCurrentUser(user);
      setAuthChecked(true);
    });
    return unsubscribe;
  }, []);

  return <AuthContext.Provider value={{ currentUser, authChecked }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}