import { ReactElement } from "react";

import { Link } from "react-router";

import { sessionsData } from "@/data/sessions.data.tsx";

import styles from "./home.module.css";

function HomePage(): ReactElement {
  return (
    <div className={styles.home}>
      <h1>Home</h1>
      <ul className={styles.sessions}>
        {sessionsData.map((session, sessionIndex) => (
          <li key={sessionIndex}>
            <h2>Session {sessionIndex}</h2>
            <ul className={styles.problems}>
              {session.problems.map((problem, problemIndex) => (
                <Link key={problemIndex} to={`/p/${problem.id}`}>
                  {problem.id}. {problem.title}
                </Link>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HomePage;
