import { createContext } from "react";

import { Point } from "@/structures/point.ts";

type RendererContextValue = {
  center: Point;
  zoom: number;
};

export const RendererContext = createContext<RendererContextValue>({
  center: { x: 0, y: 0 },
  zoom: 1,
});
