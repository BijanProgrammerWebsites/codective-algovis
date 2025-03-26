import { ReactElement, ReactNode } from "react";

import { AnimatePresence, Variants, motion } from "motion/react";

import clsx from "clsx";

import TdesignArrowUp from "@/icons/TdesignArrowUp.tsx";

import { ColorType } from "@/types/color.type.ts";

import styles from "./array.module.css";

const defaultItemVariants: Variants = {
  initial: { opacity: 0, scale: 0 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0 },
};

export type ArrayRendererItem = {
  id: string;
  value: ReactNode;
  color: ColorType;
  pointers?: string[];
};

type Props = {
  items: ArrayRendererItem[];
  keyPrefix?: string;
  noGap?: boolean;
  itemVariants?: Variants;
  stack?: boolean;
};

export default function ArrayRenderer({
  items,
  keyPrefix = "",
  noGap = false,
  itemVariants = defaultItemVariants,
  stack = false,
}: Props): ReactElement {
  return (
    <motion.ul
      className={clsx(
        styles.array,
        noGap && styles["no-gap"],
        stack && styles.stack,
      )}
    >
      <AnimatePresence>
        {items.map((item, index) => (
          <motion.li
            key={keyPrefix + item.id}
            className={clsx(styles.cell, styles[item.color])}
            layoutId={keyPrefix + item.id}
            variants={itemVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <motion.div className={styles.index}>{index}</motion.div>
            <motion.div className={styles.value}>{item.value}</motion.div>
            <AnimatePresence>
              {item.pointers && (
                <motion.div className={styles.pointers}>
                  {item.pointers.map((pointer) => (
                    <motion.div
                      key={keyPrefix + pointer}
                      className={styles.pointer}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
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
        ))}
      </AnimatePresence>
    </motion.ul>
  );
}
