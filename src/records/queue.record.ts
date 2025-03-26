import { BaseRecord } from "@/records/base.record.ts";

import { QueueStructure } from "@/structures/queue.structure.ts";

export interface QueueRecord extends BaseRecord {
  queue: QueueStructure;
}
