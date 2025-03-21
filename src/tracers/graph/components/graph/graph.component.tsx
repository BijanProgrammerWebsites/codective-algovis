import {
  MouseEvent,
  ReactElement,
  useContext,
  useReducer,
  useRef,
  useState,
} from "react";

import clsx from "clsx";

import { RendererContext } from "@/context/renderer.context.ts";

import { GraphNode, GraphStructure } from "@/structures/graph.structure.ts";
import { Point } from "@/structures/point.ts";

import { distance } from "@/utils/graph.utils.ts";

import styles from "./graph.module.css";

type Props = {
  graph: GraphStructure;
};

export default function GraphComponent({ graph }: Props): ReactElement {
  const { nodes, edges, isDirected, isWeighted, dimensions } = graph;

  const { center, zoom, toString } = useContext(RendererContext);

  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  const elementRef = useRef<SVGSVGElement>(null);

  const computeCoords = (e: MouseEvent): Point => {
    const svg = elementRef.current!;

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

  const {
    baseWidth,
    baseHeight,
    nodeRadius,
    arrowGap,
    nodeWeightGap,
    edgeWeightGap,
  } = dimensions;

  const viewBox = [
    (center.x - baseWidth / 2) * zoom,
    (center.y - baseHeight / 2) * zoom,
    baseWidth * zoom,
    baseHeight * zoom,
  ].join(" ");

  return (
    <svg
      ref={elementRef}
      className={styles.graph}
      viewBox={viewBox}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <defs>
        <marker
          id="markerArrow"
          markerWidth="4"
          markerHeight="4"
          refX="2"
          refY="2"
          orient="auto"
        >
          <path d="M0,0 L0,4 L4,2 L0,0" className={styles.arrow} />
        </marker>
        <marker
          id="markerArrowSelected"
          markerWidth="4"
          markerHeight="4"
          refX="2"
          refY="2"
          orient="auto"
        >
          <path
            d="M0,0 L0,4 L4,2 L0,0"
            className={clsx(styles.arrow, styles.selected)}
          />
        </marker>
        <marker
          id="markerArrowVisited"
          markerWidth="4"
          markerHeight="4"
          refX="2"
          refY="2"
          orient="auto"
        >
          <path
            d="M0,0 L0,4 L4,2 L0,0"
            className={clsx(styles.arrow, styles.visited)}
          />
        </marker>
      </defs>
      {edges
        .sort((a, b) => a.visitedCount - b.visitedCount)
        .map((edge) => {
          const { source, target, weight, visitedCount, selectedCount } = edge;
          const sourceNode = graph.findNode(source);
          const targetNode = graph.findNode(target);
          if (!sourceNode || !targetNode) return undefined;
          const { x: sx, y: sy } = sourceNode;
          let { x: ex, y: ey } = targetNode;
          const mx = (sx + ex) / 2;
          const my = (sy + ey) / 2;
          const dx = ex - sx;
          const dy = ey - sy;
          const degree = (Math.atan2(dy, dx) / Math.PI) * 180;
          if (isDirected) {
            const length = Math.sqrt(dx * dx + dy * dy);
            if (length !== 0) {
              ex = sx + (dx / length) * (length - nodeRadius - arrowGap);
              ey = sy + (dy / length) * (length - nodeRadius - arrowGap);
            }
          }

          return (
            <g
              className={clsx(
                styles.edge,
                selectedCount && styles.selected,
                visitedCount && styles.visited,
              )}
              key={`${source}-${target}`}
            >
              <path
                d={`M${sx},${sy} L${ex},${ey}`}
                className={clsx(styles.line, isDirected && styles.directed)}
              />
              {isWeighted && (
                <g transform={`translate(${mx},${my})`}>
                  <text
                    className={styles.weight}
                    transform={`rotate(${degree})`}
                    y={-edgeWeightGap}
                  >
                    {toString(weight)}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      {nodes.map((node) => {
        const { id, x, y, weight, visitedCount, selectedCount } = node;
        return (
          <g
            className={clsx(
              styles.node,
              selectedCount && styles.selected,
              visitedCount && styles.visited,
            )}
            key={id}
            transform={`translate(${x},${y})`}
          >
            <circle className={styles.circle} r={nodeRadius} />
            <text className={styles.id}>{id}</text>
            {isWeighted && (
              <text className={styles.weight} x={nodeRadius + nodeWeightGap}>
                {toString(weight)}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
