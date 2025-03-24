import { TracerRecord } from "@/records/tracer.record.ts";

import { CallstackStructure } from "@/structures/callstack.structure.ts";

export interface CallstackTracerRecord extends TracerRecord {
  callstack: CallstackStructure;
}
