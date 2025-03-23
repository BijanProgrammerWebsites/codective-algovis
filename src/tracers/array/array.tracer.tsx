import { ReactElement, useContext } from "react";

import { AnimatePresence, motion } from "motion/react";

import clsx from "clsx";

import { TracerContext } from "@/context/tracer.context.ts";

import TdesignArrowUp from "@/icons/TdesignArrowUp.tsx";

import { ArrayTracerItem } from "@/items/array-tracer.item..ts";

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
      <motion.ul className={styles.elements}>
        {item.elements.map((element, index) => {
          const pointer = item.pointers?.[index];

          return (
            <motion.li key={index} className={clsx(styles[element.color])}>
              <motion.div className={styles.index}>{index}</motion.div>
              <motion.div className={styles.value}>{element.value}</motion.div>
              <AnimatePresence>
                {pointer && (
                  <motion.div
                    className={styles.pointer}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    key={pointer}
                  >
                    <motion.div className={styles.content}>
                      <TdesignArrowUp />
                      {pointer}
                    </motion.div>
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
