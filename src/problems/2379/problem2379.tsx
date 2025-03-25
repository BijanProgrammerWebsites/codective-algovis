import { ReactElement, useEffect, useState } from "react";

import BoardComponent from "@/components/board/board.component.tsx";
import { ButtonComponent } from "@/components/button/button.component.tsx";
import FormComponent from "@/components/form/form.component.tsx";
import NormalInputComponent from "@/components/normal-input/normal-input.component.tsx";

import { useArrayTracer } from "@/hooks/use-array-tracer.ts";

import { ArrayStatuses, ArrayStructure } from "@/structures/array.structure.ts";

import ArrayTracer from "@/tracers/array/array.tracer.tsx";
import LogTracer from "@/tracers/log/log.tracer.tsx";

import { ColorType } from "@/types/color.type.ts";

import styles from "./problem2379.module.css";

export default function Problem2379(): ReactElement {
  const [blocks, setBlocks] = useState<string>("WBBWWBBWBW");
  const [k, setK] = useState<string>("7");

  const {
    records,
    reset,
    traceBeforeWeBegin,
    traceAndReset,
    traceAll,
    tracesIndexesWithinWindow,
  } = useArrayTracer();

  const solve = (): void => {
    reset();

    const blocksArray = blocks.split("");
    const kValue = parseInt(k);

    const array = new ArrayStructure(blocksArray);
    traceBeforeWeBegin(array);

    function traceWindow(
      left: number,
      right: number,
      status: ColorType,
      message: string,
    ): void {
      const statuses: ArrayStatuses = {};

      for (let i = left; i <= right; i++) {
        statuses[i] = status;
      }

      traceAndReset(statuses, message, { left, right });
    }

    let minOperations = Infinity;

    if (kValue > blocksArray.length) {
      traceAll("danger", "k is greater than the length of blocks");
      return;
    }

    let whiteCount = 0;
    for (let i = 0; i < kValue; i++) {
      if (blocksArray[i] === "W") {
        whiteCount++;
      }
    }

    traceWindow(
      0,
      kValue - 1,
      "primary",
      `First window: White count = ${whiteCount}`,
    );
    minOperations = whiteCount;
    let lastMinimumWindow = { start: 0, end: kValue - 1 };
    traceWindow(
      0,
      kValue - 1,
      "success",
      `Current minimum operations = ${minOperations}`,
    );

    for (let i = 1; i <= blocksArray.length - kValue; i++) {
      if (blocksArray[i - 1] === "W") {
        whiteCount--;
      }

      if (blocksArray[i + kValue - 1] === "W") {
        whiteCount++;
      }

      traceWindow(
        i,
        i + kValue - 1,
        "warning",
        `Window at index ${i}: White count = ${whiteCount}`,
      );

      if (whiteCount < minOperations) {
        minOperations = whiteCount;
        lastMinimumWindow = { start: i, end: i + kValue - 1 };
        traceWindow(
          i,
          i + kValue - 1,
          "success",
          `New minimum found: ${minOperations} operations`,
        );
      } else {
        traceWindow(
          i,
          i + kValue - 1,
          "danger",
          `No improvement, current minimum remains ${minOperations}`,
        );
      }
    }

    const toBeColoredIndexes = blocksArray
      .map(
        (block, i) =>
          i >= lastMinimumWindow.start &&
          i <= lastMinimumWindow.end &&
          block === "W",
      )
      .map((item, i) => (item ? i : null))
      .filter((item) => item !== null);

    tracesIndexesWithinWindow(
      lastMinimumWindow,
      toBeColoredIndexes,
      "success",
      "primary",
      `Final result: ${minOperations} operations needed to get ${kValue} consecutive black blocks`,
    );
  };

  useEffect(() => {
    solve();
  }, []);

  return (
    <div className={styles.problem}>
      <FormComponent onSubmit={solve}>
        <NormalInputComponent
          label="blocks"
          type="text"
          value={blocks}
          onChange={(e) => setBlocks(e.currentTarget.value)}
        />
        <NormalInputComponent
          label="k"
          type="text"
          value={k}
          onChange={(e) => setK(e.currentTarget.value)}
        />
        <ButtonComponent variant="primary">Solve</ButtonComponent>
      </FormComponent>
      <BoardComponent>
        <ArrayTracer records={records.map((x) => x[1])} />
        <LogTracer records={records.map((x) => x[0])} />
      </BoardComponent>
    </div>
  );
}
