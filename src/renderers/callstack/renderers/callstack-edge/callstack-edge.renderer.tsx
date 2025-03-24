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
  const { arrowGap, statementWidth, statementHeight } = dimensions;
  const { source, target } = edge;

  const sourceNode = callstack.findNode(source);
  const targetNode = callstack.findNode(target);

  if (!sourceNode || !targetNode) {
    return null;
  }

  return (
    <EdgeRenderer
      className={styles.edge}
      start={{ x: sourceNode.x, y: sourceNode.y + statementHeight / 2 }}
      end={{ x: targetNode.x + 20, y: targetNode.y - 4 }}
      nodeWidth={statementWidth}
      nodeHeight={0}
      arrowGap={arrowGap}
      isDirected={true}
      isStraight={false}
    />
  );
}
