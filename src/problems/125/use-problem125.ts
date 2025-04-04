import { useTracer } from "@/hooks/use-tracer.hook.ts";

import { LogRecord } from "@/records/log.record.ts";
import { Item, OldArrayRecord } from "@/records/old-array.record.ts";

import { generatePointers } from "@/utils/generator.utils.ts";

export function useProblem125() {
  const [records, trace, reset] = useTracer<[LogRecord, OldArrayRecord]>();

  const generateItems = (phrase: string): Item[] => {
    function normalize(s: string): string {
      let text = "";

      for (let i = 0; i < s.length; i++) {
        const character = s[i].toLowerCase();

        if (isAlphanumeric(character)) {
          text += character;
        }
      }

      return text;
    }

    function isAlphanumeric(character: string): boolean {
      const code = character.charCodeAt(0);
      return (
        (48 <= code && code <= 57) ||
        (65 <= code && code <= 90) ||
        (97 <= code && code <= 122)
      );
    }

    return normalize(phrase)
      .split("")
      .map((character, index) => ({
        id: index.toString(),
        value: character,
        color: "default",
      }));
  };

  const traceBeforeWeBegin = (items: Item[]): void => {
    trace([{ message: "Before We Begin" }, { items }]);
  };

  const traceCheck = (items: Item[], left: number, right: number): void => {
    const pointers = generatePointers({ left, right });

    items[left].color = "primary";
    items[right].color = "primary";
    trace([
      {
        message: `Is ${items[left].value} equal to ${items[right].value}?`,
      },
      { items, pointers },
    ]);
  };

  const traceNo = (items: Item[], left: number, right: number): void => {
    const pointers = generatePointers({ left, right });

    items[left].color = "danger";
    items[right].color = "danger";
    trace([{ message: `No` }, { items, pointers }]);

    trace([{ message: "Phrase is not palindrome" }, { items, pointers }]);
  };

  const traceYes = (items: Item[], left: number, right: number): void => {
    const pointers = generatePointers({ left, right });

    items[left].color = "success";
    items[right].color = "success";
    trace([{ message: `Yes` }, { items, pointers }]);

    items[left].color = "disabled";
    items[right].color = "disabled";
  };

  const traceIsPalindrome = (items: Item[]): void => {
    trace([{ message: "Phrase is palindrome" }, { items }]);
  };

  return {
    records,
    reset,
    generateItems,
    traceBeforeWeBegin,
    traceCheck,
    traceNo,
    traceYes,
    traceIsPalindrome,
  };
}
