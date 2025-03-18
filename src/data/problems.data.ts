import { sessionsData } from "@/data/sessions.data.tsx";

import { ProblemType } from "@/types/problem.type.ts";

export const problemsData = new Map<number, ProblemType>(
  sessionsData
    .flatMap((session) => session.problems)
    .map((problem) => [problem.id, problem]),
);
