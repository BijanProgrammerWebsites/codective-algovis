import Problem94 from "@/problems/94/problem94";
import Problem125 from "@/problems/125/problem125.tsx";

import { SessionType } from "@/types/session.type.ts";

export const sessionsData: SessionType[] = [
  {
    problems: [
      { id: 125, title: "Valid Palindrome", component: <Problem125 /> },
    ],
  },
  {
    problems: [{ id: 94, title: "Valid Palindrome", component: <Problem94 /> }],
  },
];
