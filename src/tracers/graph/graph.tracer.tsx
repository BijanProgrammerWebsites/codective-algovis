import { ReactElement, useContext } from "react";

import { TracerContext } from "@/context/tracer.context.ts";

import RendererProvider from "@/providers/renderer.provider.tsx";

import { GraphRecord } from "@/records/graph.record.ts";

import GraphRenderer from "@/renderers/graph/graph.renderer.tsx";

import styles from "./graph.module.css";

type Props = {
  records: GraphRecord[];
};

export default function GraphTracer({ records }: Props): ReactElement {
  const { step } = useContext(TracerContext);

  const record = records[step];
  if (!record) {
    return <div className={styles.graph}>Not Available</div>;
  }

  return (
    <RendererProvider>
      <div className={styles.graph}>
        <GraphRenderer graph={record.graph} />
      </div>
    </RendererProvider>
  );
}
