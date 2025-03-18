import { ReactElement } from "react";

import { useParams } from "react-router";

import { problemsData } from "@/data/problems.data.ts";

import NotFoundPage from "@/pages/not-found/not-found.page.tsx";

import styles from "./problem.module.css";

function ProblemPage(): ReactElement {
  const { id } = useParams();
  if (!id) {
    return <NotFoundPage />;
  }

  const problem = problemsData.get(parseInt(id));
  if (!problem) {
    return <NotFoundPage />;
  }

  return (
    <div className={styles.problem}>
      <h1>
        {problem.id}. {problem.title}
      </h1>
      <div className={styles.content}>{problem.component}</div>
    </div>
  );
}

export default ProblemPage;
