import { GraphConfig } from "@/structures/graph.structure.ts";

export type RendererDimensions = {
  baseWidth: number;
  baseHeight: number;
  padding: number;
  arrowGap: number;
};

export type RendererConfig<
  Dimensions extends RendererDimensions = RendererDimensions,
> = {
  dimensions: Dimensions;
  isDirected: boolean;
  layoutCallback: () => unknown;
};

export type RendererNode = {
  id: number;
  x: number;
  y: number;
};

export type RendererEdge = {
  source: number;
  target: number;
};

export type Rect = {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
};

type PartialNode<TNode extends RendererNode = RendererNode> = Partial<TNode> &
  Pick<TNode, "id">;

type PartialEdge<TEdge extends RendererEdge> = Partial<TEdge> &
  Pick<TEdge, "source" | "target">;

export class RendererStructure<
  Dimensions extends RendererDimensions = RendererDimensions,
  Config extends RendererConfig<Dimensions> = RendererConfig<Dimensions>,
  Node extends RendererNode = RendererNode,
  Edge extends RendererEdge = RendererEdge,
> {
  public readonly dimensions: Dimensions;
  public readonly isDirected: GraphConfig["isDirected"];
  public layoutCallback: Config["layoutCallback"];

  public nodes: Node[] = [];
  public edges: Edge[] = [];

  public constructor(config: Partial<Config> & Pick<Config, "dimensions">) {
    this.dimensions = config.dimensions;
    this.isDirected = config?.isDirected ?? true;
    this.layoutCallback = config.layoutCallback ?? (() => this.layoutDefault());
  }

  public addNode(node: Node): void {
    const foundNode = this.findNode(node.id);
    if (foundNode) {
      return;
    }

    this.nodes.push(node);

    this.layoutCallback();
  }

  public updateNode(partialNode: PartialNode<Node>): void {
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

  public addEdge(edge: Edge): void {
    const foundEdge = this.findEdge(edge.source, edge.target);
    if (foundEdge) {
      return;
    }

    this.edges.push(edge);

    this.layoutCallback();
  }

  public updateEdge(partialEdge: PartialEdge<Edge>): void {
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

  public findNode(id: number): Node | undefined {
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
  ): Edge | undefined {
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
  ): Edge[] {
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
  ): Node[] {
    const ids = this.findLinkedNodeIds(source, isDirected);
    return ids
      .map((id) => this.findNode(id))
      .filter((node) => node !== undefined);
  }

  protected getRect(): Rect {
    const { baseWidth, baseHeight, padding } = this.dimensions;

    const left = -baseWidth / 2 + padding;
    const top = -baseHeight / 2 + padding;
    const right = baseWidth / 2 - padding;
    const bottom = baseHeight / 2 - padding;
    const width = right - left;
    const height = bottom - top;

    return { left, top, right, bottom, width, height };
  }

  public layoutDefault(): void {
    return;
  }
}
