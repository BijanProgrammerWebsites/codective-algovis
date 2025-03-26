import { useTracer } from "@/hooks/use-tracer.hook.ts";

import { LogRecord } from "@/records/log.record.ts";
import { MatrixRecord } from "@/records/matrix.record.ts";

import { MatrixStructure } from "@/structures/matrix.structure.ts";

export function useMatrixTracer() {
  const [records, trace, reset] = useTracer<[LogRecord, MatrixRecord]>();

  const traceBeforeWeBegin = (matrix: MatrixStructure): void => {
    trace([{ message: "Before We Begin" }, { matrix }]);
  };

  const traceConsider = (
    matrix: MatrixStructure,
    row: number,
    col: number,
  ): void => {
    const previousStatus = matrix.table[row][col].status;
    matrix.update({ row, col, status: "warning" });
    trace([{ message: `Considering ${row}:${col}` }, { matrix }]);
    matrix.update({ row, col, status: previousStatus });
  };

  const traceCant = (
    matrix: MatrixStructure,
    row: number,
    col: number,
  ): void => {
    const previousStatus = matrix.table[row][col].status;
    matrix.update({ row, col, status: "danger" });
    trace([{ message: `Can't place Q in ${row}:${col}` }, { matrix }]);
    matrix.update({ row, col, status: previousStatus });
  };

  const traceCheck = (
    matrix: MatrixStructure,
    row: number,
    col: number,
  ): void => {
    const previousStatus = matrix.table[row][col].status;
    matrix.update({ row, col, status: "primary" });
    trace([{ message: `Checking ${row}:${col}` }, { matrix }]);
    matrix.update({ row, col, status: previousStatus });
  };

  const tracePass = (
    matrix: MatrixStructure,
    row: number,
    col: number,
  ): void => {
    const previousStatus = matrix.table[row][col].status;
    matrix.update({ row, col, status: "success" });
    trace([{ message: "Pass" }, { matrix }]);
    matrix.update({ row, col, status: previousStatus });
  };

  const traceFail = (
    matrix: MatrixStructure,
    row: number,
    col: number,
  ): void => {
    const previousStatus = matrix.table[row][col].status;
    matrix.update({ row, col, status: "danger" });
    trace([{ message: "Fail" }, { matrix }]);
    matrix.update({ row, col, status: previousStatus });
  };

  const traceAdd = (
    matrix: MatrixStructure,
    row: number,
    col: number,
  ): void => {
    matrix.update({ row, col, status: "primary" });
    trace([{ message: `Add Q to ${row}:${col}` }, { matrix }]);
  };

  const traceRemove = (
    matrix: MatrixStructure,
    row: number,
    col: number,
  ): void => {
    matrix.update({ row, col, status: "default" });
    trace([{ message: `Remove Q from ${row}:${col}` }, { matrix }]);
  };

  const traceAnswer = (matrix: MatrixStructure): void => {
    trace([{ message: "Found an answer" }, { matrix }]);
  };

  return {
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
  };
}
