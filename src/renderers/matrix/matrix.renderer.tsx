import { ReactElement } from "react";

import clsx from "clsx";

import { MatrixStructure } from "@/structures/matrix.structure.ts";

import styles from "./matrix.module.css";

type Props = {
  matrix: MatrixStructure;
};

export default function MatrixRenderer({ matrix }: Props): ReactElement {
  const { table } = matrix;

  return (
    <div
      className={styles.matrix}
      style={{
        gridTemplateColumns: `repeat(${matrix.m}, auto)`,
        gridTemplateRows: `repeat(${matrix.n}, auto)`,
      }}
    >
      {table.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`cell-${rowIndex}-${colIndex}`}
            className={clsx(styles.cell, styles[cell.status])}
          >
            {cell.value}
          </div>
        )),
      )}
    </div>
  );
}
