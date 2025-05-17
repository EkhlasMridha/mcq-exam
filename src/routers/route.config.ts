import { SignIn } from "features/auths/signin";
import { SignUp } from "features/auths/signup";
import { AuthPageLayout } from "layouts";
import { createBrowserRouter } from "react-router";
import { PrivateRoutes } from "./privateroutes";
import App from "App";
import { Dashboard } from "features/dashboard";

export const routes = createBrowserRouter([
  {
    Component: AuthPageLayout,
    children: [
      {
        path: "/signin",
        Component: SignIn,
      },
      {
        path: "signup",
        Component: SignUp,
      },
    ],
  },
  {
    path: "/",
    Component: PrivateRoutes,
    children: [
      {
        index: true,
        Component: Dashboard,
      },
    ],
  },
]);
