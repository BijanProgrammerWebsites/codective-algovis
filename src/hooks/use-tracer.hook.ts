import { useContext, useState } from "react";

import cloneDeep from "lodash-es/cloneDeep";

import { TracerContext } from "@/context/tracer.context.ts";

import { TracerRecord } from "@/records/tracer.record.ts";

export function useTracer<TRecords extends TracerRecord[]>() {
  const { changeStep, setTotalSteps } = useContext(TracerContext);

  const [records, setRecords] = useState<TRecords[]>([]);

  const trace = (records: TRecords): void => {
    const clone = cloneDeep(records);
    setRecords((old) => [...old, clone]);

    setTotalSteps((old) => old + 1);
  };

  const reset = (): void => {
    setRecords([]);

    changeStep(0);
    setTotalSteps(0);
  };

  return [records, trace, reset] as const;
}
