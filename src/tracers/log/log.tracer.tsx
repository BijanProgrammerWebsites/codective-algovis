import { ReactElement, useContext } from "react";

import { TracerContext } from "@/context/tracer.context.ts";

import { LogTracerItem } from "@/tracers/log/log-tracer.item..ts";

import styles from "./log.module.css";

type Props = {
  items: LogTracerItem[];
};

export default function LogTracer({ items }: Props): ReactElement {
  const { step } = useContext(TracerContext);

  const item = items[step];

  return (
    <div className={styles.log}>{item ? item.message : "Not Available"}</div>
  );
}
