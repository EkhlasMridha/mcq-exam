import { Outlet } from "react-router";
import styles from "./authpage-layout.module.css";

export const AuthPageLayout = () => {
  return (
    <main className={styles.authlayout}>
      <Outlet />
    </main>
  );
};
