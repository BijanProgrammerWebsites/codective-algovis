import { ReactElement, useContext } from "react";

import { TracerContext } from "@/context/tracer.context.ts";

import { GraphTracerItem } from "@/items/graph-tracer.item..ts";

import RendererProvider from "@/providers/renderer.provider.tsx";

import GraphComponent from "./components/graph/graph.component.tsx";

import styles from "./graph.module.css";

type Props = {
  items: GraphTracerItem[];
};

export default function GraphTracer({ items }: Props): ReactElement {
  const { step } = useContext(TracerContext);

  const item = items[step];
  if (!item) {
    return <div className={styles.graph}>Not Available</div>;
  }

  return (
    <RendererProvider>
      <div className={styles.graph}>
        <GraphComponent graph={item.graph} />
      </div>
    </RendererProvider>
  );
}
