import { BaseRecord } from "@/records/base.record.ts";

import { CallstackStructure } from "@/structures/callstack.structure.ts";

export interface CallstackRecord extends BaseRecord {
  callstack: CallstackStructure;
}
