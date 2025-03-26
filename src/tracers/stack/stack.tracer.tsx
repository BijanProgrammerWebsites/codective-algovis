import { ReactElement, useContext } from "react";

import { TracerContext } from "@/context/tracer.context.ts";

import { StackRecord } from "@/records/stack.record.ts";

import ArrayRenderer, {
  ArrayRendererItem,
} from "@/renderers/array/array.renderer.tsx";

import styles from "./stack.module.css";

type Props = {
  records: StackRecord[];
};

export default function StackTracer({ records }: Props): ReactElement {
  const { step } = useContext(TracerContext);

  const record = records[step];
  if (!record) {
    return <div className={styles.stack}>Not Available</div>;
  }

  const items: ArrayRendererItem[] = record.stack.map((item, index) => ({
    id: item.id,
    value: item.value,
    color: item.color,
    pointers: record.stack.itemPointers(index),
  }));

  return (
    <div className={styles.stack}>
      <ArrayRenderer stack items={items} />
    </div>
  );
}
