import { BaseRecord } from "@/records/base.record.ts";

import { LinkedListStructure } from "@/structures/linked-list.structure.ts";

export interface LinkedListRecord extends BaseRecord {
  linkedList: LinkedListStructure;
}
