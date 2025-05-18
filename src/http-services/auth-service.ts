import type {
  GoogleAuthPayload,
  RefreshTokenPayload,
  SigninPayload,
  TokenResponseData,
  UserSignupPayload,
} from "types/auth";
import { axiosRequest } from "./http-setup";

export function oAuthSignin(
  payload: GoogleAuthPayload,
  abortController?: AbortController
) {
  return axiosRequest<TokenResponseData>({
    url: "/auth/google-oauth",
    method: "POST",
    data: payload,
    signal: abortController?.signal,
  }).then((res) => res?.data);
}

export function refreshAccessToken(
  payload: RefreshTokenPayload,
  abortController?: AbortController
) {
  return axiosRequest<TokenResponseData>({
    url: "/auth/refresh",
    method: "POST",
    data: payload,
    signal: abortController?.signal,
  }).then((res) => res?.data);
}

export function passwordSignin(
  payload: SigninPayload,
  abortController?: AbortController
) {
  return axiosRequest<TokenResponseData>({
    url: "/auth/signin",
    method: "POST",
    data: payload,
    signal: abortController?.signal,
  }).then((res) => res?.data);
}

export function signupUser(payload: UserSignupPayload) {
  return axiosRequest({
    url: "/auth/signup",
    method: "POST",
    data: payload,
  });
}
