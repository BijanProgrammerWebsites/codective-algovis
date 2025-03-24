import { RendererStructure } from "@/structures/renderer.structure.ts";

import { distance } from "@/utils/graph.utils.ts";

export type GraphDimensions = {
  baseWidth: number;
  baseHeight: number;
  padding: number;
  nodeRadius: number;
  arrowGap: number;
  nodeWeightGap: number;
  edgeWeightGap: number;
};

export type GraphConfig = {
  dimensions: GraphDimensions;
  isDirected: boolean;
  isWeighted: boolean;
  layoutCallback: () => unknown;
};

export type GraphNode = {
  id: number;
  weight: number | null;
  x: number;
  y: number;
  visitedCount: number;
  selectedCount: number;
};

export type PartialNode = Partial<GraphNode> & Pick<GraphNode, "id">;

export type GraphEdge = {
  source: number;
  target: number;
  weight: number | null;
  visitedCount: number;
  selectedCount: number;
};

export type PartialEdge = Partial<GraphEdge> &
  Pick<GraphEdge, "source" | "target">;

export type Rect = {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
};

export class GraphStructure extends RendererStructure<
  GraphDimensions,
  GraphConfig,
  GraphNode,
  GraphEdge
> {
  public readonly isWeighted: GraphConfig["isWeighted"];

  public constructor(config?: Partial<GraphConfig>) {
    super({
      dimensions: {
        baseWidth: 800,
        baseHeight: 600,
        padding: 40,
        nodeRadius: 20,
        arrowGap: 4,
        nodeWeightGap: 4,
        edgeWeightGap: 4,
      },
      layoutCallback: () => this.layoutTree(),
      ...config,
    });

    this.isWeighted = config?.isWeighted ?? false;
  }

  public set(array2d: number[][] = []): void {
    this.nodes = [];
    this.edges = [];

    for (let i = 0; i < array2d.length; i++) {
      this.addNode({ id: i });

      for (let j = 0; j < array2d.length; j++) {
        const value = array2d[i][j];

        if (value) {
          this.addEdge({
            source: i,
            target: j,
            weight: this.isWeighted ? value : null,
          });
        }
      }
    }

    this.layoutCallback();
  }

  public addNode(partialNode: PartialNode): void {
    super.addNode({
      weight: null,
      x: 0,
      y: 0,
      visitedCount: 0,
      selectedCount: 0,
      ...partialNode,
    });
  }

  public addEdge(partialEdge: PartialEdge): void {
    super.addEdge({
      weight: null,
      visitedCount: 0,
      selectedCount: 0,
      ...partialEdge,
    });
  }

  public layoutCircle(): void {
    this.layoutCallback = () => this.layoutCircle();

    const rect = this.getRect();

    const angleStep = (2 * Math.PI) / this.nodes.length;

    let currentAngle = -Math.PI / 2;

    for (const node of this.nodes) {
      node.x = (Math.cos(currentAngle) * rect.width) / 2;
      node.y = (Math.sin(currentAngle) * rect.height) / 2;

      currentAngle += angleStep;
    }
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

    const setPositions = (node: GraphNode, h: number, v: number): void => {
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

  public layoutRandom(): void {
    this.layoutCallback = () => this.layoutRandom();

    const rect = this.getRect();
    const placedNodes: GraphNode[] = [];

    for (const node of this.nodes) {
      do {
        node.x = rect.left + Math.random() * rect.width;
        node.y = rect.top + Math.random() * rect.height;
      } while (
        placedNodes.find((placedNode) => distance(node, placedNode) < 48)
      );

      placedNodes.push(node);
    }
  }

  private visitOrLeave(
    isVisiting: boolean,
    target: number,
    source: number | null = null,
    weight?: number | null,
  ): void {
    const edge = this.findEdge(source!, target);
    if (edge) {
      edge.visitedCount += isVisiting ? 1 : -1;
    }

    const node = this.findNode(target);
    if (node) {
      node.visitedCount += isVisiting ? 1 : -1;

      if (typeof weight === "number") {
        node.weight = weight;
      }
    }
  }

  public visit(
    target: number,
    source: number | null = null,
    weight?: number | null,
  ): void {
    this.visitOrLeave(true, target, source, weight);
  }

  public leave(
    target: number,
    source: number | null = null,
    weight?: number | null,
  ): void {
    this.visitOrLeave(false, target, source, weight);
  }

  private selectOrDeselect(
    isSelecting: boolean,
    target: number,
    source: number | null = null,
  ): void {
    const edge = this.findEdge(source!, target);
    if (edge) {
      edge.selectedCount += isSelecting ? 1 : -1;
    }

    const node = this.findNode(target);
    if (node) {
      node.selectedCount += isSelecting ? 1 : -1;
    }
  }

  public select(target: number, source: number | null = null): void {
    this.selectOrDeselect(true, target, source);
  }

  public deselect(target: number, source: number | null = null): void {
    this.selectOrDeselect(false, target, source);
  }
}
