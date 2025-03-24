import { ReactNode } from "react";

import clsx from "clsx";

import { GraphEdge, GraphStructure } from "@/structures/graph.structure.ts";
import { Point } from "@/structures/point.ts";

import { stringify } from "@/utils/graph.utils.ts";

import styles from "./edge.module.css";

type Props = {
  graph: GraphStructure;
  edge: GraphEdge;
};

export default function EdgeRenderer({ graph, edge }: Props): ReactNode {
  const { isDirected, isWeighted, dimensions } = graph;
  const { nodeRadius, arrowGap, edgeWeightGap } = dimensions;
  const { source, target, weight, visitedCount, selectedCount } = edge;

  const sourceNode = graph.findNode(source);
  const targetNode = graph.findNode(target);

  if (!sourceNode || !targetNode) {
    return null;
  }

  const start: Point = { x: sourceNode.x, y: sourceNode.y };
  const end: Point = { x: targetNode.x, y: targetNode.y };

  const middle: Point = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };

  const deltaX = end.x - start.x;
  const deltaY = end.y - start.y;

  const degree = (Math.atan2(deltaY, deltaX) / Math.PI) * 180;

  if (isDirected) {
    const totalLength = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const lineLength = totalLength - nodeRadius - arrowGap;

    const lineRatio = lineLength / totalLength;

    if (totalLength !== 0) {
      end.x = start.x + deltaX * lineRatio;
      end.y = start.y + deltaY * lineRatio;
    }
  }

  return (
    <g
      className={clsx(
        styles.edge,
        selectedCount && styles.selected,
        visitedCount && styles.visited,
      )}
      key={`${source}-${target}`}
    >
      <path
        d={`M${start.x},${start.y} L${end.x},${end.y}`}
        className={clsx(styles.line, isDirected && styles.directed)}
      />
      {isWeighted && (
        <g transform={`translate(${middle.x},${middle.y})`}>
          <text
            className={styles.weight}
            transform={`rotate(${degree})`}
            y={-edgeWeightGap}
          >
            {stringify(weight)}
          </text>
        </g>
      )}
    </g>
  );
}
