import { ReactElement } from "react";

import clsx from "clsx";

import {
  LinkedListNode,
  LinkedListStructure,
} from "@/structures/linked-list.structure.ts";

import styles from "./linked-list-node.module.css";

type Props = {
  linkedList: LinkedListStructure;
  node: LinkedListNode;
};

export default function LinkedListNodeRenderer({
  linkedList,
  node,
}: Props): ReactElement {
  const { dimensions } = linkedList;
  const { nodeWidth, nodeHeight } = dimensions;
  const { x, y, data, color } = node;

  return (
    <g
      className={clsx(styles.node, styles[color])}
      transform={`translate(${x},${y})`}
    >
      <g className={styles.title}>
        <rect className={styles.box} width={nodeWidth} height={nodeHeight} />
        <text className={styles.text} x={nodeWidth / 2} y={nodeHeight / 2 + 7}>
          {data}
        </text>
      </g>
    </g>
  );
}
