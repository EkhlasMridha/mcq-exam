import type { JwtPayload } from "jwt-decode";

export interface RefreshTokenPayload {
  refreshToken: string;
}
export interface GoogleAuthPayload {
  code: string;
}

export interface AccessTokenData extends JwtPayload {
  usr: string;
  email: string;
  aut: number;
  iv: string;
  oid?: string | null;
}

export interface TokenResponseData {
  access_token: string;
  refresh_token: string;
}
export interface SigninPayload {
  email: string;
  password: string;
}

export interface UserSignupPayload {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
}
