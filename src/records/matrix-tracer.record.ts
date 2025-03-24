import { TracerRecord } from "@/records/tracer.record.ts";

import { MatrixStructure } from "@/structures/matrix.structure.ts";

export interface MatrixTracerRecord extends TracerRecord {
  matrix: MatrixStructure;
}
