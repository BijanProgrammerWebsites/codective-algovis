import { ReactElement, useContext } from "react";

import { TracerContext } from "@/context/tracer.context.ts";

import LogTracer from "@/tracers/log/log.tracer.tsx";
import { useLogTracer } from "@/tracers/log/use-log-tracer.hook.ts";

import styles from "./problem125.module.css";

export default function Problem125(): ReactElement {
  const { setTotalSteps } = useContext(TracerContext);

  const [logs, traceLog] = useLogTracer();

  const trace = (): void => {
    traceLog(Math.random().toString());
    setTotalSteps((old) => old + 1);
  };

  return (
    <div className={styles.problem}>
      <div>
        <button onClick={trace}>Log</button>
      </div>
      <LogTracer items={logs} />
    </div>
  );
}
