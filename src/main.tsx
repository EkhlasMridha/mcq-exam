import { SignIn } from "features/auths/signin.tsx";
import { AuthPageLayout } from "layouts/index.ts";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./styles/index.css";

const routes = createBrowserRouter([
  {
    path: "/",
    Component: AuthPageLayout,
    children: [
      {
        index: true,
        path: "/",
        Component: SignIn,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={routes} />
  </StrictMode>
);
