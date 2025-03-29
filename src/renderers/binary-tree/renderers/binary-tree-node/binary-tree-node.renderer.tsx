import { ReactElement } from "react";

import clsx from "clsx";

import {
  BinaryTreeNode,
  BinaryTreeStructure,
} from "@/structures/binary-tree.structure.ts";

import styles from "./binary-tree-node.module.css";

type Props = {
  binaryTree: BinaryTreeStructure;
  node: BinaryTreeNode;
};

export default function BinaryTreeNodeRenderer({
  binaryTree,
  node,
}: Props): ReactElement {
  const { dimensions } = binaryTree;
  const { nodeRadius } = dimensions;
  const { id, value, x, y, color } = node;

  return (
    <g
      className={clsx(styles.node, styles[color])}
      transform={`translate(${x},${y})`}
    >
      <circle className={styles.circle} r={nodeRadius} />
      <text className={styles.title}>{value ?? id}</text>
    </g>
  );
}
