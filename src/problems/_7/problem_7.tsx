import { ReactElement, useEffect, useState } from "react";

import BoardComponent from "@/components/board/board.component.tsx";
import { ButtonComponent } from "@/components/button/button.component.tsx";
import FormComponent from "@/components/form/form.component.tsx";
import NormalInputComponent from "@/components/normal-input/normal-input.component.tsx";

import { useProblem_7 } from "@/problems/_7/use-problem_7.ts";

import { ArrayStructure } from "@/structures/array.structure.ts";

import LogTracer from "@/tracers/log/log.tracer.tsx";
import MultiArrayTracer from "@/tracers/multi-array/multi-array.tracer.tsx";

import styles from "./problem_7.module.css";

export default function Problem_7(): ReactElement {
  const [nums, setNums] = useState<string>("[5, 1, 1, 2, 0, 0]");

  const {
    records,
    reset,
    traceBeforeWeBegin,
    traceCreate,
    traceBeforeMerge,
    traceAfterMerge,
    tracePutMerge,
    traceMessage,
  } = useProblem_7();

  const solve = (): void => {
    reset();

    const parsedNums = JSON.parse(nums);
    const chiz = [...parsedNums];

    const root = new ArrayStructure<number>(parsedNums);
    traceBeforeWeBegin({ root: { array: root, col: 0, depth: 0 } });

    let maxDepth = 0;

    function sort(
      left: number,
      right: number,
      col: number,
      depth: number,
    ): void {
      if (left >= right) {
        return;
      }

      if (depth > maxDepth) {
        maxDepth = depth;
      }

      const mid = Math.floor(left + (right - left) / 2);

      traceCreate(left, mid, 2 * col, depth + 1);
      sort(left, mid, 2 * col, depth + 1);

      traceCreate(mid + 1, right, 2 * col + 1, depth + 1);
      sort(mid + 1, right, 2 * col + 1, depth + 1);

      traceBeforeMerge(
        left,
        mid,
        right,
        col,
        maxDepth + (maxDepth - depth) + 2,
        maxDepth,
      );
      merge(left, mid, right);
      traceAfterMerge(left, mid, right);
    }

    function merge(left: number, mid: number, right: number): void {
      const leftLength = mid - left + 1;
      const rightLength = right - mid;

      const leftNums = chiz.slice(left, mid + 1);
      const rightNums = chiz.slice(mid + 1, right + 1);

      let leftIndex = 0;
      let rightIndex = 0;
      let mergedIndex = left;

      while (leftIndex < leftLength && rightIndex < rightLength) {
        if (leftNums[leftIndex] <= rightNums[rightIndex]) {
          tracePutMerge(
            left,
            mid,
            right,
            leftIndex,
            rightIndex,
            mergedIndex,
            true,
            leftNums[leftIndex],
          );
          chiz[mergedIndex] = leftNums[leftIndex];
          leftIndex++;
        } else {
          tracePutMerge(
            left,
            mid,
            right,
            leftIndex,
            rightIndex,
            mergedIndex,
            false,
            rightNums[rightIndex],
          );
          chiz[mergedIndex] = rightNums[rightIndex];
          rightIndex++;
        }

        mergedIndex++;
      }

      while (leftIndex < leftLength) {
        tracePutMerge(
          left,
          mid,
          right,
          leftIndex,
          rightIndex,
          mergedIndex,
          true,
          leftNums[leftIndex],
        );
        chiz[mergedIndex] = leftNums[leftIndex];
        leftIndex++;

        mergedIndex++;
      }

      while (rightIndex < rightLength) {
        tracePutMerge(
          left,
          mid,
          right,
          leftIndex,
          rightIndex,
          mergedIndex,
          false,
          rightNums[rightIndex],
        );
        chiz[mergedIndex] = rightNums[rightIndex];
        rightIndex++;

        mergedIndex++;
      }
    }

    sort(0, root.cells.length - 1, 0, 0);

    traceMessage("Array sorted successfully");
  };

  useEffect(() => {
    solve();
  }, []);

  return (
    <div className={styles.problem}>
      <FormComponent onSubmit={solve}>
        <NormalInputComponent
          label="nums"
          type="text"
          value={nums}
          onChange={(e) => setNums(e.currentTarget.value)}
        />
        <ButtonComponent variant="primary">Solve</ButtonComponent>
      </FormComponent>
      <BoardComponent>
        <MultiArrayTracer records={records.map((x) => x[1])} />
        <LogTracer records={records.map((x) => x[0])} />
      </BoardComponent>
    </div>
  );
}
