import { useContext, useState } from "react";

import cloneDeep from "lodash-es/cloneDeep";

import { TracerContext } from "@/context/tracer.context.ts";

import { TracerItem } from "@/items/tracer.item.ts";

export function useTracer<TTypes extends TracerItem[]>() {
  const { changeStep, setTotalSteps } = useContext(TracerContext);

  const [items, setItems] = useState<TTypes[]>([]);

  const trace = (items: TTypes): void => {
    const clone = cloneDeep(items);
    setItems((old) => [...old, clone]);

    setTotalSteps((old) => old + 1);
  };

  const reset = (): void => {
    setItems([]);

    changeStep(0);
    setTotalSteps(0);
  };

  return [items, trace, reset] as const;
}
