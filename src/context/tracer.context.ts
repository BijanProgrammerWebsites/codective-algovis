import { Dispatch, SetStateAction, createContext } from "react";

type TracerContextValue = {
  step: number;
  totalSteps: number;
  previousStep: () => void;
  nextStep: () => void;
  changeStep: (value: number) => void;
  setTotalSteps: Dispatch<SetStateAction<number>>;
};

export const TracerContext = createContext<TracerContextValue>({
  step: 0,
  totalSteps: 0,
  previousStep: () => {},
  nextStep: () => {},
  changeStep: () => {},
  setTotalSteps: () => {},
});
