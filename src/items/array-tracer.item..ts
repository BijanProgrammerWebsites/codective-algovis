import { TracerItem } from "@/items/tracer.item.ts";

import { ColorType } from "@/types/color.type.ts";

export interface ArrayTracerItem extends TracerItem {
  elements: ArrayTracerItemElement[];
  pointers?: Record<number, string>;
}

export type ArrayTracerItemElement = {
  value: string | number;
  color: ColorType;
};
