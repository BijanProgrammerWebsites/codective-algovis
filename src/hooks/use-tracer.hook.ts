import { useState } from "react";

import { TracerItem } from "@/items/tracer.item.ts";

export function useTracer<TItem extends TracerItem>() {
  const [items, setItems] = useState<TItem[]>([]);

  const trace = (item: TItem): void => {
    setItems((old) => [...old, item]);
  };

  const reset = (): void => {
    setItems([]);
  };

  return [items, trace, reset] as const;
}
