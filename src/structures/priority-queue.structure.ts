import { ReactNode } from "react";

import { QueueStructure } from "@/structures/queue.structure.ts";

type Comparer<T extends ReactNode = ReactNode> = (a: T, b: T) => number;

export class PriorityQueueStructure<
  T extends ReactNode = ReactNode,
> extends QueueStructure<T> {
  private readonly comparer: Comparer<T>;

  public constructor(comparer: Comparer<T>, length: number = 0) {
    super(length);

    this.comparer = comparer;
  }

  public enqueue(value: T): void {
    this.push({
      id: "" + this.lastId,
      value,
      color: "default",
    });

    this.lastId++;

    for (let j = this.size() - 1; j > 0; j--) {
      if (this.comparer(this[j].value, this[j - 1].value) > 0) {
        const temp = this[j];
        this[j] = this[j - 1];
        this[j - 1] = temp;
      } else {
        break;
      }
    }
  }
}
