import {
  RendererNode,
  RendererStructure,
} from "@/structures/renderer.structure.ts";

export type CallstackDimensions = {
  baseWidth: number;
  baseHeight: number;
  padding: number;
  arrowGap: number;
  statementWidth: number;
  statementHeight: number;
  horizontalGap: number;
  verticalGap: number;
};

export type CallstackConfig = {
  dimensions: CallstackDimensions;
  isDirected: boolean;
  layoutCallback: () => unknown;
};

export type CallstackNode = {
  id: number;
  x: number;
  y: number;
  title: string;
  statements: string[];
};

export type CallstackEdge = {
  source: number;
  target: number;
};

type PartialNode = Omit<CallstackNode, "x" | "y"> &
  Partial<Pick<CallstackNode, "x" | "y">>;

type PartialEdge = Partial<CallstackEdge> &
  Pick<CallstackEdge, "source" | "target">;

export class CallstackStructure extends RendererStructure<
  CallstackDimensions,
  CallstackConfig,
  CallstackNode,
  CallstackEdge
> {
  public constructor(config?: Partial<CallstackConfig>) {
    super({
      dimensions: {
        baseWidth: 800,
        baseHeight: 600,
        padding: 40,
        arrowGap: 8,
        statementWidth: 200,
        statementHeight: 40,
        horizontalGap: 240,
        verticalGap: 100,
      },
      layoutCallback: () => this.layoutTree(),
      ...config,
    });
  }

  public addNode(partialNode: PartialNode): void {
    super.addNode({
      x: 0,
      y: 0,
      ...partialNode,
    });
  }

  public addEdge(partialEdge: PartialEdge): void {
    super.addEdge({
      ...partialEdge,
    });
  }

  public layoutTree(rootId = 0): void {
    this.layoutCallback = () => this.layoutTree(rootId);

    const rootNode = this.findNode(rootId);
    if (!rootNode) {
      return;
    }

    const rect = this.getRect();

    const marked: Record<number, boolean> = {};

    const setPositions = (node: RendererNode, depth: number): void => {
      marked[node.id] = true;

      node.x = rect.left + depth * this.dimensions.horizontalGap;
      node.y = rect.top + depth * this.dimensions.verticalGap;

      const linkedNodes = this.findLinkedNodes(node.id, false);

      for (const linkedNode of linkedNodes) {
        if (marked[linkedNode.id]) {
          continue;
        }

        setPositions(linkedNode, depth + 1);
      }
    };

    setPositions(rootNode, 0);
  }
}
