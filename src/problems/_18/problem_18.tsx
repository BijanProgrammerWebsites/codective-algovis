import { ReactElement, useEffect } from "react";

import BoardComponent from "@/components/board/board.component.tsx";
import { ButtonComponent } from "@/components/button/button.component.tsx";
import FormComponent from "@/components/form/form.component.tsx";

import { useTracer } from "@/hooks/use-tracer.hook.ts";

import { BinaryTreeRecord } from "@/records/binary-tree.record.ts";
import { LogRecord } from "@/records/log.record.ts";

import { BinaryTreeStructure } from "@/structures/binary-tree.structure.ts";

import BinaryTreeTracer from "@/tracers/binary-tree/binary-tree.tracer.tsx";
import LogTracer from "@/tracers/log/log.tracer.tsx";

import styles from "./problem_18.module.css";

export default function Problem_18(): ReactElement {
  const [records, trace, reset] = useTracer<[LogRecord, BinaryTreeRecord]>();

  const solve = (): void => {
    reset();

    const binaryTree = new BinaryTreeStructure();
    binaryTree.fromArray([8, 3, 10, 1, 6, null, 14]);
    binaryTree.layoutTree();

    trace([{ message: "Binary Search Tree (BST)" }, { binaryTree }]);

    return;
  };

  useEffect(() => {
    solve();
  }, []);

  return (
    <div className={styles.problem}>
      <FormComponent onSubmit={solve}>
        <ButtonComponent variant="primary" disabled>
          Solve
        </ButtonComponent>
      </FormComponent>
      <BoardComponent>
        <BinaryTreeTracer records={records.map((x) => x[1])} />
        <LogTracer records={records.map((x) => x[0])} />
      </BoardComponent>
    </div>
  );
}
