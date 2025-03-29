import { PropsWithChildren, ReactElement } from "react";

import clsx from "clsx";

import styles from "./board.module.css";

type BoardLayout = "one-one" | "two-one" | "two-one-one-auto";

type Props = PropsWithChildren<{
  layout?: BoardLayout;
}>;

export default function BoardComponent({
  children,
  layout = "one-one",
}: Props): ReactElement {
  return <div className={clsx(styles.board, styles[layout])}>{children}</div>;
}
