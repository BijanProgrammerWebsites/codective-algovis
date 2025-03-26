import { ReactElement, useContext } from "react";

import { TracerContext } from "@/context/tracer.context.ts";

import { ArrayRecord } from "@/records/array.record.ts";

import ArrayRenderer, {
  ArrayRendererItem,
} from "@/renderers/array/array.renderer.tsx";

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

  const items: ArrayRendererItem[] = record.array.cells.map((cell, index) => ({
    id: cell.id,
    value: cell.value,
    color: cell.status,
    pointers: record.array.cellPointers(index),
  }));

  return (
    <div className={styles.array}>
      <ArrayRenderer items={items} />
    </div>
  );
}
