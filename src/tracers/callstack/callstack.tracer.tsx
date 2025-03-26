import { ReactElement, useContext } from "react";

import { TracerContext } from "@/context/tracer.context.ts";

import RendererProvider from "@/providers/renderer.provider.tsx";

import { CallstackRecord } from "@/records/callstack.record.ts";

import CallstackRenderer from "@/renderers/callstack/callstack.renderer.tsx";

import styles from "./callstack.module.css";

type Props = {
  records: CallstackRecord[];
};

export default function CallstackTracer({ records }: Props): ReactElement {
  const { step } = useContext(TracerContext);

  const record = records[step];
  if (!record) {
    return <div className={styles.callstack}>Not Available</div>;
  }

  return (
    <RendererProvider>
      <div className={styles.callstack}>
        <CallstackRenderer callstack={record.callstack} />
      </div>
    </RendererProvider>
  );
}
