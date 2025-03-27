import { ReactElement } from "react";

import { motion } from "motion/react";

import clsx from "clsx";

import EdgeRenderer from "@/renderers/edge/edge.renderer.tsx";

import {
  LinkedListPointerNode,
  LinkedListStructure,
  Position,
} from "@/structures/linked-list.structure.ts";
import { Point } from "@/structures/point.ts";

import styles from "./linked-list-pointer.module.css";

type Props = {
  linkedList: LinkedListStructure;
  pointer: LinkedListPointerNode;
};

export default function LinkedListPointerRenderer({
  linkedList,
  pointer,
}: Props): ReactElement {
  const { dimensions } = linkedList;
  const { nodeWidth, nodeHeight, arrowGap } = dimensions;
  const { index, title, x, y, position, arrow } = pointer;

  const node = linkedList.findNode(index)!;

  const pointerPoint = (() => {
    switch (position) {
      case "top":
        return chiz(linkedList, pointer, "bottom");
      case "bottom":
        return chiz(linkedList, pointer, "top");
      case "left":
        return chiz(linkedList, pointer, "right");
      case "right":
        return chiz(linkedList, pointer, "left");
    }

    throw new Error("Invalid Position");
  })();

  const nodePoint = (() => {
    switch (position) {
      case "top":
        return chiz(linkedList, node, "top", 10);
      case "bottom":
        return chiz(linkedList, node, "bottom", 10);
      case "left":
        return chiz(linkedList, node, "left", 10);
      case "right":
        return chiz(linkedList, node, "right", 10);
    }

    throw new Error("Invalid Position");
  })();

  return (
    <motion.g
      key={`node-${node.id}`}
      className={styles.pointer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <EdgeRenderer
        className={styles.edge}
        start={arrow === "outside" ? pointerPoint : nodePoint}
        end={arrow === "outside" ? nodePoint : pointerPoint}
        nodeWidth={0}
        nodeHeight={0}
        arrowGap={arrowGap}
        isDirected={true}
      />

      <motion.g
        className={clsx(styles.node)}
        initial={false}
        animate={{ x, y }}
        transition={{ ease: "easeOut" }}
      >
        <g className={styles.title}>
          <rect className={styles.box} width={nodeWidth} height={nodeHeight} />
          <text
            className={styles.text}
            x={nodeWidth / 2}
            y={nodeHeight / 2 + 7}
          >
            {title}
          </text>
        </g>
      </motion.g>
    </motion.g>
  );
}

function chiz(
  linkedList: LinkedListStructure,
  point: Point,
  side: Position,
  gap: number = 0,
): Point {
  const { nodeWidth, nodeHeight } = linkedList.dimensions;

  switch (side) {
    case "top":
      return {
        x: point.x + nodeWidth / 2,
        y: point.y - gap,
      };
    case "bottom":
      return {
        x: point.x + nodeWidth / 2,
        y: point.y + nodeHeight + gap,
      };
    case "left":
      return {
        x: point.x - gap,
        y: point.y + nodeWidth / 2,
      };
    case "right":
      return {
        x: point.x + nodeWidth + gap,
        y: point.y + nodeWidth / 2,
      };
  }
}
