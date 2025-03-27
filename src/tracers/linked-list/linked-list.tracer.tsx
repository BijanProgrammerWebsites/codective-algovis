import { ReactElement, useContext } from "react";

import { TracerContext } from "@/context/tracer.context.ts";

import RendererProvider from "@/providers/renderer.provider.tsx";

import { LinkedListRecord } from "@/records/linked-list.record.ts";

import LinkedListRenderer from "@/renderers/linked-list/linked-list.renderer.tsx";

import styles from "./linked-list.module.css";

type Props = {
  records: LinkedListRecord[];
};

export default function LinkedListTracer({ records }: Props): ReactElement {
  const { step } = useContext(TracerContext);

  const record = records[step];
  if (!record) {
    return <div className={styles["linked-list"]}>Not Available</div>;
  }

  return (
    <RendererProvider>
      <div className={styles["linked-list"]}>
        <LinkedListRenderer linkedList={record.linkedList} />
      </div>
    </RendererProvider>
  );
}
