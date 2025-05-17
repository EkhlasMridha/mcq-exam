import { ACESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "constants/common.const";
import type { TokenResponseData } from "types/auth";

export function clearTokens() {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(ACESS_TOKEN_KEY);
}

export function storeJwtToken(token: TokenResponseData) {
  localStorage.setItem(ACESS_TOKEN_KEY, token.access_token);
  localStorage.setItem(REFRESH_TOKEN_KEY, token.refresh_token);
}
