import { ReactNode } from "react";

import { ColorType } from "@/types/color.type.ts";

type Cell = {
  row: number;
  col: number;
  value: ReactNode;
  status: ColorType;
};

type PartialCell = Pick<Cell, "row" | "col"> &
  Partial<Omit<Cell, "row" | "col">>;

export class MatrixStructure {
  public readonly m: number;
  public readonly n: number;
  public readonly table: Cell[][];

  public constructor(m: number, n: number) {
    this.m = m;
    this.n = n;

    this.table = Array.from({ length: m }, (_, row) =>
      Array.from({ length: n }, (_, col) => ({
        row,
        col,
        value: "",
        status: "default",
      })),
    );
  }

  public update(partialCell: PartialCell): void {
    this.table[partialCell.row][partialCell.col] = {
      ...this.table[partialCell.row][partialCell.col],
      ...partialCell,
    };
  }
}
