import { ReactNode } from "react";

import EdgeRenderer from "@/renderers/edge/edge.renderer.tsx";
import { chiz } from "@/renderers/linked-list/renderers/linked-list-pointer/linked-list-pointer.renderer.tsx";

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
  const { arrowGap } = dimensions;
  const { source, target } = edge;

  const sourceNode = linkedList.findNode(source);
  const targetNode = linkedList.findNode(target);

  if (!sourceNode || !targetNode) {
    return null;
  }

  return (
    <EdgeRenderer
      className={styles.edge}
      start={chiz(
        linkedList,
        sourceNode,
        sourceNode.x < targetNode.x ? "right" : "left",
      )}
      end={chiz(
        linkedList,
        targetNode,
        sourceNode.x < targetNode.x ? "left" : "right",
      )}
      nodeWidth={0}
      nodeHeight={0}
      arrowGap={arrowGap}
      isDirected={true}
    />
  );
}
