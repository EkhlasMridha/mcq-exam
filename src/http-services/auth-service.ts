import type {
  GoogleAuthPayload,
  RefreshTokenPayload,
  SigninPayload,
  TokenResponseData,
} from "types/auth";
import { httpClient } from "./http-setup";
import axios from "axios";

export function oAuthSignin(
  payload: GoogleAuthPayload,
  abortController?: AbortController
) {
  return httpClient
    .post<TokenResponseData>("/auth/google-oauth", payload, {
      signal: abortController?.signal,
    })
    .then((res) => res?.data);
}

export function refreshAccessToken(
  payload: RefreshTokenPayload,
  abortController?: AbortController
) {
  return axios
    .post<TokenResponseData>("/auth/refresh", payload, {
      signal: abortController?.signal,
    })
    .then((res) => res?.data);
}

export function passwordSignin(
  payload: SigninPayload,
  abortController?: AbortController
) {
  return axios
    .post<TokenResponseData>("/auth/signin", payload, {
      signal: abortController?.signal,
    })
    .then((res) => res?.data);
}
