import { BaseRecord } from "@/records/base.record.ts";

import { ArrayStructure } from "@/structures/array.structure.ts";

export interface ArrayRecord extends BaseRecord {
  array: ArrayStructure;
}
