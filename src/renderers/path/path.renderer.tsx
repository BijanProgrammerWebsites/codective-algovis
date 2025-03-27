import { ReactElement } from "react";

import { Transition, motion } from "motion/react";

import clsx from "clsx";

import { Point } from "@/structures/point.ts";

import styles from "./path.module.css";

type Props = {
  className?: string;
  start: Point;
  end: Point;
  transition?: Transition;
};

export default function PathRenderer({
  className,
  start,
  end,
  transition,
}: Props): ReactElement {
  const x1 = start.x;
  const y1 = start.y;
  const x2 = end.x;
  const y2 = end.y;

  return (
    <motion.line
      className={clsx(styles.path, className)}
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1, x1, y1, x2, y2 }}
      transition={transition}
    />
  );
}
