import { ReactNode } from "react";

import EdgeRenderer from "@/renderers/edge/edge.renderer.tsx";

import {
  LinkedListEdge,
  LinkedListStructure,
} from "@/structures/linked-list.structure.ts";

import styles from "./linked-list-edge.module.css";

type Props = {
  linkedList: LinkedListStructure;
  edge: LinkedListEdge;
};

export default function LinkedListEdgeRenderer({
  linkedList,
  edge,
}: Props): ReactNode {
  const { dimensions } = linkedList;
  const { arrowGap, nodeWidth, nodeHeight } = dimensions;
  const { source, target } = edge;

  const sourceNode = linkedList.findNode(source);
  const targetNode = linkedList.findNode(target);

  if (!sourceNode || !targetNode) {
    return null;
  }

  return (
    <EdgeRenderer
      className={styles.edge}
      start={{
        x: sourceNode.x + nodeWidth,
        y: sourceNode.y + nodeHeight / 2,
      }}
      end={{ x: targetNode.x, y: targetNode.y + nodeHeight / 2 }}
      nodeWidth={0}
      nodeHeight={0}
      arrowGap={arrowGap}
      isDirected={true}
    />
  );
}
