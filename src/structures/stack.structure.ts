import { ReactNode } from "react";

import { ColorType } from "@/types/color.type.ts";

export type StackItem<T extends ReactNode = ReactNode> = {
  id: string;
  value: T;
  color: ColorType;
};

export type StackPointers = Record<string, number>;

export class StackStructure<T extends ReactNode = ReactNode> extends Array<
  StackItem<T>
> {
  public pointers: StackPointers;

  protected lastId: number = 0;

  public constructor(length: number = 0) {
    super(length);

    this.pointers = {};
  }

  public push2(value: T): void {
    this.push({
      id: "" + this.lastId,
      value,
      color: "default",
    });

    this.lastId++;
  }

  public pop2(): T | null {
    if (this.isEmpty()) {
      return null;
    }

    const [item] = this.splice(this.size() - 1, 1);

    return item.value;
  }

  public top(): T | null {
    if (this.isEmpty()) {
      return null;
    }

    return this[this.size() - 1].value;
  }

  public colorTop(color: ColorType): ColorType {
    if (this.isEmpty()) {
      return "default";
    }

    const colorBackup = this[this.size() - 1].color;

    this[this.size() - 1].color = color;

    return colorBackup;
  }

  public bottom(): T | null {
    if (this.isEmpty()) {
      return null;
    }

    return this[0].value;
  }

  public size(): number {
    return this.length;
  }

  public colorAll(colorOrColors: ColorType | ColorType[]): ColorType[] {
    const colorsBackup = this.map((item) => item.color);

    this.forEach((item, index) => {
      if (typeof colorOrColors === "string") {
        item.color = colorOrColors;
      } else {
        item.color = colorOrColors[index];
      }
    });

    return colorsBackup;
  }

  public isEmpty(): boolean {
    return this.length === 0;
  }

  public clear(): void {
    this.splice(0, Infinity);
  }

  public toString(): string {
    return this.join(", ");
  }

  public itemPointers(index: number): string[] {
    const result: string[] = [];

    const entries = Object.entries(this.pointers);

    for (const [title, i] of entries) {
      if (i === index) {
        result.push(title);
      }
    }

    return result;
  }
}
