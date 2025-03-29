import { ReactElement, useContext } from "react";

import { TracerContext } from "@/context/tracer.context.ts";

import RendererProvider from "@/providers/renderer.provider.tsx";

import { LinkedListRecord } from "@/records/linked-list.record.ts";

import LinkedListRenderer from "@/renderers/linked-list/linked-list.renderer.tsx";

type Props = {
  records: LinkedListRecord[];
};

export default function LinkedListTracer({ records }: Props): ReactElement {
  const { step } = useContext(TracerContext);

  const record = records[step];
  if (!record) {
    return <div>Not Available</div>;
  }

  record.linkedList.layoutCallback();

  return (
    <RendererProvider>
      <LinkedListRenderer linkedList={record.linkedList} />
    </RendererProvider>
  );
}
