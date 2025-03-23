import { useState } from "react";

import cloneDeep from "lodash-es/cloneDeep";

import { TracerItem } from "@/items/tracer.item.ts";

export function useTracer<TItem extends TracerItem>() {
  const [items, setItems] = useState<TItem[]>([]);

  const trace = (item: TItem): void => {
    const clone = cloneDeep(item);
    setItems((old) => [...old, clone]);
  };

  const reset = (): void => {
    setItems([]);
  };

  return [items, trace, reset] as const;
}
