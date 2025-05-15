import { SignIn } from "features/auths/signin.tsx";
import { AuthPageLayout } from "layouts/index.ts";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./styles/index.css";
import { SignUp } from "features/auths/signup";

const routes = createBrowserRouter([
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
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={routes} />
  </StrictMode>
);
