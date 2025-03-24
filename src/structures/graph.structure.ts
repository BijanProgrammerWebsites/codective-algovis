import { distance } from "@/utils/graph.utils.ts";

export type Dimensions = {
  baseWidth: number;
  baseHeight: number;
  padding: number;
  nodeRadius: number;
  arrowGap: number;
  nodeWeightGap: number;
  edgeWeightGap: number;
};

export type Config = {
  dimensions: Dimensions;
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

export class GraphStructure {
  public readonly dimensions: Config["dimensions"] = {
    baseWidth: 800,
    baseHeight: 600,
    padding: 40,
    nodeRadius: 20,
    arrowGap: 4,
    nodeWeightGap: 4,
    edgeWeightGap: 4,
  };
  public readonly isDirected: Config["isDirected"] = true;
  public readonly isWeighted: Config["isWeighted"] = false;
  public layoutCallback: Config["layoutCallback"] = () => this.layoutCircle();

  public nodes: GraphNode[] = [];
  public edges: GraphEdge[] = [];

  public constructor(config?: Partial<Config>) {
    this.dimensions = config?.dimensions ?? this.dimensions;
    this.isDirected = config?.isDirected ?? this.isDirected;
    this.isWeighted = config?.isWeighted ?? this.isWeighted;
    this.layoutCallback = config?.layoutCallback ?? this.layoutCallback;
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
    const foundNode = this.findNode(partialNode.id);
    if (foundNode) {
      return;
    }

    const node: GraphNode = {
      weight: null,
      x: 0,
      y: 0,
      visitedCount: 0,
      selectedCount: 0,
      ...partialNode,
    };

    this.nodes.push(node);

    this.layoutCallback();
  }

  public updateNode(partialNode: PartialNode): void {
    const foundIndex = this.findNodeIndex(partialNode.id);
    if (foundIndex === -1) {
      return;
    }

    this.nodes[foundIndex] = {
      ...this.nodes[foundIndex],
      ...partialNode,
    };
  }

  public removeNode(id: number): void {
    const foundIndex = this.findNodeIndex(id);
    if (foundIndex === -1) {
      return;
    }

    this.nodes.splice(foundIndex, 1);

    this.layoutCallback();
  }

  public addEdge(partialEdge: PartialEdge): void {
    const foundEdge = this.findEdge(partialEdge.source, partialEdge.target);
    if (foundEdge) {
      return;
    }

    const edge: GraphEdge = {
      weight: null,
      visitedCount: 0,
      selectedCount: 0,
      ...partialEdge,
    };

    this.edges.push(edge);

    this.layoutCallback();
  }

  public updateEdge(partialEdge: PartialEdge): void {
    const foundIndex = this.findEdgeIndex(
      partialEdge.source,
      partialEdge.target,
    );
    if (foundIndex === -1) {
      return;
    }

    this.edges[foundIndex] = {
      ...this.edges[foundIndex],
      ...partialEdge,
    };
  }

  public removeEdge(source: number, target: number): void {
    const foundIndex = this.findEdgeIndex(source, target);
    if (foundIndex === -1) {
      return;
    }

    this.edges.splice(foundIndex, 1);

    this.layoutCallback();
  }

  public findNode(id: number): GraphNode | undefined {
    return this.nodes.find((node) => node.id === id);
  }

  public findNodeIndex(id: number): number {
    const foundNode = this.findNode(id);
    if (!foundNode) {
      return -1;
    }

    return this.nodes.indexOf(foundNode);
  }

  public findEdge(
    source: number,
    target: number,
    isDirected: boolean = this.isDirected,
  ): GraphEdge | undefined {
    if (isDirected) {
      return this.edges.find(
        (edge) => edge.source === source && edge.target === target,
      );
    }

    return this.edges.find(
      (edge) =>
        (edge.source === source && edge.target === target) ||
        (edge.source === target && edge.target === source),
    );
  }

  public findEdgeIndex(
    source: number,
    target: number,
    isDirected: boolean = this.isDirected,
  ): number {
    const foundEdge = this.findEdge(source, target, isDirected);
    if (!foundEdge) {
      return -1;
    }

    return this.edges.indexOf(foundEdge);
  }

  public findLinkedEdges(
    source: number,
    isDirected: boolean = this.isDirected,
  ): GraphEdge[] {
    if (isDirected) {
      return this.edges.filter((edge) => edge.source === source);
    }

    return this.edges.filter(
      (edge) => edge.source === source || edge.target === source,
    );
  }

  public findLinkedNodeIds(
    source: number,
    isDirected: boolean = this.isDirected,
  ): number[] {
    const edges = this.findLinkedEdges(source, isDirected);
    return edges.map((edge) =>
      edge.source === source ? edge.target : edge.source,
    );
  }

  public findLinkedNodes(
    source: number,
    isDirected: boolean = this.isDirected,
  ): GraphNode[] {
    const ids = this.findLinkedNodeIds(source, isDirected);
    return ids
      .map((id) => this.findNode(id))
      .filter((node) => node !== undefined);
  }

  private getRect(): Rect {
    const { baseWidth, baseHeight, padding } = this.dimensions;

    const left = -baseWidth / 2 + padding;
    const top = -baseHeight / 2 + padding;
    const right = baseWidth / 2 - padding;
    const bottom = baseHeight / 2 - padding;
    const width = right - left;
    const height = bottom - top;

    return { left, top, right, bottom, width, height };
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
