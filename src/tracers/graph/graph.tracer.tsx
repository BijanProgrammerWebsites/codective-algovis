import { ReactElement, useContext } from "react";

import { TracerContext } from "@/context/tracer.context.ts";

import RendererProvider from "@/providers/renderer.provider.tsx";

import { GraphTracerRecord } from "@/records/graph-tracer.record.ts";

import GraphComponent from "./components/graph/graph.component.tsx";

import styles from "./graph.module.css";

type Props = {
  records: GraphTracerRecord[];
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
        <GraphComponent graph={record.graph} />
      </div>
    </RendererProvider>
  );
}
