import { DirectedGraph } from "graphology";
import { circular } from "graphology-layout";
import forceAtlas2 from "graphology-layout-forceatlas2";

import { RendererStructure } from "@/structures/renderer.structure.ts";

import { ColorType } from "@/types/color.type.ts";

import { distance } from "@/utils/graph.utils.ts";

export type GraphDimensions = {
  padding: number;
  nodeRadius: number;
  arrowGap: number;
  nodeWeightGap: number;
  edgeWeightGap: number;
  verticalGap: number;
};

export type GraphConfig = {
  dimensions: GraphDimensions;
  isDirected: boolean;
  isWeighted: boolean;
  layoutCallback: () => unknown;
};

export type GraphNode = {
  id: number;
  title?: string;
  weight: number | null;
  x: number;
  y: number;
  color: ColorType;
  visitedCount: number;
  selectedCount: number;
};

export type PartialNode = Partial<GraphNode> & Pick<GraphNode, "id">;

export type GraphEdge = {
  source: number;
  target: number;
  weight: number | null;
  color: ColorType;
  visitedCount: number;
  selectedCount: number;
};

export type PartialEdge = Partial<GraphEdge> &
  Pick<GraphEdge, "source" | "target">;

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
        padding: 40,
        nodeRadius: 20,
        arrowGap: 4,
        nodeWeightGap: 4,
        edgeWeightGap: 4,
        verticalGap: 100,
      },
      layoutCallback: () => {},
      ...config,
    });

    this.isWeighted = config?.isWeighted ?? false;
  }

  public set(array2d: readonly number[][] = []): void {
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
      color: "default",
      visitedCount: 0,
      selectedCount: 0,
      ...partialNode,
    });
  }

  public addEdge(partialEdge: PartialEdge): void {
    super.addEdge({
      weight: null,
      color: "default",
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
    // const vGap = rect.height / maxDepth;
    marked = {};

    const setPositions = (node: GraphNode, h: number, v: number): void => {
      marked[node.id] = true;

      node.x = rect.left + (h + leafsCount[node.id] / 2) * hGap;
      node.y = rect.top + v * this.dimensions.verticalGap;

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

  public layoutForceDirected(): void {
    const graph = new DirectedGraph();

    this.nodes.forEach((node) => graph.addNode(node.id));

    this.edges.forEach((edge) => {
      graph.addEdge(edge.source, edge.target);
    });

    circular(graph, { scale: 200 });
    circular.assign(graph);

    const positions = forceAtlas2(graph, {
      iterations: 50,
      settings: { scalingRatio: 500 },
    });

    this.nodes.forEach((node, i) => {
      node.x = positions[i].x;
      node.y = positions[i].y;
    });
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

  public colorNode(id: number, color: ColorType): ColorType {
    const node = this.findNode(id);

    if (!node) {
      return "default";
    }

    const backup = node.color;
    node.color = color;
    return backup;
  }

  public colorEdge(
    source: number,
    target: number,
    color: ColorType,
  ): ColorType {
    const edge = this.findEdge(source, target);

    if (!edge) {
      return "default";
    }

    const backup = edge.color;
    edge.color = color;
    return backup;
  }

  public colorToNode(
    source: number,
    target: number,
    color: ColorType,
  ): ColorType {
    this.colorEdge(source, target, color);
    return this.colorNode(target, color);
  }
}
