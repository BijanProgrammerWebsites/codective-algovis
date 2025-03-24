import { ReactElement } from "react";

import clsx from "clsx";

import {
  CallstackNode,
  CallstackStructure,
} from "@/structures/callstack.structure.ts";

import styles from "./callstack-node.module.css";

type Props = {
  callstack: CallstackStructure;
  node: CallstackNode;
};

export default function CallstackNodeRenderer({
  callstack,
  node,
}: Props): ReactElement {
  const { dimensions } = callstack;
  const { statementWidth, statementHeight } = dimensions;
  const { x, y, title, statements } = node;

  return (
    <g className={clsx(styles.node)} transform={`translate(${x},${y})`}>
      <g className={styles.title}>
        <rect
          className={styles.box}
          width={statementWidth}
          height={statementHeight}
        />
        <text className={styles.text} x="10" y="24">
          {title}
        </text>
      </g>
      {statements.map((statement, i) => (
        <g
          className={clsx(styles.statement)}
          transform={`translate(${0},${(i + 1) * 40})`}
        >
          <rect
            className={styles.box}
            width={statementWidth}
            height={statementHeight}
          />
          <text className={styles.text} x="10" y="24">
            {statement}
          </text>
        </g>
      ))}
    </g>
  );
}
