import { ReactElement, useEffect, useState } from "react";

import BoardComponent from "@/components/board/board.component.tsx";
import { ButtonComponent } from "@/components/button/button.component.tsx";
import FormComponent from "@/components/form/form.component.tsx";
import NormalInputComponent from "@/components/normal-input/normal-input.component.tsx";

import { useProblem1652 } from "@/problems/1652/use-problem1652.ts";

import LogTracer from "@/tracers/log/log.tracer.tsx";
import OldArrayTracer from "@/tracers/old-array/old-array.tracer.tsx";

import styles from "./problem1652.module.css";

export default function Problem1652(): ReactElement {
  const [code, setCode] = useState<string>("[5, 7, 1, 4]");
  const [k, setK] = useState<string>("3");

  const {
    records,
    reset,
    generateCodeItems,
    generateResultItems,
    traceBeforeWeBegin,
    traceSum,
    tracePush,
    traceDone,
  } = useProblem1652();

  const solve = (): void => {
    reset();

    let kNumber = +k;

    const codeItems = generateCodeItems(code);
    const resultItems = generateResultItems(code);
    traceBeforeWeBegin(codeItems, resultItems);

    if (kNumber > 0) {
      let sum = 0;
      for (let i = 1; i <= kNumber; i++) {
        sum += +codeItems[i].value;
      }

      traceSum(codeItems, resultItems, 1, kNumber, 0, sum);

      resultItems[0].value = sum;
      tracePush(codeItems, resultItems, 1, kNumber, 0);

      let start = 1;
      let end = (start + kNumber) % codeItems.length;

      while (start < codeItems.length) {
        sum -= +codeItems[start].value;
        sum += +codeItems[end].value;
        traceSum(
          codeItems,
          resultItems,
          (start + 1) % codeItems.length,
          end,
          start,
          sum,
        );

        resultItems[start].value = sum;
        tracePush(
          codeItems,
          resultItems,
          (start + 1) % codeItems.length,
          end,
          start,
        );

        start++;
        end = (start + kNumber) % codeItems.length;
      }

      traceDone(codeItems, resultItems);
      return;
    }

    if (kNumber < 0) {
      kNumber = -kNumber;

      let sum = 0;
      for (let i = 1; i <= kNumber; i++) {
        sum += +codeItems[codeItems.length - 1 - i].value;
      }

      traceSum(
        codeItems,
        resultItems,
        codeItems.length - 2,
        codeItems.length - 1 - kNumber,
        codeItems.length - 1,
        sum,
        true,
      );

      resultItems[codeItems.length - 1].value = sum;
      tracePush(
        codeItems,
        resultItems,
        codeItems.length - 2,
        codeItems.length - 1 - kNumber,
        codeItems.length - 1,
        true,
      );

      let start = codeItems.length - 2;
      let end = (start - kNumber + codeItems.length) % codeItems.length;

      while (start >= 0) {
        sum -= +codeItems[start].value;
        sum += +codeItems[end].value;
        traceSum(
          codeItems,
          resultItems,
          (start - 1 + codeItems.length) % codeItems.length,
          end,
          start,
          sum,
          true,
        );

        resultItems[start].value = sum;
        tracePush(
          codeItems,
          resultItems,
          (start - 1 + codeItems.length) % codeItems.length,
          end,
          start,
          true,
        );

        start--;
        end = (start - kNumber + codeItems.length) % codeItems.length;
      }

      traceDone(codeItems, resultItems);
      return;
    }

    for (let i = 0; i < codeItems.length; i++) {
      resultItems[i].value = 0;
    }
  };

  useEffect(() => {
    solve();
  }, []);

  return (
    <div className={styles.problem}>
      <FormComponent onSubmit={solve}>
        <NormalInputComponent
          label="code"
          type="text"
          value={code}
          onChange={(e) => setCode(e.currentTarget.value)}
        />
        <NormalInputComponent
          label="k"
          type="text"
          value={k}
          onChange={(e) => setK(e.currentTarget.value)}
        />
        <ButtonComponent variant="primary">Solve</ButtonComponent>
      </FormComponent>
      <BoardComponent layout="two-one">
        <OldArrayTracer records={records.map((x) => x[1])} />
        <OldArrayTracer records={records.map((x) => x[2])} />
        <LogTracer records={records.map((x) => x[0])} />
      </BoardComponent>
    </div>
  );
}
