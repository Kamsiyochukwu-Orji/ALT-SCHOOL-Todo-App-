import axios from "axios";
import type {Tokens, RefreshResponse} from '../types/auth'
const API_BASE_URL = "https://api.oluwasetemi.dev";
const ACCESS_TOKEN_KEY = "altodo_access_token";
const REFRESH_TOKEN_KEY = "altodo_refresh_token";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let activeRefreshPromise: Promise<string> | null = null;

export const tokenStorage = {
  getAccessToken: () => window.localStorage.getItem(ACCESS_TOKEN_KEY),
  getRefreshToken: () => window.localStorage.getItem(REFRESH_TOKEN_KEY),
  setTokens: ({ accessToken, refreshToken }: Tokens): void => {
    if (accessToken) {
      window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    }
    if (refreshToken) {
      window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  },
  clearTokens: () => {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    delete apiClient.defaults.headers.common.Authorization;
  },
};

const initialAccessToken = tokenStorage.getAccessToken();
if (initialAccessToken) {
  apiClient.defaults.headers.common.Authorization = `Bearer ${initialAccessToken}`;
}

const refreshAccessToken = async () => {
  if (activeRefreshPromise) {
    return activeRefreshPromise;
  }

  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) {
    throw new Error("Missing refresh token");
  }

  activeRefreshPromise = axios
    .post<RefreshResponse>(`${API_BASE_URL}/auth/refresh`, { refreshToken })
    .then((response) => {
      const nextTokens = response.data
      tokenStorage.setTokens(nextTokens);
      return nextTokens.accessToken;
    })
    .finally(() => {
      activeRefreshPromise = null;
    });

  return activeRefreshPromise;
};

apiClient.interceptors.request.use((config) => {
  const accessToken = tokenStorage.getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const originalRequest = error?.config;

    if (status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes("/auth/login") || originalRequest.url?.includes("/auth/register")) {
      return Promise.reject(error);
    }

    try {
      originalRequest._retry = true;
      const newAccessToken = await refreshAccessToken();
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      tokenStorage.clearTokens();
      return Promise.reject(refreshError);
    }
  }
);
