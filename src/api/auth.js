import { apiClient, tokenStorage } from "./client";

export const login = async ({ email, password }) => {
  const { data } = await apiClient.post("/auth/login", { email, password });
  return data;
};

export const register = async ({ email, password, name }) => {
  const { data } = await apiClient.post("/auth/register", { email, password, name });
  return data;
};

export const getMe = async () => {
  const { data } = await apiClient.get("/auth/me");
  return data;
};

export const persistAuthSession = (authResponse) => {
  tokenStorage.setTokens({
    accessToken: authResponse?.accessToken,
    refreshToken: authResponse?.refreshToken,
  });
  return authResponse?.user ?? null;
};
