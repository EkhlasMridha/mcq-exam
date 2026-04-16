import { ACESS_TOKEN_KEY } from "constants/common.const";
import { AdminLayout } from "layouts";
import { Navigate } from "react-router";

export const PrivateRoutes = () => {
  const hasToken = localStorage.getItem(ACESS_TOKEN_KEY);

  return hasToken ? <AdminLayout /> : <Navigate to={"/signin"} />;
};
