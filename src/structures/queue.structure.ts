import { ReactNode } from "react";

import { ColorType } from "@/types/color.type.ts";

export type QueueItem<T extends ReactNode = ReactNode> = {
  id: string;
  value: T;
  color: ColorType;
};

export class QueueStructure<T extends ReactNode = ReactNode> extends Array<
  QueueItem<T>
> {
  private lastId: number = 0;

  public constructor(length: number = 0) {
    super(length);
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

  public colorFront(color: ColorType): void {
    if (this.isEmpty()) {
      return;
    }

    this[0].color = color;
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
    const currentColors = this.map((item) => item.color);

    this.forEach((item, index) => {
      if (typeof colorOrColors === "string") {
        item.color = colorOrColors;
      } else {
        item.color = colorOrColors[index];
      }
    });

    return currentColors;
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
}
