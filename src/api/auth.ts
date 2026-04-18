import { apiClient, tokenStorage } from "./client";
import type {LoginPayload,RegisterPayload,AuthResponse,User} from '../types/auth'
export const login = async ({ email, password }: LoginPayload):Promise<AuthResponse> => {
  const { data } = await apiClient.post<AuthResponse>("/auth/login", { email, password });
  return data;
};

export const register = async ({ email, password, name }:RegisterPayload):Promise<AuthResponse> => {
  const { data } = await apiClient.post<AuthResponse>("/auth/register", { email, password, name });
  return data;
};

export const getMe = async (): Promise<User> => {
  const { data } = await apiClient.get<User>("/auth/me");
  return data;
};

export const persistAuthSession = (authResponse:AuthResponse | null) :User | null => {
  tokenStorage.setTokens({
    accessToken: authResponse?.accessToken,
    refreshToken: authResponse?.refreshToken,
  });
  return authResponse?.user ?? null;
};
