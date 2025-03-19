import { PropsWithChildren, ReactElement, useState } from "react";

import { TracerContext } from "@/context/tracer.context.ts";

type Props = PropsWithChildren;

function FiltersProvider({ children }: Props): ReactElement {
  const [step, setStep] = useState<number>(0);
  const [totalSteps, setTotalSteps] = useState<number>(0);

  const previousStep = (): void => {
    setStep((old) => old - 1);
  };

  const nextStep = (): void => {
    setStep((old) => old + 1);
  };

  const changeStep = (value: number): void => {
    setStep(value);
  };

  return (
    <TracerContext.Provider
      value={{
        step,
        totalSteps,
        previousStep,
        nextStep,
        changeStep,
        setTotalSteps,
      }}
    >
      {children}
    </TracerContext.Provider>
  );
}

export default FiltersProvider;
