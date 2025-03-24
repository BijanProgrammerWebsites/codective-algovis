import { ReactElement } from "react";

import clsx from "clsx";

import styles from "./arrows.module.css";

export default function ArrowsRenderer(): ReactElement {
  return (
    <defs>
      <marker
        id="markerArrow"
        markerWidth="4"
        markerHeight="4"
        refX="2"
        refY="2"
        orient="auto"
      >
        <path d="M0,0 L0,4 L4,2 L0,0" className={styles.arrow} />
      </marker>
      <marker
        id="markerArrowSelected"
        markerWidth="4"
        markerHeight="4"
        refX="2"
        refY="2"
        orient="auto"
      >
        <path
          d="M0,0 L0,4 L4,2 L0,0"
          className={clsx(styles.arrow, styles.selected)}
        />
      </marker>
      <marker
        id="markerArrowVisited"
        markerWidth="4"
        markerHeight="4"
        refX="2"
        refY="2"
        orient="auto"
      >
        <path
          d="M0,0 L0,4 L4,2 L0,0"
          className={clsx(styles.arrow, styles.visited)}
        />
      </marker>
    </defs>
  );
}
