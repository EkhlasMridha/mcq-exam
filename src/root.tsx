import { ModalHandler } from "components/modals/modal";
import { StrictMode, useEffect } from "react";
import { RouterProvider } from "react-router";
import { routes } from "routers/route.config";

export const RootPage = () => {
  useEffect(() => {
    document.addEventListener("keydown", modalCloseOnEscape);
    return () => {
      document.removeEventListener("keydown", modalCloseOnEscape);
    };
  }, []);

  const modalCloseOnEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      ModalHandler.closeTop();
    }
  };

  return (
    <StrictMode>
      <RouterProvider router={routes} />
    </StrictMode>
  );
};
