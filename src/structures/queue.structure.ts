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
    if (this.length === 0) {
      return null;
    }

    const [item] = this.splice(0, 1);

    return item.value;
  }
}
