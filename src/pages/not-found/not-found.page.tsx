import { ReactElement } from "react";

import styles from "./not-found.module.css";

function NotFoundPage(): ReactElement {
  return <div className={styles["not-found"]}>404 | Page Not Found.</div>;
}

export default NotFoundPage;
