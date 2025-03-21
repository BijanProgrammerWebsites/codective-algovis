import { TracerItem } from "@/items/tracer.item.ts";

import { GraphStructure } from "@/structures/graph.structure.ts";

export interface GraphTracerItem extends TracerItem {
  graph: GraphStructure;
}
