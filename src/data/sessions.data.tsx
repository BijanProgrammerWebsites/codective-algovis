import Problem27 from "@/problems/27/problem27.tsx";
import Problem28 from "@/problems/28/problem28.tsx";
import Problem75 from "@/problems/75/problem75.tsx";
import Problem94 from "@/problems/94/problem94";
import Problem121 from "@/problems/121/problem121.tsx";
import Problem125 from "@/problems/125/problem125.tsx";

import { SessionType } from "@/types/session.type.ts";

export const sessionsData: SessionType[] = [
  {
    problems: [
      {
        id: 125,
        title: "Valid Palindrome",
        component: <Problem125 />,
        link: "https://leetcode.com/problems/valid-palindrome/description/",
      },
      {
        id: 27,
        title: "Remove Element",
        component: <Problem27 />,
        link: "https://leetcode.com/problems/remove-element/description/",
      },
      {
        id: 28,
        title: "Find the Index of the First Occurrence in a String",
        component: <Problem28 />,
        link: "https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/description/",
      },
      {
        id: 75,
        title: "Sort Colors",
        component: <Problem75 />,
        link: "https://leetcode.com/problems/sort-colors/description/",
      },
      {
        id: 121,
        title: "Best Time to Buy and Sell Stock",
        component: <Problem121 />,
        link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/description/",
      },
    ],
  },
  {
    problems: [
      { id: 94, title: "Graph (Test)", component: <Problem94 />, link: "" },
    ],
  },
];
