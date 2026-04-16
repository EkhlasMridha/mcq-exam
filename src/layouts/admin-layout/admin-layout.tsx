import { Outlet } from "react-router";
import styles from "./admin-layout.module.css";
import { BrandLogo } from "layouts/brand-logo";

export const AdminLayout = () => {
  return (
    <div className={styles.layout_container}>
      <nav>
        <div className={styles.brandlogo_container}>
          <BrandLogo />
        </div>
      </nav>
      <div className={styles.layout_content}>
        <Outlet />
      </div>
    </div>
  );
};
