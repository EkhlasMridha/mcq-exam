import { ACESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "constants/common.const";

export function clearTokens() {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(ACESS_TOKEN_KEY);
}
