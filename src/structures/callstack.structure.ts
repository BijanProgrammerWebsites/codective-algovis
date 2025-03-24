export type Dimensions = {
  baseWidth: number;
  baseHeight: number;
  padding: number;
  nodeRadius: number;
  arrowGap: number;
};

export type Config = {
  dimensions: Dimensions;
};

export type CallstackNode = {
  id: number;
  x: number;
  y: number;
};

export type PartialNode = Partial<CallstackNode> & Pick<CallstackNode, "id">;

export type CallstackEdge = {
  source: number;
  target: number;
};

export type PartialEdge = Partial<CallstackEdge> &
  Pick<CallstackEdge, "source" | "target">;

export type Rect = {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
};

export class CallstackStructure {
  public readonly dimensions: Config["dimensions"] = {
    baseWidth: 800,
    baseHeight: 600,
    padding: 40,
    nodeRadius: 20,
    arrowGap: 4,
  };

  public nodes: CallstackNode[] = [];
  public edges: CallstackEdge[] = [];

  public constructor(config?: Partial<Config>) {
    this.dimensions = config?.dimensions ?? this.dimensions;
  }

  public set(array2d: number[][] = []): void {
    this.nodes = [];
    this.edges = [];

    for (let i = 0; i < array2d.length; i++) {
      this.addNode({ id: i });

      for (let j = 0; j < array2d.length; j++) {
        const value = array2d[i][j];

        if (value) {
          this.addEdge({ source: i, target: j });
        }
      }
    }

    this.applyLayout();
  }

  public addNode(partialNode: PartialNode): void {
    const foundNode = this.findNode(partialNode.id);
    if (foundNode) {
      return;
    }

    const node: CallstackNode = {
      x: 0,
      y: 0,
      ...partialNode,
    };

    this.nodes.push(node);

    this.applyLayout();
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

    this.applyLayout();
  }

  public addEdge(partialEdge: PartialEdge): void {
    const foundEdge = this.findEdge(partialEdge.source, partialEdge.target);
    if (foundEdge) {
      return;
    }

    const edge: CallstackEdge = {
      ...partialEdge,
    };

    this.edges.push(edge);

    this.applyLayout();
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

    this.applyLayout();
  }

  public findNode(id: number): CallstackNode | undefined {
    return this.nodes.find((node) => node.id === id);
  }

  public findNodeIndex(id: number): number {
    const foundNode = this.findNode(id);
    if (!foundNode) {
      return -1;
    }

    return this.nodes.indexOf(foundNode);
  }

  public findEdge(source: number, target: number): CallstackEdge | undefined {
    return this.edges.find(
      (edge) => edge.source === source && edge.target === target,
    );
  }

  public findEdgeIndex(source: number, target: number): number {
    const foundEdge = this.findEdge(source, target);
    if (!foundEdge) {
      return -1;
    }

    return this.edges.indexOf(foundEdge);
  }

  public findLinkedEdges(source: number): CallstackEdge[] {
    return this.edges.filter((edge) => edge.source === source);
  }

  public findLinkedNodeIds(source: number): number[] {
    const edges = this.findLinkedEdges(source);
    return edges.map((edge) =>
      edge.source === source ? edge.target : edge.source,
    );
  }

  public findLinkedNodes(source: number): CallstackNode[] {
    const ids = this.findLinkedNodeIds(source);
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

  public applyLayout(rootId = 0, shouldSort = false): void {
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

    const leafCounts: Record<number, number> = {};
    let marked: Record<number, boolean> = {};
    let maxDepth = 0;

    const recursiveAnalyze = (id: number, depth: number): number => {
      marked[id] = true;
      leafCounts[id] = 0;

      if (maxDepth < depth) {
        maxDepth = depth;
      }

      const linkedNodeIds = this.findLinkedNodeIds(id);
      for (const linkedNodeId of linkedNodeIds) {
        if (marked[linkedNodeId]) {
          continue;
        }

        leafCounts[id] += recursiveAnalyze(linkedNodeId, depth + 1);
      }

      if (leafCounts[id] === 0) {
        leafCounts[id] = 1;
      }

      return leafCounts[id];
    };
    recursiveAnalyze(rootId, 0);

    const hGap = rect.width / leafCounts[rootId];
    const vGap = rect.height / maxDepth;
    marked = {};

    const recursivePosition = (
      node: CallstackNode,
      h: number,
      v: number,
    ): void => {
      marked[node.id] = true;

      node.x = rect.left + (h + leafCounts[node.id] / 2) * hGap;
      node.y = rect.top + v * vGap;

      const linkedNodes = this.findLinkedNodes(node.id);
      if (shouldSort) {
        linkedNodes.sort((a, b) => a.id - b.id);
      }

      for (const linkedNode of linkedNodes) {
        if (marked[linkedNode.id]) {
          continue;
        }

        recursivePosition(linkedNode, h, v + 1);
        h += leafCounts[linkedNode.id];
      }
    };

    recursivePosition(rootNode, 0, 0);
  }
}
