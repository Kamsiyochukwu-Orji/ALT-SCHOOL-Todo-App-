import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getMe, login, persistAuthSession, register } from "../api/auth";
import { tokenStorage } from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

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

  const loginWithEmail = async (email, password) => {
    const authResponse = await login({ email, password });
    const nextUser = persistAuthSession(authResponse);
    setUser(nextUser);
    return nextUser;
  };

  const signupWithEmail = async (email, password, name) => {
    const authResponse = await register({ email, password, name });
    const nextUser = persistAuthSession(authResponse);
    setUser(nextUser);
    return nextUser;
  };

  const logout = () => {
    tokenStorage.clearTokens();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoadingAuth,
      loginWithEmail,
      signupWithEmail,
      logout,
    }),
    [user, isLoadingAuth]
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
