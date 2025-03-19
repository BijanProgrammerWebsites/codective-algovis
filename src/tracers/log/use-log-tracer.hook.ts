import { useState } from "react";

import { LogTracerItem } from "@/tracers/log/log-tracer.item..ts";

export function useLogTracer() {
  const [items, setItems] = useState<LogTracerItem[]>([]);

  const trace = (message: string): void => {
    setItems((old) => [...old, { message }]);
  };

  return [items, trace] as const;
}
