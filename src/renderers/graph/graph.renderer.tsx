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
import GraphEdgeRenderer from "@/renderers/graph/renderers/graph-edge/graph-edge.renderer.tsx";
import GraphNodeRenderer from "@/renderers/graph/renderers/graph-node/graph-node.renderer.tsx";

import { GraphNode, GraphStructure } from "@/structures/graph.structure.ts";
import { Point } from "@/structures/point.ts";

import { distance } from "@/utils/graph.utils.ts";

import styles from "./graph.module.css";

type Props = {
  graph: GraphStructure;
};

export default function GraphRenderer({ graph }: Props): ReactElement {
  const { nodes, edges, dimensions } = graph;

  const { center, zoom } = useContext(RendererContext);

  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

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
    const { nodes, dimensions } = graph;
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
    graph.updateNode({ id: selectedNode.id, x, y });

    forceUpdate();
  };

  const handleMouseUp = (e: MouseEvent<SVGSVGElement>): void => {
    if (!selectedNode) {
      return;
    }

    e.stopPropagation();

    setSelectedNode(null);
  };

  const { baseWidth, baseHeight } = dimensions;

  const viewBox = [
    (center.x - baseWidth / 2) * zoom,
    (center.y - baseHeight / 2) * zoom,
    baseWidth * zoom,
    baseHeight * zoom,
  ].join(" ");

  return (
    <svg
      ref={svgRef}
      className={styles.graph}
      viewBox={viewBox}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <ArrowsRenderer />
      {edges.map((edge) => (
        <GraphEdgeRenderer
          key={`${edge.source}-${edge.target}`}
          graph={graph}
          edge={edge}
        />
      ))}
      {nodes.map((node) => (
        <GraphNodeRenderer key={node.id} graph={graph} node={node} />
      ))}
    </svg>
  );
}
