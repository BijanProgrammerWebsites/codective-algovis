import { ReactElement } from "react";

import styles from "./footer.module.css";

export default function FooterComponent(): ReactElement {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <span className={styles.message}>All rights reserved.</span>
      <span className={styles.copyright}>Copyright © {year} codective.ir</span>
    </footer>
  );
}
