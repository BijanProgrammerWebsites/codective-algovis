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

import styles from "./problem_17.module.css";

export default function Problem_17(): ReactElement {
  const [records, trace, reset] = useTracer<[LogRecord, BinaryTreeRecord]>();

  const solve = (): void => {
    reset();

    const binaryTree = new BinaryTreeStructure();

    // prettier-ignore
    binaryTree.fromArray([0, 1, 2, 3, 4, 5, 6]);
    binaryTree.layoutTree();
    trace([{ message: "Binary Tree" }, { binaryTree }]);

    // prettier-ignore
    binaryTree.fromArray([0, 1, 2, 3, 4, null, null, null, null, 9, 10, null, null, null, null]);
    binaryTree.layoutTree();
    trace([{ message: "Full Binary Tree" }, { binaryTree }]);

    // prettier-ignore
    binaryTree.fromArray([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
    binaryTree.layoutTree();
    trace([{ message: "Perfect Binary Tree" }, { binaryTree }]);

    // prettier-ignore
    binaryTree.fromArray([0, 1, null, null, 4, null, null, null, null, null, 10]);
    binaryTree.layoutTree();
    trace([
      { message: "Degenerate or Pathological Binary Tree" },
      { binaryTree },
    ]);

    // prettier-ignore
    binaryTree.fromArray([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, null, null, null]);
    binaryTree.layoutTree();
    trace([{ message: "Complete Binary Tree" }, { binaryTree }]);

    // prettier-ignore
    binaryTree.fromArray([0, 1, 2, 3, 4, null, null]);
    binaryTree.layoutTree();
    trace([{ message: "Balanced Binary Tree" }, { binaryTree }]);

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
