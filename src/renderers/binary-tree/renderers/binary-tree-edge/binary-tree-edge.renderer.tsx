import { ReactNode } from "react";

import clsx from "clsx";

import EdgeRenderer from "@/renderers/edge/edge.renderer.tsx";

import {
  BinaryTreeEdge,
  BinaryTreeStructure,
} from "@/structures/binary-tree.structure.ts";

import styles from "./binary-tree-edge.module.css";

type Props = {
  binaryTree: BinaryTreeStructure;
  edge: BinaryTreeEdge;
};

export default function BinaryTreeEdgeRenderer({
  binaryTree,
  edge,
}: Props): ReactNode {
  const { isDirected, dimensions } = binaryTree;
  const { nodeRadius, arrowGap } = dimensions;
  const { source, target, color } = edge;

  const sourceNode = binaryTree.findNode(source);
  const targetNode = binaryTree.findNode(target);

  if (!sourceNode || !targetNode) {
    return null;
  }

  return (
    <EdgeRenderer
      className={clsx(styles.edge, styles[color])}
      start={{ x: sourceNode.x, y: sourceNode.y }}
      end={{ x: targetNode.x, y: targetNode.y }}
      nodeWidth={nodeRadius}
      nodeHeight={nodeRadius}
      arrowGap={arrowGap}
      isDirected={isDirected}
    />
  );
}
