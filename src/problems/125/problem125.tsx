import { ReactElement, useContext } from "react";

import { TracerContext } from "@/context/tracer.context.ts";

import LogTracer from "@/tracers/log/log.tracer.tsx";
import { useLogTracer } from "@/tracers/log/use-log-tracer.hook.ts";

import styles from "./problem125.module.css";

export default function Problem125(): ReactElement {
  const { totalSteps, setTotalSteps } = useContext(TracerContext);

  const [logs, traceLog] = useLogTracer();

  const trace = (): void => {
    traceLog(`Step ${totalSteps + 1} (${Math.random()})`);
    setTotalSteps((old) => old + 1);
  };

  return (
    <div className={styles.problem}>
      <button onClick={trace}>Log</button>
      <LogTracer items={logs} />
    </div>
  );
}
