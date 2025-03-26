import { BaseRecord } from "@/records/base.record.ts";

import { StackStructure } from "@/structures/stack.structure.ts";

export interface StackRecord extends BaseRecord {
  stack: StackStructure;
}
