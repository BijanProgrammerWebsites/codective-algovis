import { ReactElement, useContext } from "react";

import { AnimatePresence, motion } from "motion/react";

import { RendererContext } from "@/context/renderer.context.ts";

import ArrowsRenderer from "@/renderers/arrows/arrows.renderer.tsx";
import LinkedListPointerRenderer from "@/renderers/linked-list/renderers/linked-list-pointer/linked-list-pointer.renderer.tsx";

import { LinkedListStructure } from "@/structures/linked-list.structure.ts";

import LinkedListEdgeRenderer from "./renderers/linked-list-edge/linked-list-edge.renderer.tsx";
import LinkedListNodeRenderer from "./renderers/linked-list-node/linked-list-node.renderer.tsx";

import styles from "./linked-list.module.css";

type Props = {
  linkedList: LinkedListStructure;
};

export default function LinkedListRenderer({
  linkedList,
}: Props): ReactElement {
  const { nodes, edges, pointerNodes } = linkedList;

  const { viewBox } = useContext(RendererContext);

  return (
    <svg
      className={styles["linked-list"]}
      viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
    >
      <ArrowsRenderer />
      <AnimatePresence>
        {pointerNodes.map((pointer) => (
          <motion.g
            key={`pointer-${pointer.title}-${pointer.index}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LinkedListPointerRenderer
              linkedList={linkedList}
              pointer={pointer}
            />
          </motion.g>
        ))}
        {edges.map((edge) => (
          <motion.g
            key={`edge-${edge.source}-${edge.target}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LinkedListEdgeRenderer linkedList={linkedList} edge={edge} />
          </motion.g>
        ))}
        {nodes.map((node) => (
          <motion.g
            key={`node-${node.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LinkedListNodeRenderer linkedList={linkedList} node={node} />
          </motion.g>
        ))}
      </AnimatePresence>
    </svg>
  );
}
