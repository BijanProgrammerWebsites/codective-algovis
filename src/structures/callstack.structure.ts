import {
  RendererNode,
  RendererStructure,
} from "@/structures/renderer.structure.ts";

export type CallstackDimensions = {
  baseWidth: number;
  baseHeight: number;
  padding: number;
  arrowGap: number;
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
};

export type CallstackEdge = {
  source: number;
  target: number;
};

type PartialNode = Partial<CallstackNode> & Pick<CallstackNode, "id">;

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
        arrowGap: 4,
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

    if (this.nodes.length === 1) {
      const [node] = this.nodes;
      node.x = (rect.left + rect.right) / 2;
      node.y = (rect.top + rect.bottom) / 2;
      return;
    }

    let marked: Record<number, boolean> = {};
    let maxDepth = 0;

    const findMaxDepth = (id: number, depth: number): void => {
      marked[id] = true;

      if (maxDepth < depth) {
        maxDepth = depth;
      }

      const linkedNodeIds = this.findLinkedNodeIds(id, false);
      for (const linkedNodeId of linkedNodeIds) {
        if (marked[linkedNodeId]) {
          continue;
        }

        findMaxDepth(linkedNodeId, depth + 1);
      }
    };
    findMaxDepth(rootId, 0);

    const hGap = rect.width / maxDepth;
    const vGap = rect.height / maxDepth;
    marked = {};

    const setPositions = (node: RendererNode, depth: number): void => {
      marked[node.id] = true;

      node.x = rect.left + depth * hGap;
      node.y = rect.top + depth * vGap;

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
