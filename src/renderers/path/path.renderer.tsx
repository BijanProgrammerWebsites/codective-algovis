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
  return (
    <motion.path
      d={`M${start.x},${start.y} L${end.x},${end.y}`}
      className={clsx(styles.path, className)}
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={transition}
    />
  );
}
