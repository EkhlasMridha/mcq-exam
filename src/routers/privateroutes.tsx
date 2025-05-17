import { Outlet, Navigate } from "react-router";

export const PrivateRoutes = () => {
  const hasToken = localStorage.getItem("token");

  return hasToken ? <Outlet /> : <Navigate to={"/signin"} />;
};
