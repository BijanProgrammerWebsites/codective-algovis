import {
  MouseEvent,
  PropsWithChildren,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";

import useResizeObserver from "@react-hook/resize-observer";

import { RendererContext } from "@/context/renderer.context.ts";

import { ViewBoxType } from "@/types/view-box.type.ts";

import styles from "./rendere.module.css";

type Props = PropsWithChildren;

function RendererProvider({ children }: Props): ReactElement {
  const rendererRef = useRef<HTMLDivElement>(null);

  const isPanEnabled = useRef<boolean>(true);
  const isZoomEnabled = useRef<boolean>(true);

  const [viewBox, setViewBox] = useState<ViewBoxType>({
    x: -400,
    y: -300,
    w: 800,
    h: 600,
  });

  const zoom = useRef<number>(1);
  const zoomMax = useRef<number>(20);
  const zoomMin = useRef<number>(1 / 20);

  const lastX = useRef<number>(0);
  const lastY = useRef<number>(0);

  const isMouseDown = useRef<boolean>(false);

  useResizeObserver(rendererRef, (entry) => {
    const width = entry.borderBoxSize[0].inlineSize;
    const height = entry.borderBoxSize[0].blockSize;

    setViewBox((old) => ({
      ...old,
      w: width * zoom.current,
      h: height * zoom.current,
    }));
  });

  const mouseDownHandler = (e: MouseEvent<HTMLDivElement>): void => {
    if (!isPanEnabled.current) {
      return;
    }

    const { clientX, clientY } = e;

    lastX.current = clientX;
    lastY.current = clientY;

    isMouseDown.current = true;
  };

  const mouseMoveHandler = (e: MouseEvent<HTMLDivElement>): void => {
    if (!isMouseDown.current) {
      return;
    }

    const dx = e.clientX - lastX.current;
    const dy = e.clientY - lastY.current;

    setViewBox((old) => ({
      ...old,
      x: old.x - dx * zoom.current,
      y: old.y - dy * zoom.current,
    }));

    lastX.current = e.clientX;
    lastY.current = e.clientY;
  };

  const mouseUpHandler = (): void => {
    isMouseDown.current = false;
  };

  useEffect(() => {
    const element = rendererRef.current;

    const wheelHandler = (e: WheelEvent): void => {
      if (!isZoomEnabled.current) {
        return;
      }

      e.preventDefault();

      const scale = e.deltaY < 0 ? 0.8 : 1.25;
      const newZoom = Math.min(
        zoomMax.current,
        Math.max(zoomMin.current, zoom.current * scale),
      );

      const mpos = { x: e.offsetX * zoom.current, y: e.offsetY * zoom.current };
      const vpos = { x: viewBox.x, y: viewBox.y };
      const cpos = { x: mpos.x + vpos.x, y: mpos.y + vpos.y };

      const newViewBox = {
        x: (viewBox.x - cpos.x) * scale + cpos.x,
        y: (viewBox.y - cpos.y) * scale + cpos.y,
        w: (viewBox.w * newZoom) / zoom.current,
        h: (viewBox.h * newZoom) / zoom.current,
      };

      setViewBox(newViewBox);

      zoom.current = newZoom;
    };

    element?.addEventListener("wheel", wheelHandler, { passive: false });

    return () => {
      element?.removeEventListener("wheel", wheelHandler);
    };
  }, [viewBox]);

  return (
    <RendererContext.Provider value={{ viewBox }}>
      <div
        ref={rendererRef}
        className={styles.renderer}
        onMouseDown={mouseDownHandler}
        onMouseMove={mouseMoveHandler}
        onMouseUp={mouseUpHandler}
      >
        {children}
      </div>
    </RendererContext.Provider>
  );
}

export default RendererProvider;
