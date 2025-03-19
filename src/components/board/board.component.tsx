import { PropsWithChildren, ReactElement } from "react";

import styles from "./board.module.css";

type Props = PropsWithChildren;

export default function BoardComponent({ children }: Props): ReactElement {
  return <div className={styles.board}>{children}</div>;
}
