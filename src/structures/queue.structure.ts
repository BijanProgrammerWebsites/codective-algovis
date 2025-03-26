import { ReactNode } from "react";

import { ColorType } from "@/types/color.type.ts";

export type QueueItem<T extends ReactNode = ReactNode> = {
  id: string;
  value: T;
  color: ColorType;
};

export type QueuePointers = Record<string, number>;

export class QueueStructure<T extends ReactNode = ReactNode> extends Array<
  QueueItem<T>
> {
  public pointers: QueuePointers;

  protected lastId: number = 0;

  public constructor(length: number = 0) {
    super(length);

    this.pointers = {};
  }

  public enqueue(value: T): void {
    this.push({
      id: "" + this.lastId,
      value,
      color: "default",
    });

    this.lastId++;
  }

  public dequeue(): T | null {
    if (this.isEmpty()) {
      return null;
    }

    const [item] = this.splice(0, 1);

    return item.value;
  }

  public front(): T | null {
    if (this.isEmpty()) {
      return null;
    }

    return this[0].value;
  }

  public colorFront(color: ColorType): ColorType {
    if (this.isEmpty()) {
      return "default";
    }

    const colorBackup = this[0].color;

    this[0].color = color;

    return colorBackup;
  }

  public back(): T | null {
    if (this.isEmpty()) {
      return null;
    }

    return this[this.length - 1].value;
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
