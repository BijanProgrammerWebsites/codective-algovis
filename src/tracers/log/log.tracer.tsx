import { ReactElement, useContext, useEffect, useRef } from "react";

import clsx from "clsx";

import { TracerContext } from "@/context/tracer.context.ts";

import { LogRecord } from "@/records/log.record.ts";

import styles from "./log.module.css";

type Props = {
  records: LogRecord[];
};

export default function LogTracer({ records }: Props): ReactElement {
  const { step, changeStep } = useContext(TracerContext);

  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    // const activeRecord = listRef.current?.querySelector(`li.${styles.active}`);
    // activeRecord?.scrollIntoView();
  }, [step]);

  return (
    <div className={styles.log}>
      <ul ref={listRef} className={styles.records}>
        {records.map((record, index) => (
          <li
            key={index}
            className={clsx(index === step && styles.active)}
            onClick={() => changeStep(index)}
          >
            {index}. {record.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
