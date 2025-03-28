import { ReactNode } from "react";

import clsx from "clsx";

import EdgeRenderer from "@/renderers/edge/edge.renderer.tsx";

import { GraphEdge, GraphStructure } from "@/structures/graph.structure.ts";

import styles from "./graph-edge.module.css";

type Props = {
  graph: GraphStructure;
  edge: GraphEdge;
};

export default function GraphEdgeRenderer({ graph, edge }: Props): ReactNode {
  const { isDirected, isWeighted, dimensions } = graph;
  const { nodeRadius, arrowGap, edgeWeightGap } = dimensions;
  const { source, target, weight, color } = edge;

  const sourceNode = graph.findNode(source);
  const targetNode = graph.findNode(target);

  if (!sourceNode || !targetNode) {
    return null;
  }

  return (
    <EdgeRenderer
      className={clsx(styles.edge, styles[color])}
      start={{ x: sourceNode.x, y: sourceNode.y }}
      end={{ x: targetNode.x, y: targetNode.y }}
      weight={weight}
      nodeWidth={nodeRadius}
      nodeHeight={nodeRadius}
      arrowGap={arrowGap}
      weightGap={edgeWeightGap}
      isDirected={isDirected}
      isWeighted={isWeighted}
    />
  );
}
