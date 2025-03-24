import { ReactElement, useContext } from "react";

import { TracerContext } from "@/context/tracer.context.ts";

import { MatrixTracerRecord } from "@/records/matrix-tracer.record.ts";

import MatrixRenderer from "@/renderers/matrix/matrix.renderer.tsx";

import styles from "./matrix.module.css";

type Props = {
  records: MatrixTracerRecord[];
};

export default function MatrixTracer({ records }: Props): ReactElement {
  const { step } = useContext(TracerContext);

  const record = records[step];
  if (!record) {
    return <div className={styles.matrix}>Not Available</div>;
  }

  return (
    <div className={styles.matrix}>
      <MatrixRenderer matrix={record.matrix} />
    </div>
  );
}
