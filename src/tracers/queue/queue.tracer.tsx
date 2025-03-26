import { ReactElement, useContext } from "react";

import { TracerContext } from "@/context/tracer.context.ts";

import { QueueRecord } from "@/records/queue.record.ts";

import ArrayRenderer, {
  ArrayRendererItem,
} from "@/renderers/array/array.renderer.tsx";

import styles from "./queue.module.css";

type Props = {
  records: QueueRecord[];
};

export default function QueueTracer({ records }: Props): ReactElement {
  const { step } = useContext(TracerContext);

  const record = records[step];
  if (!record) {
    return <div className={styles.queue}>Not Available</div>;
  }

  const items: ArrayRendererItem[] = record.queue.map((item) => ({
    id: item.id,
    value: item.value,
    color: item.color,
    pointers: undefined,
  }));

  return (
    <div className={styles.queue}>
      <ArrayRenderer items={items} />
    </div>
  );
}
