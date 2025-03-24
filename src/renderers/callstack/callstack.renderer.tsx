import { ReactElement, useContext } from "react";

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
  const { nodes, edges, dimensions } = callstack;

  const { center, zoom } = useContext(RendererContext);

  const { baseWidth, baseHeight } = dimensions;

  const viewBox = [
    (center.x - baseWidth / 2) * zoom,
    (center.y - baseHeight / 2) * zoom,
    baseWidth * zoom,
    baseHeight * zoom,
  ].join(" ");

  return (
    <svg className={styles.callstack} viewBox={viewBox}>
      <ArrowsRenderer />
      {edges.map((edge) => (
        <CallstackEdgeRenderer
          key={`${edge.source}-${edge.target}`}
          callstack={callstack}
          edge={edge}
        />
      ))}
      {nodes.map((node) => (
        <CallstackNodeRenderer
          key={node.id}
          callstack={callstack}
          node={node}
        />
      ))}
    </svg>
  );
}
