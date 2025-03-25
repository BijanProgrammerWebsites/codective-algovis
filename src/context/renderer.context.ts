import { createContext } from "react";

import { ViewBoxType } from "@/types/view-box.type.ts";

type RendererContextValue = {
  viewBox: ViewBoxType;
};

export const RendererContext = createContext<RendererContextValue>({
  viewBox: { x: -400, y: -300, w: 800, h: 600 },
});
