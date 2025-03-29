import { BaseRecord } from "@/records/base.record.ts";

import { BinaryTreeStructure } from "@/structures/binary-tree.structure.ts";

export interface BinaryTreeRecord extends BaseRecord {
  binaryTree: BinaryTreeStructure;
}
