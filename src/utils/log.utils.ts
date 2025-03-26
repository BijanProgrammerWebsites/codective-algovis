import { ReactNode } from "react";

export function stringify<T extends ReactNode>(
  value: T,
  fallback: string = "",
): string {
  switch (typeof value) {
    case "string":
    case "number":
    case "bigint":
    case "boolean":
      return value.toString();
    case "undefined":
      return "undefined";
    case "object":
      if (value === null) {
        return "null";
      }

      return fallback;
    default:
      return fallback;
  }
}
