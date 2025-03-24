import { ReactElement, useEffect, useState } from "react";

import BoardComponent from "@/components/board/board.component.tsx";
import { ButtonComponent } from "@/components/button/button.component.tsx";
import FormComponent from "@/components/form/form.component.tsx";
import NormalInputComponent from "@/components/normal-input/normal-input.component.tsx";

import { useCallstackTracer } from "@/hooks/use-callstack-tracer.ts";

import { CallstackStructure } from "@/structures/callstack.structure.ts";

import CallstackTracer from "@/tracers/callstack/callstack.tracer.tsx";
import LogTracer from "@/tracers/log/log.tracer.tsx";

import styles from "./problem_2.module.css";

export default function Problem_2(): ReactElement {
  const [nums, setNums] = useState<string>("[23, 16, 4, 15, 42, 8]");

  const {
    records,
    reset,
    traceBeforeWeBegin,
    traceBeforeCall,
    traceCalled,
    traceReturning,
    traceReturned,
    traceStatement,
  } = useCallstackTracer();

  const solve = (): void => {
    reset();

    const parsedNums = JSON.parse(nums);

    const callstack = new CallstackStructure();
    traceBeforeWeBegin(callstack, `index = ${0}`);

    function max(
      parentId: number,
      id: number,
      nums: number[],
      index: number,
    ): number {
      traceCalled(callstack, parentId, id, index);

      if (index === nums.length - 1) {
        traceReturning(callstack, id, nums[nums.length - 1]);
        return nums[nums.length - 1];
      }

      traceBeforeCall(callstack, id, index + 1);
      const result = max(id, id + 1, nums, index + 1);
      traceReturned(callstack, id, result);

      traceStatement(callstack, id, `${nums[index]} > ${result} ?`);

      traceReturning(
        callstack,
        id,
        nums[index] > result ? nums[index] : result,
      );

      return nums[index] > result ? nums[index] : result;
    }

    traceBeforeCall(callstack, 0, 0);
    const result = max(0, 1, parsedNums, 0);
    traceReturned(callstack, 0, result);
  };

  useEffect(() => {
    solve();
  }, []);

  return (
    <div className={styles.problem}>
      <FormComponent onSubmit={solve}>
        <NormalInputComponent
          label="n"
          type="text"
          value={nums}
          onChange={(e) => setNums(e.currentTarget.value)}
        />
        <ButtonComponent variant="primary">Solve</ButtonComponent>
      </FormComponent>
      <BoardComponent>
        <CallstackTracer records={records.map((x) => x[1])} />
        <LogTracer records={records.map((x) => x[0])} />
      </BoardComponent>
    </div>
  );
}
