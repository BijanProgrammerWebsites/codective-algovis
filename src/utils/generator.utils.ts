import { Pointers } from "@/records/array-tracer.record.ts";

export function generatePointers(input: Record<string, number>): Pointers {
  const result: Pointers = {};

  Object.entries(input).forEach((x) => {
    if (!(x[1] in result)) {
      result[x[1]] = [];
    }

    result[x[1]] = [...result[x[1]], x[0]];
  });

  return result;
}
