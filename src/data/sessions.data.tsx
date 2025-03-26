import Problem7 from "@/problems/7/problem7.tsx";
import Problem27 from "@/problems/27/problem27.tsx";
import Problem28 from "@/problems/28/problem28.tsx";
import Problem51 from "@/problems/51/problem51.tsx";
import Problem75 from "@/problems/75/problem75.tsx";
import Problem94 from "@/problems/94/problem94.tsx";
import Problem121 from "@/problems/121/problem121.tsx";
import Problem125 from "@/problems/125/problem125.tsx";
import Problem509 from "@/problems/509/problem509.tsx";
import Problem704 from "@/problems/704/problem704.tsx";
import Problem1652 from "@/problems/1652/problem1652.tsx";
import Problem2379 from "@/problems/2379/problem2379.tsx";
import Problem_1 from "@/problems/_1/problem_1.tsx";
import Problem_2 from "@/problems/_2/problem_2.tsx";
import Problem_3 from "@/problems/_3/problem_3.tsx";
import Problem_4 from "@/problems/_4/problem_4.tsx";
import Problem_5 from "@/problems/_5/problem_5.tsx";
import Problem_6 from "@/problems/_6/problem_6.tsx";
import Problem_7 from "@/problems/_7/problem_7.tsx";

import { SessionType } from "@/types/session.type.ts";

export const sessionsData: SessionType[] = [
  {
    problems: [
      { id: 94, title: "Graph (Test)", component: <Problem94 />, link: "" },
    ],
  },
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
      {
        id: 1652,
        title: "Defuse the Bomb",
        component: <Problem1652 />,
        link: "https://leetcode.com/problems/defuse-the-bomb/description/",
      },
      {
        id: 2379,
        title: "Minimum Recolors to Get K Consecutive Black Blocks",
        component: <Problem2379 />,
        link: "https://leetcode.com/problems/minimum-recolors-to-get-k-consecutive-black-blocks/description/",
      },
    ],
  },
  {
    problems: [
      { id: -1, title: "Factorial", component: <Problem_1 />, link: "" },
      {
        id: 509,
        title: "Fibonacci Number",
        component: <Problem509 />,
        link: "https://leetcode.com/problems/fibonacci-number/description/",
      },
      {
        id: 7,
        title: "Reverse Integer",
        component: <Problem7 />,
        link: "https://leetcode.com/problems/reverse-integer/description/",
      },
      { id: -2, title: "Max", component: <Problem_2 />, link: "" },
      {
        id: 51,
        title: "N-Queens",
        component: <Problem51 />,
        link: "https://leetcode.com/problems/n-queens/description/",
      },
    ],
  },
  {
    problems: [
      { id: -3, title: "Linear Search", component: <Problem_3 />, link: "" },
      {
        id: 704,
        title: "Binary Search",
        component: <Problem704 />,
        link: "https://leetcode.com/problems/binary-search/description/",
      },
      { id: -4, title: "Bubble Sort", component: <Problem_4 />, link: "" },
      { id: -5, title: "Selection Sort", component: <Problem_5 />, link: "" },
      { id: -6, title: "Insertion Sort", component: <Problem_6 />, link: "" },
      { id: -7, title: "Merge Sort", component: <Problem_7 />, link: "" },
    ],
  },
];
