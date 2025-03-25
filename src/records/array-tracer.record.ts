import { TracerRecord } from "@/records/tracer.record.ts";

import { ArrayStructure } from "@/structures/array.structure.ts";

export interface ArrayTracerRecord extends TracerRecord {
  array: ArrayStructure;
}
