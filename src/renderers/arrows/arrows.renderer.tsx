import { ReactElement } from "react";

import clsx from "clsx";

import { ColorType } from "@/types/color.type.ts";

import styles from "./arrows.module.css";

export default function ArrowsRenderer(): ReactElement {
  return (
    <defs>
      <Arrow color="default" />
      <Arrow color="primary" />
      <Arrow color="success" />
      <Arrow color="warning" />
      <Arrow color="danger" />
      <Arrow color="disabled" />
    </defs>
  );
}

type ArrowProps = {
  color: ColorType;
};

function Arrow({ color }: ArrowProps): ReactElement {
  return (
    <marker
      id={`marker-arrow-${color}`}
      markerWidth="4"
      markerHeight="4"
      refX="2"
      refY="2"
      orient="auto"
    >
      <path
        d="M0,0 L0,4 L4,2 L0,0"
        className={clsx(styles.arrow, styles[color])}
      />
    </marker>
  );
}
