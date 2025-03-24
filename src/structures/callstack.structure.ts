import {
  RendererNode,
  RendererStructure,
} from "@/structures/renderer.structure.ts";

export type CallstackDimensions = {
  baseWidth: number;
  baseHeight: number;
  padding: number;
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

  public layoutTree(rootId = 0, shouldSort = false): void {
    this.layoutCallback = () => this.layoutTree(rootId, shouldSort);

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

    const leafsCount: Record<number, number> = {};
    let marked: Record<number, boolean> = {};
    let maxDepth = 0;

    const findLeafsCount = (id: number, depth: number): number => {
      marked[id] = true;
      leafsCount[id] = 0;

      if (maxDepth < depth) {
        maxDepth = depth;
      }

      const linkedNodeIds = this.findLinkedNodeIds(id, false);
      for (const linkedNodeId of linkedNodeIds) {
        if (marked[linkedNodeId]) {
          continue;
        }

        leafsCount[id] += findLeafsCount(linkedNodeId, depth + 1);
      }

      if (leafsCount[id] === 0) {
        leafsCount[id] = 1;
      }

      return leafsCount[id];
    };
    findLeafsCount(rootId, 0);

    const hGap = rect.width / leafsCount[rootId];
    const vGap = rect.height / maxDepth;
    marked = {};

    const setPositions = (node: RendererNode, h: number, v: number): void => {
      marked[node.id] = true;

      node.x = rect.left + (h + leafsCount[node.id] / 2) * hGap;
      node.y = rect.top + v * vGap;

      const linkedNodes = this.findLinkedNodes(node.id, false);
      if (shouldSort) {
        linkedNodes.sort((a, b) => a.id - b.id);
      }

      for (const linkedNode of linkedNodes) {
        if (marked[linkedNode.id]) {
          continue;
        }

        setPositions(linkedNode, h, v + 1);
        h += leafsCount[linkedNode.id];
      }
    };

    setPositions(rootNode, 0, 0);
  }
}
