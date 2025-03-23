import { ReactElement, useContext, useEffect, useState } from "react";

import BoardComponent from "@/components/board/board.component.tsx";
import { ButtonComponent } from "@/components/button/button.component.tsx";
import FormComponent from "@/components/form/form.component.tsx";
import NormalInputComponent from "@/components/normal-input/normal-input.component.tsx";

import { TracerContext } from "@/context/tracer.context.ts";

import { useTracer } from "@/hooks/use-tracer.hook.ts";

import { ArrayTracerItem } from "@/items/array-tracer.item..ts";
import { LogTracerItem } from "@/items/log-tracer.item..ts";

import ArrayTracer from "@/tracers/array/array.tracer.tsx";
import LogTracer from "@/tracers/log/log.tracer.tsx";

import styles from "./problem125.module.css";

export default function Problem125(): ReactElement {
  const { changeStep, setTotalSteps } = useContext(TracerContext);

  const [arrayItems, traceArray, resetArray] = useTracer<ArrayTracerItem>();
  const [logItems, traceLog, resetLog] = useTracer<LogTracerItem>();

  const [phrase, setPhrase] = useState<string>("radar");

  const solve = (): void => {
    reset();

    const elements: ArrayTracerItem["elements"] = phrase
      .split("")
      .map((character) => ({
        value: character,
        color: "default",
      }));

    trace({ message: "Start", elements });

    let left = 0;
    let right = elements.length - 1;

    while (left <= right) {
      const pointers: ArrayTracerItem["pointers"] = {
        [left]: "left",
        [right]: left === right ? "left & right" : "right",
      };

      elements[left].color = "primary";
      elements[right].color = "primary";
      trace({
        message: `Is ${elements[left].value} equal to ${elements[right].value}?`,
        elements,
        pointers,
      });

      if (elements[left].value !== elements[right].value) {
        elements[left].color = "danger";
        elements[right].color = "danger";
        trace({ message: `No`, elements, pointers });

        trace({ message: "Phrase is not palindrome", elements, pointers });

        return;
      }

      elements[left].color = "success";
      elements[right].color = "success";
      trace({ message: `Yes`, elements, pointers });

      elements[left].color = "disabled";
      elements[right].color = "disabled";

      left++;
      right--;
    }

    trace({ message: "Phrase is palindrome", elements });

    return;
  };

  const reset = (): void => {
    resetArray();
    resetLog();
    changeStep(0);
    setTotalSteps(0);
  };

  const trace = ({
    message,
    elements,
    pointers,
  }: {
    message: LogTracerItem["message"];
    elements: ArrayTracerItem["elements"];
    pointers?: ArrayTracerItem["pointers"];
  }): void => {
    traceArray({ elements, pointers });
    traceLog({ message });
    setTotalSteps((old) => old + 1);
  };

  useEffect(() => {
    solve();
  }, []);

  return (
    <div className={styles.problem}>
      <FormComponent onSubmit={solve}>
        <NormalInputComponent
          label="phrase"
          type="text"
          name="phrase"
          value={phrase}
          onChange={(e) => setPhrase(e.currentTarget.value)}
        />
        <ButtonComponent variant="primary">Solve</ButtonComponent>
      </FormComponent>
      <BoardComponent>
        <ArrayTracer items={arrayItems} />
        <LogTracer items={logItems} />
      </BoardComponent>
    </div>
  );
}
