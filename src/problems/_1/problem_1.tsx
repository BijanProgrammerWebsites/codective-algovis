import { ReactElement, useEffect, useState } from "react";

import BoardComponent from "@/components/board/board.component.tsx";
import { ButtonComponent } from "@/components/button/button.component.tsx";
import FormComponent from "@/components/form/form.component.tsx";
import NormalInputComponent from "@/components/normal-input/normal-input.component.tsx";

import { useTracer } from "@/hooks/use-tracer.hook.ts";

import { CallstackTracerRecord } from "@/records/callstack-tracer.record.ts";
import { LogTracerRecord } from "@/records/log-tracer.record.ts";

import { CallstackStructure } from "@/structures/callstack.structure.ts";

import CallstackTracer from "@/tracers/callstack/callstack.tracer.tsx";
import LogTracer from "@/tracers/log/log.tracer.tsx";

import styles from "./problem_1.module.css";

export default function Problem_1(): ReactElement {
  const [n, setN] = useState<string>("4");

  const [records, trace, reset] =
    useTracer<[LogTracerRecord, CallstackTracerRecord]>();

  const solve = (): void => {
    reset();

    const callstack = new CallstackStructure();
    callstack.addNode({
      id: 0,
      title: "f(3)",
      statements: ["if(n === 1) return", "return 3 * f(2)"],
    });

    trace([{ message: "Start" }, { callstack }]);

    callstack.addNode({
      id: 1,
      title: "f(2)",
      statements: ["if(n === 1) return", "return 2 * f(1)"],
    });
    callstack.addEdge({ source: 0, target: 1 });
    trace([{ message: "Call 1" }, { callstack }]);

    callstack.addNode({
      id: 2,
      title: "f(1)",
      statements: ["if(n === 1) return"],
    });
    callstack.addEdge({ source: 1, target: 2 });
    trace([{ message: "Call 2" }, { callstack }]);

    callstack.removeNode(2);
    trace([{ message: "Return 2" }, { callstack }]);

    callstack.removeNode(1);
    trace([{ message: "Return 1" }, { callstack }]);

    trace([{ message: "End" }, { callstack }]);

    return;
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
          value={n}
          onChange={(e) => setN(e.currentTarget.value)}
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
