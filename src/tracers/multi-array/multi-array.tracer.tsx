import { ReactElement, useContext } from "react";

import { TracerContext } from "@/context/tracer.context.ts";

import { Arr, MultiArrayRecord } from "@/records/multi-array.record.ts";

import ArrayRenderer, {
  ArrayRendererItem,
} from "@/renderers/array/array.renderer.tsx";

import styles from "./multi-array.module.css";

type Props = {
  records: MultiArrayRecord[];
};

export default function MultiArrayTracer({ records }: Props): ReactElement {
  const { step } = useContext(TracerContext);

  const record = records[step];
  if (!record) {
    return <div className={styles.array}>Not Available</div>;
  }

  const chiztar: [key: string, arr: Arr][][] = [];
  Object.entries(record.arrays).map(([key, chiz]) => {
    if (!chiztar[chiz.depth]) {
      chiztar[chiz.depth] = [];
    }

    chiztar[chiz.depth].push([key, chiz]);
  });

  return (
    <div className={styles.scroll}>
      <div className={styles["multi-array"]}>
        {chiztar.map((row, rowIndex) => {
          let colsCount = 0;
          if (row[0][1].merge) {
            colsCount = Math.pow(2, 2 * (row[0][1].maxDepth! + 1) - rowIndex);
            console.log(colsCount);
          } else {
            colsCount = Math.pow(2, rowIndex);
          }

          return (
            <div
              key={rowIndex}
              className={styles.row}
              style={{
                gridTemplateColumns: `repeat(${colsCount}, 1fr)`,
              }}
            >
              {row.map(([key, arr]) => {
                const items: ArrayRendererItem[] = arr.array.cells.map(
                  (cell, index) => ({
                    id: cell.id,
                    value: cell.value,
                    color: cell.status,
                    pointers: arr.array.cellPointers(index),
                  }),
                );

                return (
                  <div key={key} style={{ gridColumn: `${arr.col + 1}` }}>
                    <ArrayRenderer keyPrefix={key} items={items} noGap />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
