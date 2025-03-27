import { Point } from "@/structures/point.ts";
import { RendererStructure } from "@/structures/renderer.structure.ts";

import { ColorType } from "@/types/color.type.ts";

export type LinkedListDimensions = {
  padding: number;
  arrowGap: number;
  nodeWidth: number;
  nodeHeight: number;
  horizontalGap: number;
  verticalGap: number;
};

export type LinkedListConfig = {
  dimensions: LinkedListDimensions;
  isDirected: boolean;
  layoutCallback: () => unknown;
};

export type LinkedListNode = {
  id: number;
  x: number;
  y: number;
  offsetY: number;
  data: number | null;
  color: ColorType;
};

export type LinkedListEdge = {
  source: number;
  target: number;
};

type PartialNode = Omit<LinkedListNode, "x" | "y" | "offsetY" | "color"> &
  Partial<Pick<LinkedListNode, "x" | "y" | "offsetY" | "color">>;

type PartialEdge = Partial<LinkedListEdge> &
  Pick<LinkedListEdge, "source" | "target">;

export type Position = "top" | "left" | "bottom" | "right";

type LinkedListPointers = Record<string, { index: number; position: Position }>;
export type LinkedListPointerNode = {
  index: number;
  title: string;
  x: number;
  y: number;
  position: Position;
  arrow: "inside" | "outside";
};

export class LinkedListStructure extends RendererStructure<
  LinkedListDimensions,
  LinkedListConfig,
  LinkedListNode,
  LinkedListEdge
> {
  public pointerNodes: LinkedListPointerNode[] = [];

  private pointers: LinkedListPointers = {};
  private availableId: number = 0;

  public constructor(items: number[], config?: Partial<LinkedListConfig>) {
    super({
      dimensions: {
        padding: 40,
        arrowGap: 8,
        nodeWidth: 50,
        nodeHeight: 50,
        horizontalGap: 50,
        verticalGap: 50,
      },
      layoutCallback: () => this.layoutRow(),
      ...config,
    });

    this.init(items);
  }

  private init(items: number[]): void {
    for (let i = 0; i < items.length; i++) {
      this.addNode({
        id: this.availableId,
        x: 0,
        y: 0,
        offsetY: 0,
        data: items[i],
        color: "default",
      });

      if (i !== 0) {
        this.addEdge({
          source: this.availableId - 1,
          target: this.availableId,
        });
      }

      this.availableId++;
    }

    this.pointers = {
      head: { index: 0, position: "top" },
      null: { index: items.length - 1, position: "right" },
    };

    this.layoutCallback();
  }

  public addNode(partialNode: PartialNode): void {
    super.addNode({
      x: 0,
      y: 0,
      offsetY: 0,
      color: "default",
      ...partialNode,
    });
  }

  public addEdge(partialEdge: PartialEdge): void {
    super.addEdge({
      ...partialEdge,
    });
  }

  public findNodeByIndex(index: number): LinkedListNode {
    return this.nodes[index];
  }

  public layoutRow(rootId = 0): void {
    this.layoutCallback = () => this.layoutRow(rootId);

    const rootNode = this.findNode(rootId);
    if (!rootNode) {
      return;
    }

    const { nodeWidth, horizontalGap, verticalGap } = this.dimensions;

    const rect = this.getRect();

    this.nodes.forEach((node, i) => {
      node.x = rect.left + i * (nodeWidth + horizontalGap);
      node.y = rect.top + node.offsetY + verticalGap;
    });

    this.pointerNodes = Object.entries(this.pointers).map(
      ([title, pointer]) => {
        return {
          index: pointer.index,
          title,
          ...this.positionToCoords(this.nodes[pointer.index], pointer.position),
          position: pointer.position,
          arrow: title === "null" ? "inside" : "outside",
        };
      },
    );
  }

  private positionToCoords(node: LinkedListNode, position: Position): Point {
    const { nodeWidth, nodeHeight, horizontalGap, verticalGap } =
      this.dimensions;

    switch (position) {
      case "top":
        return {
          x: node.x,
          y: node.y - (nodeHeight + verticalGap),
        };
      case "bottom":
        return {
          x: node.x,
          y: node.y + (nodeHeight + verticalGap),
        };
      case "left":
        return {
          x: node.x - (nodeWidth + horizontalGap),
          y: node.y,
        };
      case "right":
        return {
          x: node.x + (nodeWidth + horizontalGap),
          y: node.y,
        };
    }

    throw new Error("Invalid Position");
  }
}
