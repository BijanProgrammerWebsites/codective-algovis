import { ReactNode } from "react";

import { ColorType } from "@/types/color.type.ts";

type Cell = {
  id: string;
  value: ReactNode;
  status: ColorType;
};

type PartialCell = Partial<Cell>;

export type ArrayPointers = Record<string, number>;
export type ArrayStatuses = Record<number, ColorType>;

export class ArrayStructure {
  public readonly length: number;
  public readonly cells: Cell[];
  public pointers: ArrayPointers;

  public constructor(values: ReactNode[]) {
    this.length = values.length;

    this.cells = values.map((value, index) => ({
      id: `cell-${index}-${value}`,
      value,
      status: "default",
    }));

    this.pointers = {};
  }

  public get statuses(): ColorType[] {
    return this.cells.map((cell) => cell.status);
  }

  public cellPointers(index: number): string[] {
    const result: string[] = [];

    const entries = Object.entries(this.pointers);

    for (const [title, i] of entries) {
      if (i === index) {
        result.push(title);
      }
    }

    return result;
  }

  public update(index: number, partialCell: PartialCell): void {
    this.cells[index] = {
      ...this.cells[index],
      ...partialCell,
    };
  }

  public updateStatuses(statuses: ArrayStatuses): void {
    Object.entries(statuses).forEach(([index, status]) => {
      this.cells[+index].status = status;
    });
  }

  public updateAllStatuses(statuses: ColorType[]): void {
    this.cells.forEach((cell, i) => (cell.status = statuses[i]));
  }

  public colorize(
    color: ColorType,
    from: number = 0,
    to: number = this.length - 1,
  ): void {
    for (let i = from; i <= to; i++) {
      this.cells[i].status = color;
    }
  }
}
