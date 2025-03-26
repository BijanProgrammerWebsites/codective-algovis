import { BaseRecord } from "@/records/base.record.ts";

import { GraphStructure } from "@/structures/graph.structure.ts";

export interface GraphRecord extends BaseRecord {
  graph: GraphStructure;
}
