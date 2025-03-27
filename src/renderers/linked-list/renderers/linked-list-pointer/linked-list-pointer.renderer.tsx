import { ReactElement } from "react";

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

  const node = linkedList.findNodeByIndex(index);

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
        return chiz(linkedList, node, "top");
      case "bottom":
        return chiz(linkedList, node, "bottom");
      case "left":
        return chiz(linkedList, node, "left");
      case "right":
        return chiz(linkedList, node, "right");
    }

    throw new Error("Invalid Position");
  })();

  return (
    <g className={styles.pointer}>
      <EdgeRenderer
        className={styles.edge}
        start={arrow === "outside" ? pointerPoint : nodePoint}
        end={arrow === "outside" ? nodePoint : pointerPoint}
        nodeWidth={0}
        nodeHeight={0}
        arrowGap={arrowGap}
        isDirected={true}
      />
      <g className={clsx(styles.node)} transform={`translate(${x},${y})`}>
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
      </g>
    </g>
  );
}

function chiz(
  linkedList: LinkedListStructure,
  point: Point,
  side: Position,
): Point {
  const { nodeWidth, nodeHeight } = linkedList.dimensions;

  switch (side) {
    case "top":
      return {
        x: point.x + nodeWidth / 2,
        y: point.y,
      };
    case "bottom":
      return {
        x: point.x + nodeWidth / 2,
        y: point.y + nodeHeight,
      };
    case "left":
      return {
        x: point.x,
        y: point.y + nodeWidth / 2,
      };
    case "right":
      return {
        x: point.x + nodeWidth,
        y: point.y + nodeWidth / 2,
      };
  }
}
