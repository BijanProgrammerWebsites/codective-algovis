import { ReactElement } from "react";

import { useParams } from "react-router";

import { problemsData } from "@/data/problems.data.ts";

import StepperComponent from "@/components/stepper/stepper.component.tsx";

import HugeiconsLinkSquare01 from "@/icons/HugeiconsLinkSquare01.tsx";

import NotFoundPage from "@/pages/not-found/not-found.page.tsx";

import TracerProvider from "@/providers/tracer.provider.tsx";

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
    <TracerProvider>
      <div className={styles.problem}>
        <h1>
          {problem.id}. {problem.title}
          <a href={problem.link} target="_blank">
            <HugeiconsLinkSquare01 />
          </a>
        </h1>
        <StepperComponent className={styles.stepper} />
        <div className={styles.content}>{problem.component}</div>
      </div>
    </TracerProvider>
  );
}

export default ProblemPage;
