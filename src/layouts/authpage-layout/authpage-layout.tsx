import { Outlet } from "react-router";
import styles from "./authpage-layout.module.css";
import { FocusTrap } from "components/focus-trap";

export const AuthPageLayout = () => {
  return (
    <FocusTrap>
      <main className={styles.authlayout}>
        <Outlet />
      </main>
    </FocusTrap>
  );
};
