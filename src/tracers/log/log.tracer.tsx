import { ReactElement, useContext, useEffect, useRef } from "react";

import clsx from "clsx";

import { LogTracerItem } from "@/items/log-tracer.item..ts";

import { TracerContext } from "@/context/tracer.context.ts";

import styles from "./log.module.css";

type Props = {
  items: LogTracerItem[];
};

export default function LogTracer({ items }: Props): ReactElement {
  const { step, changeStep } = useContext(TracerContext);

  const itemsListRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const activeItem = itemsListRef.current?.querySelector(
      `li.${styles.active}`,
    );

    activeItem?.scrollIntoView();
  }, [step]);

  return (
    <div className={styles.log}>
      <ul ref={itemsListRef} className={styles.items}>
        {items.map((item, index) => (
          <li
            key={index}
            className={clsx(index === step && styles.active)}
            onClick={() => changeStep(index)}
          >
            {index}. {item.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
