import {
  MouseEvent,
  PropsWithChildren,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";

import { RendererContext } from "@/context/renderer.context.ts";

import { Point } from "@/structures/point.ts";

import styles from "./rendere.module.css";

type Props = PropsWithChildren;

function FiltersProvider({ children }: Props): ReactElement {
  const [center, setCenter] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);

  const rendererRef = useRef<HTMLDivElement>(null);

  const isPanEnabled = useRef<boolean>(true);
  const isZoomEnabled = useRef<boolean>(true);

  const zoomFactor = useRef<number>(1.01);
  const zoomMax = useRef<number>(20);
  const zoomMin = useRef<number>(1 / 20);

  const lastX = useRef<number>(0);
  const lastY = useRef<number>(0);

  const isMouseDown = useRef<boolean>(false);

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

    const { clientX, clientY } = e;

    const dx = clientX - lastX.current;
    const dy = clientY - lastY.current;

    setCenter((old) => ({
      x: old.x - dx,
      y: old.y - dy,
    }));

    lastX.current = clientX;
    lastY.current = clientY;
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

      const { deltaY } = e;

      let newZoom = zoom * Math.pow(zoomFactor.current, deltaY);
      newZoom = Math.min(zoomMax.current, Math.max(zoomMin.current, newZoom));

      setZoom(newZoom);
    };

    element?.addEventListener("wheel", wheelHandler, { passive: false });

    return () => {
      element?.removeEventListener("wheel", wheelHandler);
    };
  }, [zoom]);

  return (
    <RendererContext.Provider value={{ center, zoom }}>
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

export default FiltersProvider;
