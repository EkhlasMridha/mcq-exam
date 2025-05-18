import { Navigate, Outlet } from "react-router";
import styles from "./authpage-layout.module.css";
import { FocusTrap } from "components/focus-trap";
import { ACESS_TOKEN_KEY } from "constants/common.const";

export const AuthPageLayout = () => {
  const hasToken = localStorage.getItem(ACESS_TOKEN_KEY);
  if (hasToken) return <Navigate to={"/"} />;
  return (
    <FocusTrap>
      <main className={styles.authlayout}>
        <Outlet />
      </main>
    </FocusTrap>
  );
};
