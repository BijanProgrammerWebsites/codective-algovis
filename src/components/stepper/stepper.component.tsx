import { ReactElement, useContext, useEffect, useRef, useState } from "react";

import clsx from "clsx";

import { ButtonComponent } from "@/components/button/button.component.tsx";

import { TracerContext } from "@/context/tracer.context.ts";

import TdesignChevronLeft from "@/icons/TdesignChevronLeft.tsx";
import TdesignChevronRight from "@/icons/TdesignChevronRight.tsx";
import TdesignPageFirst from "@/icons/TdesignPageFirst.tsx";
import TdesignPageLast from "@/icons/TdesignPageLast.tsx";
import TdesignPause from "@/icons/TdesignPause.tsx";
import TdesignPlay from "@/icons/TdesignPlay.tsx";

import styles from "./stepper.module.css";

const SPEEDS = [1, 1.5, 2] as const;

type Props = {
  className?: string;
};

export default function StepperComponent({ className }: Props): ReactElement {
  const { step, totalSteps, previousStep, nextStep, changeStep } =
    useContext(TracerContext);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedIndex, setSpeedIndex] = useState<number>(0);

  const interval = useRef<NodeJS.Timeout | undefined>(undefined);

  const playOrPause = (): void => {
    setIsPlaying((old) => !old);
  };

  const cycleSpeed = (): void => {
    setSpeedIndex((old) => (old + 1) % SPEEDS.length);
  };

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    interval.current = setInterval(() => {
      if (step >= totalSteps - 1) {
        clearInterval(interval.current);
        setIsPlaying(false);
        return;
      }

      nextStep();
    }, 1000 / SPEEDS[speedIndex]);

    return () => {
      clearInterval(interval.current);
    };
  }, [step, totalSteps, nextStep, isPlaying, speedIndex]);

  return (
    <div className={clsx(styles.stepper, className)}>
      <div className={styles["primary-row"]}>
        <ButtonComponent
          variant="primary"
          shape="solid"
          size="small"
          disabled={isPlaying || totalSteps === 0 || step === 0}
          onClick={() => changeStep(0)}
        >
          <TdesignPageFirst />
        </ButtonComponent>
        <ButtonComponent
          variant="primary"
          shape="solid"
          size="small"
          disabled={isPlaying || totalSteps === 0 || step === 0}
          onClick={() => previousStep()}
        >
          <TdesignChevronLeft />
        </ButtonComponent>
        <ButtonComponent
          variant="primary"
          shape="solid"
          size="small"
          disabled={totalSteps === 0 || step === totalSteps - 1}
          onClick={playOrPause}
        >
          {isPlaying ? <TdesignPause /> : <TdesignPlay />}
        </ButtonComponent>
        <ButtonComponent
          variant="primary"
          shape="solid"
          size="small"
          disabled={isPlaying || totalSteps === 0 || step === totalSteps - 1}
          onClick={() => nextStep()}
        >
          <TdesignChevronRight />
        </ButtonComponent>
        <ButtonComponent
          variant="primary"
          shape="solid"
          size="small"
          disabled={isPlaying || totalSteps === 0 || step === totalSteps - 1}
          onClick={() => changeStep(totalSteps - 1)}
        >
          <TdesignPageLast />
        </ButtonComponent>
      </div>
      <div className={styles["secondary-row"]}>
        <div className={styles.info}>Step: {step}</div>
        <ButtonComponent
          variant="primary"
          shape="outlined"
          size="small"
          onClick={() => cycleSpeed()}
        >
          {SPEEDS[speedIndex]}x
        </ButtonComponent>
      </div>
    </div>
  );
}
