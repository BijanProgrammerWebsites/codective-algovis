import { ReactElement, useContext } from "react";

import { AnimatePresence, motion } from "motion/react";

import clsx from "clsx";

import { TracerContext } from "@/context/tracer.context.ts";

import TdesignArrowUp from "@/icons/TdesignArrowUp.tsx";

import { OldArrayRecord } from "@/records/old-array.record.ts";

import styles from "./old-array.module.css";

type Props = {
  records: OldArrayRecord[];
};

export default function OldArrayTracer({ records }: Props): ReactElement {
  const { step } = useContext(TracerContext);

  const record = records[step];
  if (!record) {
    return <div className={styles.array}>Not Available</div>;
  }

  return (
    <div className={styles.array}>
      <motion.ul className={styles.items}>
        {record.items.map((item, index) => {
          const pointers = record.pointers?.[index];

          return (
            <motion.li
              key={item.id}
              layoutId={item.id}
              className={clsx(styles[item.color])}
            >
              <motion.div className={styles.index}>{index}</motion.div>
              <motion.div className={styles.value}>{item.value}</motion.div>
              <AnimatePresence>
                {pointers && (
                  <motion.div className={styles.pointers}>
                    {pointers.map((pointer) => (
                      <motion.div
                        className={styles.pointer}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        key={pointer}
                      >
                        <motion.div className={styles.content} layout>
                          <TdesignArrowUp />
                          {pointer}
                        </motion.div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.li>
          );
        })}
      </motion.ul>
    </div>
  );
}
