import { ReactElement } from "react";

import { motion } from "motion/react";

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
    <motion.g
      className={clsx(styles.node, styles[color])}
      initial={false}
      animate={{ x, y }}
      transition={{ ease: "easeOut" }}
    >
      <g className={styles.title}>
        <rect className={styles.box} width={nodeWidth} height={nodeHeight} />
        <text className={styles.text} x={nodeWidth / 2} y={nodeHeight / 2 + 7}>
          {data}
        </text>
      </g>
    </motion.g>
  );
}
