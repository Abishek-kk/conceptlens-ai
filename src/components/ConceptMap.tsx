import {
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import type { GenerateResponse } from "../../shared/generateSchema.js";

type ConceptNodeData = {
  label: string;
  explanation: string;
  isMainTopic: boolean;
  isSelected: boolean;
  isReview: boolean;
};

type ConceptFlowNode = Node<ConceptNodeData, "concept">;

type ConceptNodeProps = NodeProps<ConceptFlowNode>;

const ConceptNode = memo(function ConceptNode({ data }: ConceptNodeProps) {
  const nodeState = data.isReview
    ? "concept-node-review review-pulse"
    : data.isSelected
      ? "concept-node-selected"
      : "concept-node-default";
  const size = data.isMainTopic ? "w-56 px-5 py-4" : "w-48 px-4 py-3";

  return (
    <div
      className={`relative rounded-xl border bg-white text-center shadow-sm ${size} ${nodeState}`}
      title={data.explanation}
    >
      <Handle
        className="!border-stone-300 !bg-white"
        isConnectable={false}
        position={Position.Top}
        type="target"
      />
      {data.isReview && (
        <span className="mb-2 inline-flex rounded-full bg-amber-100 px-2 py-1 text-xs font-bold text-amber-950">
          Review this
        </span>
      )}
      {data.isMainTopic && (
        <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-indigo-700">
          Main topic
        </span>
      )}
      <span className="block text-sm font-semibold leading-5 text-stone-900">
        {data.label}
      </span>
      <Handle
        className="!border-stone-300 !bg-white"
        isConnectable={false}
        position={Position.Bottom}
        type="source"
      />
    </div>
  );
});

const nodeTypes = { concept: ConceptNode };

type ConceptMapProps = {
  conceptMap: GenerateResponse["conceptMap"];
  reviewedNodeIds: string[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
};

function MapCanvas({
  conceptMap,
  reviewedNodeIds,
  selectedNodeId,
  onSelectNode,
}: ConceptMapProps) {
  const { fitView } = useReactFlow();
  const previousReviewIds = useRef(new Set<string>());
  const reviewedIds = useMemo(() => new Set(reviewedNodeIds), [reviewedNodeIds]);
  const positions = useMemo(() => {
    const relatedNodes = conceptMap.nodes.length - 1;

    return new Map(
      conceptMap.nodes.map((node, index) => {
        if (index === 0) {
          return [node.id, { x: 240, y: 170 }];
        }

        const angle = (2 * Math.PI * (index - 1)) / relatedNodes - Math.PI / 2;
        return [
          node.id,
          {
            x: 240 + Math.cos(angle) * 230,
            y: 170 + Math.sin(angle) * 155,
          },
        ];
      }),
    );
  }, [conceptMap.nodes]);
  const nodes = useMemo<ConceptFlowNode[]>(
    () =>
      conceptMap.nodes.map((node, index) => ({
        id: node.id,
        type: "concept",
        position: positions.get(node.id) ?? { x: 0, y: 0 },
        data: {
          label: node.label,
          explanation: node.explanation,
          isMainTopic: index === 0,
          isSelected: selectedNodeId === node.id,
          isReview: reviewedIds.has(node.id),
        },
        className: reviewedIds.has(node.id) ? "review-pulse" : "",
      })),
    [conceptMap.nodes, positions, reviewedIds, selectedNodeId],
  );
  const edges = useMemo<Edge[]>(
    () =>
      conceptMap.edges.map((edge) => ({
        ...edge,
        type: "smoothstep",
        style: { stroke: "#a8a29e", strokeWidth: 1.5 },
      })),
    [conceptMap.edges],
  );
  const [selectedNode, setSelectedNode] = useState(
    conceptMap.nodes.find((node) => node.id === selectedNodeId) ??
      conceptMap.nodes[0],
  );

  useEffect(() => {
    const newlyReviewedId = reviewedNodeIds.find(
      (nodeId) => !previousReviewIds.current.has(nodeId),
    );
    reviewedNodeIds.forEach((nodeId) => previousReviewIds.current.add(nodeId));

    if (newlyReviewedId) {
      requestAnimationFrame(() => {
        void fitView({
          nodes: [{ id: newlyReviewedId }],
          duration: 500,
          padding: 0.7,
        });
      });
    }
  }, [fitView, reviewedNodeIds]);

  useEffect(() => {
    setSelectedNode(
      conceptMap.nodes.find((node) => node.id === selectedNodeId) ??
        conceptMap.nodes[0],
    );
  }, [conceptMap.nodes, selectedNodeId]);

  return (
    <>
      <div className="concept-flow-canvas h-[430px] overflow-hidden rounded-xl border border-stone-200 bg-stone-50 sm:h-[520px] lg:h-[min(70vh,640px)]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          fitViewOptions={{ padding: 0.25 }}
          nodesConnectable={false}
          nodesDraggable={false}
          nodeTypes={nodeTypes}
          onNodeClick={(_, node) => {
            onSelectNode(node.id);
            setSelectedNode(
              conceptMap.nodes.find((concept) => concept.id === node.id) ??
                conceptMap.nodes[0],
            );
          }}
          proOptions={{ hideAttribution: false }}
        >
          <Background
            color="#e7e5e4"
            gap={20}
            size={1}
            variant={BackgroundVariant.Dots}
          />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
      <div
        aria-live="polite"
        className="mt-4 min-h-28 rounded-xl bg-stone-50 p-4"
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
          Explore a concept
        </p>
        {selectedNode && (
          <>
            <h3 className="mt-1 font-semibold text-stone-900">
              {selectedNode.label}
            </h3>
            <p className="mt-1 text-sm leading-6 text-stone-700">
              {selectedNode.explanation}
            </p>
          </>
        )}
      </div>
    </>
  );
}

export function ConceptMap(props: ConceptMapProps) {
  return (
    <section
      aria-labelledby="concept-map-heading"
      className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5"
    >
      <div className="mb-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700">
          See how ideas connect
        </p>
        <h2
          className="mt-1 text-xl font-semibold tracking-tight text-stone-950"
          id="concept-map-heading"
        >
          Concept map
        </h2>
      </div>
      <ReactFlowProvider>
        <MapCanvas {...props} />
      </ReactFlowProvider>
    </section>
  );
}
