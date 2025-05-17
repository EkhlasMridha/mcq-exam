import type { JwtPayload } from "jwt-decode";

export interface RefreshTokenPayload {
  refreshToken: string;
}
export interface GoogleAuthPayload {
  authToken: string;
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
