import { ReactElement, useEffect, useState } from "react";

import BoardComponent from "@/components/board/board.component.tsx";
import { ButtonComponent } from "@/components/button/button.component.tsx";
import FormComponent from "@/components/form/form.component.tsx";
import NormalInputComponent from "@/components/normal-input/normal-input.component.tsx";

import { useMatrixTracer } from "@/hooks/use-matrix-tracer.ts";

import { MatrixStructure } from "@/structures/matrix.structure.ts";

import LogTracer from "@/tracers/log/log.tracer.tsx";
import MatrixTracer from "@/tracers/matrix/matrix.tracer.tsx";

import styles from "./problem51.module.css";

export default function Problem51(): ReactElement {
  const [size, setSize] = useState<string>("4");

  const {
    records,
    reset,
    traceBeforeWeBegin,
    traceConsider,
    traceCant,
    traceCheck,
    tracePass,
    traceFail,
    traceAdd,
    traceRemove,
    traceAnswer,
  } = useMatrixTracer();

  const solve = (): void => {
    reset();

    const n = +size;

    const matrix = new MatrixStructure(n, n);
    traceBeforeWeBegin(matrix);

    function f(row: number): void {
      if (row >= n) {
        traceAnswer(matrix);
        return;
      }

      for (let col = 0; col < n; col++) {
        traceConsider(matrix, row, col);

        if (!isSafe(row, col)) {
          traceCant(matrix, row, col);
          continue;
        }

        matrix.table[row][col].value = "Q";
        traceAdd(matrix, row, col);
        f(row + 1);
        matrix.table[row][col].value = "";
        traceRemove(matrix, row, col);
      }
    }

    function isSafe(row: number, col: number): boolean {
      for (let r = 0; r < row; r++) {
        traceCheck(matrix, r, col);
        if (matrix.table[r][col].value !== "") {
          traceFail(matrix, r, col);
          return false;
        }
        tracePass(matrix, r, col);
      }

      for (let offset = 1; ; offset++) {
        const r = row - offset;
        const c = col - offset;

        if (r < 0 || c < 0) {
          break;
        }

        traceCheck(matrix, r, c);
        if (matrix.table[r][c].value !== "") {
          traceFail(matrix, r, c);
          return false;
        }
        tracePass(matrix, r, c);
      }

      for (let offset = 1; ; offset++) {
        const r = row - offset;
        const c = col + offset;

        if (r < 0 || c >= n) {
          break;
        }

        traceCheck(matrix, r, c);
        if (matrix.table[r][c].value !== "") {
          traceFail(matrix, r, c);
          return false;
        }
        tracePass(matrix, r, c);
      }

      return true;
    }

    f(0);
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
          value={size}
          onChange={(e) => setSize(e.currentTarget.value)}
        />
        <ButtonComponent variant="primary">Solve</ButtonComponent>
      </FormComponent>
      <BoardComponent>
        <MatrixTracer records={records.map((x) => x[1])} />
        <LogTracer records={records.map((x) => x[0])} />
      </BoardComponent>
    </div>
  );
}
