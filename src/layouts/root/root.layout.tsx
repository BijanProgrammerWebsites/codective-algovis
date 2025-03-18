import { ReactElement } from "react";

import { Outlet } from "react-router";

import FooterComponent from "@/components/footer/footer.component.tsx";
import HeaderComponent from "@/components/header/header.component.tsx";

import styles from "./root.module.css";

function RootLayout(): ReactElement {
  return (
    <div className={styles["root-layout"]}>
      <HeaderComponent />
      <main>
        <Outlet />
      </main>
      <FooterComponent />
    </div>
  );
}

export default RootLayout;
