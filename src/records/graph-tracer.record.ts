import { TracerRecord } from "@/records/tracer.record.ts";

import { GraphStructure } from "@/structures/graph.structure.ts";

export interface GraphTracerRecord extends TracerRecord {
  graph: GraphStructure;
}
