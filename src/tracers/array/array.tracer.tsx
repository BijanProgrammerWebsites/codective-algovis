import { ReactElement, useContext } from "react";

import clsx from "clsx";

import { ArrayTracerItem } from "@/items/array-tracer.item..ts";

import { TracerContext } from "@/context/tracer.context.ts";

import styles from "./array.module.css";

type Props = {
  items: ArrayTracerItem[];
};

export default function ArrayTracer({ items }: Props): ReactElement {
  const { step } = useContext(TracerContext);

  const item = items[step];
  if (!item) {
    return <div className={styles.array}>Not Available</div>;
  }

  return (
    <div className={styles.array}>
      <ul className={styles.elements}>
        {item.elements.map((element, index) => {
          return (
            <li key={index} className={clsx(styles[element.color])}>
              {element.value}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
