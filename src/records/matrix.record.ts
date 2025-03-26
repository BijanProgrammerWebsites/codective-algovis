import { BaseRecord } from "@/records/base.record.ts";

import { MatrixStructure } from "@/structures/matrix.structure.ts";

export interface MatrixRecord extends BaseRecord {
  matrix: MatrixStructure;
}
