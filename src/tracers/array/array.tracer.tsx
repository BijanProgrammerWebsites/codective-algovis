import { ReactElement, useContext } from "react";

import { TracerContext } from "@/context/tracer.context.ts";

import { ArrayRecord } from "@/records/array.record.ts";

import ArrayRenderer from "@/renderers/array/array.renderer.tsx";

import styles from "./array.module.css";

type Props = {
  records: ArrayRecord[];
};

export default function ArrayTracer({ records }: Props): ReactElement {
  const { step } = useContext(TracerContext);

  const record = records[step];
  if (!record) {
    return <div className={styles.array}>Not Available</div>;
  }

  return (
    <div className={styles.array}>
      <ArrayRenderer array={record.array} />
    </div>
  );
}
