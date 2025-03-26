import { BaseRecord } from "@/records/base.record.ts";

import { ColorType } from "@/types/color.type.ts";

export interface OldArrayRecord extends BaseRecord {
  items: Item[];
  pointers?: Pointers;
}

export type Pointers = Record<number, string[]>;

export type Item = {
  id: string;
  value: string | number;
  color: ColorType;
};
