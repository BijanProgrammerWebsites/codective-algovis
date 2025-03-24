import { ReactNode } from "react";

import clsx from "clsx";

import PathRenderer from "@/renderers/path/path.renderer.tsx";

import { Point } from "@/structures/point.ts";

import { stringify } from "@/utils/graph.utils.ts";

import styles from "./edge.module.css";

type Props = {
  className?: string;
  start: Point;
  end: Point;
  weight?: number | null;
  nodeWidth?: number;
  nodeHeight?: number;
  arrowGap?: number;
  weightGap?: number;
  isDirected?: boolean;
  isWeighted?: boolean;
  isStraight?: boolean;
};

export default function EdgeRenderer({
  className,
  start,
  end,
  weight,
  nodeWidth = 0,
  nodeHeight = 0,
  arrowGap = 0,
  weightGap = 0,
  isDirected = false,
  isWeighted = false,
  isStraight = true,
}: Props): ReactNode {
  const middle: Point = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };

  const deltaX = end.x - start.x;
  const deltaY = end.y - start.y;

  const degree = (Math.atan2(deltaY, deltaX) / Math.PI) * 180;

  if (isDirected) {
    if (isStraight) {
      const totalLength = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const lineLength = totalLength - nodeWidth - arrowGap;

      const lineRatio = lineLength / totalLength;

      if (totalLength !== 0) {
        end = {
          x: start.x + deltaX * lineRatio,
          y: start.y + deltaY * lineRatio,
        };
      }
    } else {
      start = {
        x: start.x + nodeWidth + arrowGap,
        y: start.y,
      };
      end = {
        x: end.x,
        y: end.y - nodeHeight - arrowGap,
      };
    }
  }

  return (
    <g className={clsx(styles.edge, className)}>
      {isStraight ? (
        <PathRenderer
          className={clsx(styles.line, isDirected && styles.directed)}
          start={{ x: start.x, y: start.y }}
          end={{ x: end.x, y: end.y }}
        />
      ) : (
        <>
          <PathRenderer
            className={clsx(styles.line)}
            start={{ x: start.x, y: start.y }}
            end={{ x: end.x, y: start.y }}
            transition={{ duration: 0.1 }}
          />
          <PathRenderer
            className={clsx(styles.line, isDirected && styles.directed)}
            start={{ x: end.x, y: start.y }}
            end={{ x: end.x, y: end.y }}
            transition={{ duration: 0.1, delay: 0.1 }}
          />
        </>
      )}
      {isWeighted && (
        <g transform={`translate(${middle.x},${middle.y})`}>
          <text
            className={styles.weight}
            transform={`rotate(${degree})`}
            y={-weightGap}
          >
            {stringify(weight)}
          </text>
        </g>
      )}
    </g>
  );
}
