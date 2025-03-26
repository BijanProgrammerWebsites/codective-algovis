import { BaseRecord } from "@/records/base.record.ts";

import { ArrayStructure } from "@/structures/array.structure.ts";

export type Arr = {
  array: ArrayStructure<number>;
  col: number;
  depth: number;
  merge?: boolean;
  maxDepth?: number;
};

export type MultiArray = Record<string, Arr>;

export interface MultiArrayRecord extends BaseRecord {
  arrays: MultiArray;
}
