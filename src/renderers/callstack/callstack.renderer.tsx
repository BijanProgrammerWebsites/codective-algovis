import { ReactElement, useContext } from "react";

import { AnimatePresence, motion } from "motion/react";

import { RendererContext } from "@/context/renderer.context.ts";

import ArrowsRenderer from "@/renderers/arrows/arrows.renderer.tsx";
import CallstackEdgeRenderer from "@/renderers/callstack/renderers/callstack-edge/callstack-edge.renderer.tsx";
import CallstackNodeRenderer from "@/renderers/callstack/renderers/callstack-node/callstack-node.renderer.tsx";

import { CallstackStructure } from "@/structures/callstack.structure.ts";

import styles from "./callstack.module.css";

type Props = {
  callstack: CallstackStructure;
};

export default function CallstackRenderer({ callstack }: Props): ReactElement {
  const { nodes, edges } = callstack;

  const { viewBox } = useContext(RendererContext);

  return (
    <svg
      className={styles.callstack}
      viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
    >
      <ArrowsRenderer />
      <AnimatePresence>
        {edges.map((edge) => (
          <motion.g
            key={`edge-${edge.source}-${edge.target}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CallstackEdgeRenderer callstack={callstack} edge={edge} />
          </motion.g>
        ))}
        {nodes.map((node) => (
          <motion.g
            key={`node-${node.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CallstackNodeRenderer callstack={callstack} node={node} />
          </motion.g>
        ))}
      </AnimatePresence>
    </svg>
  );
}
