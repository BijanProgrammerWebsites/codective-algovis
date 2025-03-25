import { ReactElement } from "react";

import { AnimatePresence, motion } from "motion/react";

import clsx from "clsx";

import TdesignArrowUp from "@/icons/TdesignArrowUp.tsx";

import { ArrayStructure } from "@/structures/array.structure.ts";

import styles from "./array.module.css";

type Props = {
  array: ArrayStructure;
};

export default function ArrayRenderer({ array }: Props): ReactElement {
  const { cells } = array;

  return (
    <motion.ul className={styles.array}>
      {cells.map((cell, index) => {
        const pointers = array.cellPointers(index);

        return (
          <motion.li
            key={`cell-${index}`}
            layoutId={cell.id}
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
  );
}
