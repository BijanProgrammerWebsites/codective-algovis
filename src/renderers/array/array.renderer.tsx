import { ReactElement } from "react";

import { AnimatePresence, motion } from "motion/react";

import clsx from "clsx";

import TdesignArrowUp from "@/icons/TdesignArrowUp.tsx";

import { ArrayStructure } from "@/structures/array.structure.ts";

import styles from "./array.module.css";

type Props = {
  array: ArrayStructure;
  keyPrefix?: string;
  noGap?: boolean;
};

export default function ArrayRenderer({
  array,
  keyPrefix = "",
  noGap = false,
}: Props): ReactElement {
  const { cells } = array;

  return (
    <motion.ul className={clsx(styles.array, noGap && styles["no-gap"])}>
      {cells.map((cell, index) => {
        const pointers = array.cellPointers(index);

        return (
          <motion.li
            key={keyPrefix + cell.id}
            layoutId={keyPrefix + cell.id}
            className={clsx(styles.cell, styles[cell.status])}
          >
            <motion.div className={styles.index}>{index}</motion.div>
            <motion.div className={styles.value}>{cell.value}</motion.div>
            <AnimatePresence>
              {pointers && (
                <motion.div className={styles.pointers}>
                  {pointers.map((pointer) => (
                    <motion.div
                      className={styles.pointer}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      key={keyPrefix + pointer}
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
  );
}
