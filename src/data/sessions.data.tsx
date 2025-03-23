import Problem27 from "@/problems/27/problem27.tsx";
import Problem28 from "@/problems/28/problem28.tsx";
import Problem94 from "@/problems/94/problem94";
import Problem125 from "@/problems/125/problem125.tsx";

import { SessionType } from "@/types/session.type.ts";

export const sessionsData: SessionType[] = [
  {
    problems: [
      { id: 125, title: "Valid Palindrome", component: <Problem125 /> },
      { id: 27, title: "Valid Palindrome", component: <Problem27 /> },
      { id: 28, title: "Valid Palindrome", component: <Problem28 /> },
    ],
  },
  {
    problems: [{ id: 94, title: "Valid Palindrome", component: <Problem94 /> }],
  },
];
