import { Point } from "@/structures/point.ts";

const POSITIVE_INFINITIES = [
  Number.POSITIVE_INFINITY,
  Number.MAX_SAFE_INTEGER,
  0x7fffffff,
] as const;

const NEGATIVE_INFINITIES = [
  Number.NEGATIVE_INFINITY,
  Number.MIN_SAFE_INTEGER,
  -0x80000000,
] as const;

export function distance(a: Point, b: Point): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function stringify<T>(value: T): string | T {
  switch (typeof value) {
    case "number":
      if (POSITIVE_INFINITIES.includes(value)) {
        return "∞";
      }

      if (NEGATIVE_INFINITIES.includes(value)) {
        return "-∞";
      }

      if (Number.isInteger(value)) {
        return value.toString();
      }

      return value.toFixed(3);
    case "boolean":
      return value ? "T" : "F";
    default:
      return value;
  }
}
