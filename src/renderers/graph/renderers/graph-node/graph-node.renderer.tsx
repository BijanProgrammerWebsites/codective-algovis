import { ReactElement } from "react";

import clsx from "clsx";

import { GraphNode, GraphStructure } from "@/structures/graph.structure.ts";

import { stringify } from "@/utils/graph.utils.ts";

import styles from "./graph-node.module.css";

type Props = {
  graph: GraphStructure;
  node: GraphNode;
};

export default function GraphNodeRenderer({
  graph,
  node,
}: Props): ReactElement {
  const { isWeighted, dimensions } = graph;
  const { nodeRadius, nodeWeightGap } = dimensions;
  const { id, title, x, y, weight, color } = node;

  return (
    <g
      className={clsx(styles.node, styles[color])}
      transform={`translate(${x},${y})`}
    >
      <circle className={styles.circle} r={nodeRadius} />
      <text className={styles.title}>{title ?? id}</text>
      {isWeighted && (
        <text className={styles.weight} x={nodeRadius + nodeWeightGap}>
          {stringify(weight)}
        </text>
      )}
    </g>
  );
}
