import { ReactElement, useEffect, useState } from "react";

import BoardComponent from "@/components/board/board.component.tsx";
import { ButtonComponent } from "@/components/button/button.component.tsx";
import FormComponent from "@/components/form/form.component.tsx";
import NormalInputComponent from "@/components/normal-input/normal-input.component.tsx";

import { useProblem28 } from "@/problems/28/use-problem28.ts";

import ArrayTracer from "@/tracers/array/array.tracer.tsx";
import LogTracer from "@/tracers/log/log.tracer.tsx";

import styles from "./problem28.module.css";

export default function Problem28(): ReactElement {
  const [haystack, setHaystack] = useState<string>("sadbutsad");
  const [needle, setNeedle] = useState<string>("sad");

  const {
    records,
    reset,
    generateItems,
    traceBeforeWeBegin,
    traceInitStart,
    traceBoth,
    traceCheck,
    traceMatched,
    traceUnmatched,
    traceFound,
    traceNotFound,
  } = useProblem28();

  const solve = (): void => {
    reset();

    const haystackItems = generateItems(haystack);
    const needleItems = generateItems(needle);
    traceBeforeWeBegin(haystackItems, needleItems);

    let start = 0;
    traceInitStart(haystackItems, needleItems, start);

    while (start <= haystackItems.length - needleItems.length) {
      let index = 0;
      traceBoth(haystackItems, needleItems, start, index);

      traceCheck(haystackItems, needleItems, start, index);
      while (
        index < needleItems.length &&
        haystackItems[start + index].value === needleItems[index].value
      ) {
        if (index !== 0) {
          traceCheck(haystackItems, needleItems, start, index);
        }

        traceMatched(haystackItems, needleItems, start, index);
        index++;
      }

      if (index === needleItems.length) {
        traceFound(haystackItems, needleItems, start);
        return;
      }

      traceUnmatched(haystackItems, needleItems, start, index);

      start++;
    }

    traceNotFound(haystackItems, needleItems);
  };

  useEffect(() => {
    solve();
  }, []);

  return (
    <div className={styles.problem}>
      <FormComponent onSubmit={solve}>
        <NormalInputComponent
          label="haystack"
          type="text"
          value={haystack}
          onChange={(e) => setHaystack(e.currentTarget.value)}
        />
        <NormalInputComponent
          label="needle"
          type="text"
          value={needle}
          onChange={(e) => setNeedle(e.currentTarget.value)}
        />
        <ButtonComponent variant="primary">Solve</ButtonComponent>
      </FormComponent>
      <BoardComponent layout="two-one">
        <ArrayTracer records={records.map((x) => x[1])} />
        <ArrayTracer records={records.map((x) => x[2])} />
        <LogTracer records={records.map((x) => x[0])} />
      </BoardComponent>
    </div>
  );
}
