import { TracerRecord } from "@/records/tracer.record.ts";

import { ColorType } from "@/types/color.type.ts";

export interface OldArrayTracerRecord extends TracerRecord {
  items: Item[];
  pointers?: Pointers;
}

export type Pointers = Record<number, string[]>;

export type Item = {
  id: string;
  value: string | number;
  color: ColorType;
};
