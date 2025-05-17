import axios from "axios";
import { APP_ENV } from "constants/app.env";
import { ACESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "constants/common.const";
import { jwtDecode } from "jwt-decode";
import type { AccessTokenData } from "types/auth";
import { refreshAccessToken } from "./auth-service";
import { clearTokens } from "utils/jwt-helpers";

let refreshPromise: Promise<string> | null = null;
export const httpClient = axios.create({
  baseURL: APP_ENV.apiBaseUrl,
});

httpClient.interceptors.request.use(async (config) => {
  const baseURL = config.baseURL ?? "";
  const url = config.url ?? "";
  const base = baseURL.replace(/\/+$/, "");
  const path = url.replace(/^\/+/, "");

  config.url = `${base}/${path}`;
  config.baseURL = undefined;

  let token = localStorage.getItem(ACESS_TOKEN_KEY);
  if (!token) return config;

  const decoded = jwtDecode<AccessTokenData>(token);
  const currentTime = Date.now() / 1000;

  if ((decoded.exp ?? 0) <= currentTime - 5) {
    if (!refreshPromise) {
      refreshPromise = handleRefreshToken().finally(() => {
        refreshPromise = null;
      });
    }

    try {
      token = await refreshPromise;
    } catch (err) {
      clearTokens();
      window.location.href = "/signin";
      return Promise.reject(err);
    }
  }

  config.headers.Authorization = `Bearer ${token}`;

  return config;
});

async function handleRefreshToken(): Promise<string> {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const res = await refreshAccessToken({ refreshToken: refreshToken });

  const { access_token, refresh_token: newRefreshToken } = res;
  localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
  localStorage.setItem(ACESS_TOKEN_KEY, access_token);

  return access_token;
}
