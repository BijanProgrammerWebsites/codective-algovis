import { ReactElement } from "react";

import clsx from "clsx";

import styles from "@/renderers/callstack/renderers/callstack-node/callstack-node.module.css";

import {
  CallstackNode,
  CallstackStructure,
} from "@/structures/callstack.structure.ts";

type Props = {
  callstack: CallstackStructure;
  node: CallstackNode;
};

export default function CallstackNodeRenderer({
  callstack,
  node,
}: Props): ReactElement {
  const { dimensions } = callstack;
  const { nodeRadius } = dimensions;
  const { id, x, y } = node;

  return (
    <g className={clsx(styles.node)} transform={`translate(${x},${y})`}>
      <circle className={styles.circle} r={nodeRadius} />
      <text className={styles.id}>{id}</text>
    </g>
  );
}
