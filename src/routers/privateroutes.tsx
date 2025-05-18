import { ACESS_TOKEN_KEY } from "constants/common.const";
import { Outlet, Navigate } from "react-router";

export const PrivateRoutes = () => {
  const hasToken = localStorage.getItem(ACESS_TOKEN_KEY);

  return hasToken ? <Outlet /> : <Navigate to={"/signin"} />;
};
