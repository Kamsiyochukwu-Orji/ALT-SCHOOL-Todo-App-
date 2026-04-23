import { createContext,useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getMe, login, persistAuthSession, register } from "../api/auth";
import { tokenStorage } from "../api/client";
import type {AuthContextValue, User} from '../types/auth'
import type{ReactNode} from 'react'

interface AuthProviderProps{
  children:ReactNode;
}
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);

  useEffect(() => {
    const bootstrapSession = async () => {
      const accessToken = tokenStorage.getAccessToken();
      const refreshToken = tokenStorage.getRefreshToken();

      if (!accessToken && !refreshToken) {
        setIsLoadingAuth(false);
        return;
      }

      try {
        const currentUser = await getMe();
        setUser(currentUser);
      } catch (error) {
        tokenStorage.clearTokens();
        setUser(null);
      } finally {
        setIsLoadingAuth(false);
      }
    };

    bootstrapSession();
  }, []);

  const loginWithEmail = useCallback(async(email:string, password:string): Promise<User | null> => {
    const authResponse = await login({ email, password });
    const nextUser = persistAuthSession(authResponse);
    setUser(nextUser);
    return nextUser;
},[])

  const signupWithEmail = useCallback(async (email:string, password:string, name:string):Promise<User | null> => {
    const authResponse = await register({ email, password, name });
    const nextUser = persistAuthSession(authResponse);
    setUser(nextUser);
    return nextUser;
  },[]);

  const logout = useCallback(() => {
    tokenStorage.clearTokens();
    setUser(null);
  },[]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoadingAuth,
      loginWithEmail,
      signupWithEmail,
      logout,
    }),
    [user, isLoadingAuth,loginWithEmail,signupWithEmail,logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
};
