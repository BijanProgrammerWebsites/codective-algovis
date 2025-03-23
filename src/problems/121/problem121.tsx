import { ReactElement, useEffect, useState } from "react";

import BoardComponent from "@/components/board/board.component.tsx";
import { ButtonComponent } from "@/components/button/button.component.tsx";
import FormComponent from "@/components/form/form.component.tsx";
import NormalInputComponent from "@/components/normal-input/normal-input.component.tsx";

import { useProblem121 } from "@/problems/121/use-problem121.ts";

import ArrayTracer from "@/tracers/array/array.tracer.tsx";
import LogTracer from "@/tracers/log/log.tracer.tsx";

import styles from "./problem121.module.css";

export default function Problem121(): ReactElement {
  const [prices, setPrices] = useState<string>(" [7, 1, 5, 3, 6, 4]");

  const {
    records,
    reset,
    generateItems,
    traceBeforeWeBegin,
    traceLowAndHigh,
    traceUpdateMaxProfit,
    traceFoundLowerPrice,
    traceDone,
  } = useProblem121();

  const solve = (): void => {
    reset();

    const items = generateItems(prices);
    traceBeforeWeBegin(items);

    let maxProfit = 0;
    let maxProfitLow = -1;
    let maxProfitHigh = -1;

    let low = 0;
    let high = 1;

    while (high < items.length) {
      traceLowAndHigh(items, low, high);

      const currentProfit = +items[high].value - +items[low].value;
      if (maxProfit < currentProfit) {
        traceUpdateMaxProfit(items, low, high, currentProfit);

        maxProfit = currentProfit;
        maxProfitLow = low;
        maxProfitHigh = high;
      }

      if (items[low].value > items[high].value) {
        traceFoundLowerPrice(items, low, high);
        low = high;
      }

      high++;
    }

    traceDone(items, maxProfitLow, maxProfitHigh, maxProfit);
  };

  useEffect(() => {
    solve();
  }, []);

  return (
    <div className={styles.problem}>
      <FormComponent onSubmit={solve}>
        <NormalInputComponent
          label="prices"
          type="text"
          value={prices}
          onChange={(e) => setPrices(e.currentTarget.value)}
        />
        <ButtonComponent variant="primary">Solve</ButtonComponent>
      </FormComponent>
      <BoardComponent>
        <ArrayTracer records={records.map((x) => x[1])} />
        <LogTracer records={records.map((x) => x[0])} />
      </BoardComponent>
    </div>
  );
}
