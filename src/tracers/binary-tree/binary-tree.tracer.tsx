import { ReactElement, useContext } from "react";

import { TracerContext } from "@/context/tracer.context.ts";

import RendererProvider from "@/providers/renderer.provider.tsx";

import { BinaryTreeRecord } from "@/records/binary-tree.record.ts";

import BinaryTreeRenderer from "@/renderers/binary-tree/binary-tree.renderer.tsx";

type Props = {
  records: BinaryTreeRecord[];
};

export default function BinaryTreeTracer({ records }: Props): ReactElement {
  const { step } = useContext(TracerContext);

  const record = records[step];
  if (!record) {
    return <div>Not Available</div>;
  }

  return (
    <RendererProvider>
      <BinaryTreeRenderer binaryTree={record.binaryTree} />
    </RendererProvider>
  );
}
