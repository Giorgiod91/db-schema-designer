'use client';

import { memo } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  useReactFlow,
  type EdgeProps,
} from '@xyflow/react';

const CARDINALITIES = ['1:1', '1:N', 'N:1', 'N:M'];

export default memo(function RelationEdge({
  id,
  sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition,
  data, selected,
  markerEnd,
}: EdgeProps) {
  const { updateEdgeData } = useReactFlow();
  const cardinality = (data?.cardinality as string) ?? '1:N';

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX, sourceY, targetX, targetY,
    sourcePosition, targetPosition,
    borderRadius: 12,
  });

  const cycle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = CARDINALITIES[(CARDINALITIES.indexOf(cardinality) + 1) % CARDINALITIES.length];
    updateEdgeData(id, { cardinality: next });
  };

  const color = selected ? '#6366f1' : '#94a3b8';

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{ stroke: color, strokeWidth: selected ? 2 : 1.5, transition: 'stroke 0.15s' }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            transform: `translate(-50%,-50%) translate(${labelX}px,${labelY}px)`,
            position: 'absolute',
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <button
            onClick={cycle}
            title="Klick: Kardinalität wechseln"
            className={`px-2 py-0.5 rounded-full text-[11px] font-bold font-mono border shadow-sm transition-all ${
              selected
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-indigo-200'
                : 'bg-white border-slate-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 hover:shadow'
            }`}
          >
            {cardinality}
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
});
