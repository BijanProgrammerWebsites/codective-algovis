import { TracerRecord } from "@/records/tracer.record.ts";

import { ColorType } from "@/types/color.type.ts";

export interface ArrayTracerRecord extends TracerRecord {
  items: Item[];
  pointers?: Pointers;
}

export type Pointers = Record<number, string>;

export type Item = {
  value: string | number;
  color: ColorType;
};
