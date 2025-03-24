import { ReactNode } from "react";

import EdgeRenderer from "@/renderers/edge/edge.renderer.tsx";

import {
  CallstackEdge,
  CallstackStructure,
} from "@/structures/callstack.structure.ts";

import styles from "./callstack-edge.module.css";

type Props = {
  callstack: CallstackStructure;
  edge: CallstackEdge;
};

export default function CallstackEdgeRenderer({
  callstack,
  edge,
}: Props): ReactNode {
  const { dimensions } = callstack;
  const { arrowGap } = dimensions;
  const { source, target } = edge;

  const sourceNode = callstack.findNode(source);
  const targetNode = callstack.findNode(target);

  if (!sourceNode || !targetNode) {
    return null;
  }

  return (
    <EdgeRenderer
      className={styles.edge}
      start={{ x: sourceNode.x, y: sourceNode.y }}
      end={{ x: targetNode.x, y: targetNode.y }}
      nodeRadius={20}
      arrowGap={arrowGap}
      isDirected={true}
      isStraight={false}
    />
  );
}
