import {
  MouseEvent,
  ReactElement,
  useContext,
  useReducer,
  useRef,
  useState,
} from "react";

import { RendererContext } from "@/context/renderer.context.ts";

import ArrowsRenderer from "@/renderers/arrows/arrows.renderer.tsx";
import BinaryTreeEdgeRenderer from "@/renderers/binary-tree/renderers/binary-tree-edge/binary-tree-edge.renderer.tsx";
import BinaryTreeNodeRenderer from "@/renderers/binary-tree/renderers/binary-tree-node/binary-tree-node.renderer.tsx";

import {
  BinaryTreeNode,
  BinaryTreeStructure,
} from "@/structures/binary-tree.structure.ts";
import { Point } from "@/structures/point.ts";

import { distance } from "@/utils/graph.utils.ts";

import styles from "./binary-tree.module.css";

type Props = {
  binaryTree: BinaryTreeStructure;
};

export default function BinaryTreeRenderer({
  binaryTree,
}: Props): ReactElement {
  const { nodes, edges } = binaryTree;

  const { viewBox } = useContext(RendererContext);

  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const [selectedNode, setSelectedNode] = useState<BinaryTreeNode | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);

  const computeCoords = (e: MouseEvent): Point => {
    const svg = svgRef.current!;

    const s = svg.createSVGPoint();
    s.x = e.clientX;
    s.y = e.clientY;

    const { x, y } = s.matrixTransform(svg.getScreenCTM()?.inverse());
    return { x, y };
  };

  const handleMouseDown = (e: MouseEvent<SVGSVGElement>): void => {
    const coords = computeCoords(e);
    const { nodes, dimensions } = binaryTree;
    const { nodeRadius } = dimensions;

    const nodeOfInterest = nodes.find(
      (node) => distance(coords, node) <= nodeRadius,
    );

    if (!nodeOfInterest) {
      return;
    }

    e.stopPropagation();

    setSelectedNode(nodeOfInterest ?? null);
  };

  const handleMouseMove = (e: MouseEvent<SVGSVGElement>): void => {
    if (!selectedNode) {
      return;
    }

    e.stopPropagation();

    const { x, y } = computeCoords(e);
    binaryTree.updateNode({ id: selectedNode.id, x, y });

    forceUpdate();
  };

  const handleMouseUp = (e: MouseEvent<SVGSVGElement>): void => {
    if (!selectedNode) {
      return;
    }

    e.stopPropagation();

    setSelectedNode(null);
  };

  return (
    <svg
      ref={svgRef}
      className={styles.binaryTree}
      viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <ArrowsRenderer />
      {edges.map((edge) => (
        <BinaryTreeEdgeRenderer
          key={`${edge.source}-${edge.target}`}
          binaryTree={binaryTree}
          edge={edge}
        />
      ))}
      {nodes.map((node) => (
        <BinaryTreeNodeRenderer
          key={node.id}
          binaryTree={binaryTree}
          node={node}
        />
      ))}
    </svg>
  );
}
