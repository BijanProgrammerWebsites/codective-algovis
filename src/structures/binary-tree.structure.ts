import { RendererStructure } from "@/structures/renderer.structure.ts";

import { ColorType } from "@/types/color.type.ts";

export type BinaryTreeDimensions = {
  padding: number;
  nodeRadius: number;
  arrowGap: number;
  horizontalGap: number;
  verticalGap: number;
};

export type BinaryTreeConfig = {
  dimensions: BinaryTreeDimensions;
  isDirected: boolean;
  layoutCallback: () => unknown;
};

export type BinaryTreeNode = {
  id: number;
  value: number;
  left: BinaryTreeNode | null;
  right: BinaryTreeNode | null;
  x: number;
  y: number;
  color: ColorType;
};

export type PartialNode = Partial<BinaryTreeNode> &
  Pick<BinaryTreeNode, "id" | "value">;

export type BinaryTreeEdge = {
  source: number;
  target: number;
  color: ColorType;
};

export type PartialEdge = Partial<BinaryTreeEdge> &
  Pick<BinaryTreeEdge, "source" | "target">;

export class BinaryTreeStructure extends RendererStructure<
  BinaryTreeDimensions,
  BinaryTreeConfig,
  BinaryTreeNode,
  BinaryTreeEdge
> {
  public constructor(config?: Partial<BinaryTreeConfig>) {
    super({
      dimensions: {
        padding: 40,
        nodeRadius: 20,
        arrowGap: 4,
        horizontalGap: 40,
        verticalGap: 100,
      },
      isDirected: true,
      layoutCallback: () => this.layoutTree(),
      ...config,
    });
  }

  public fromArray(values: (number | null)[]): void {
    this.nodes = [];
    this.edges = [];

    if (values.length === 0) {
      return;
    }

    const nodes: (BinaryTreeNode | null)[] = values.map((value, index) => {
      if (value === null) {
        return null;
      }

      return {
        id: index,
        value,
        left: null,
        right: null,
        x: 0,
        y: 0,
        color: "default",
      };
    });

    nodes.forEach((node, i) => {
      if (i === 0 || node === null) {
        return;
      }

      const parentIndex = Math.floor((i - 1) / 2);
      const parent = nodes[parentIndex]!;

      if (i / 2 === 1) {
        parent.left = node;
        this.addEdge({ source: parentIndex, target: i });
      } else {
        parent.right = node;
        this.addEdge({ source: parentIndex, target: i });
      }
    });

    this.nodes = nodes.filter((node) => node !== null);

    this.layoutCallback();
  }

  public addNode(partialNode: PartialNode): void {
    super.addNode({
      x: 0,
      y: 0,
      color: "default",
      ...partialNode,
      left: partialNode.left ?? null,
      right: partialNode.right ?? null,
    });
  }

  public addEdge(partialEdge: PartialEdge): void {
    super.addEdge({
      color: "default",
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

    let maxDepth = 0;

    const findMaxDepth = (id: number, depth: number): void => {
      const node = this.findNode(id);
      if (!node) {
        return;
      }

      if (maxDepth < depth) {
        maxDepth = depth;
      }

      findMaxDepth(2 * id + 1, depth + 1);
      findMaxDepth(2 * id + 2, depth + 1);
    };
    findMaxDepth(rootId, 0);

    const setPositions = (id: number, h: number, v: number): void => {
      const node = this.findNode(id);
      if (!node) {
        return;
      }

      node.x = rect.left + h * this.dimensions.horizontalGap;
      node.y = rect.top + v * this.dimensions.verticalGap;

      const offset = Math.pow(2, maxDepth - v - 1);

      setPositions(2 * id + 1, h - offset, v + 1);
      setPositions(2 * id + 2, h + offset, v + 1);
    };

    const totalPositions = Math.pow(2, maxDepth + 1) - 1;
    const rootPosition = Math.floor(totalPositions / 2);
    setPositions(rootId, rootPosition, 0);
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
