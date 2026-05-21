'use client';

import { useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  MarkerType,
  ConnectionMode,
  ConnectionLineType,
  type Connection,
  type Node,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import TableNode, { type TableData, type Field } from './TableNode';
import RelationEdge from './RelationEdge';
import { shopSchema } from '@/lib/schema';
import { exportToUxf } from '@/lib/exportUxf';
import { Plus, Download, RotateCcw, Trash2, ExternalLink } from 'lucide-react';

const nodeTypes = { tableNode: TableNode };
const edgeTypes = { relation: RelationEdge };

const genId = () => Math.random().toString(36).slice(2, 9);

const defaultEdgeOpts = {
  type: 'relation',
  markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1', width: 18, height: 18 },
  data: { cardinality: '1:N' },
};

const SHOP_POSITIONS: Record<string, { x: number; y: number }> = {
  kategorie:      { x: 50,  y: 80  },
  produkt:        { x: 50,  y: 340 },
  kunde:          { x: 480, y: 80  },
  bestellung:     { x: 480, y: 340 },
  bestellposition:{ x: 760, y: 200 },
};

function buildShopNodes(): Node[] {
  return shopSchema.tables.map(t => ({
    id: t.id,
    type: 'tableNode',
    position: SHOP_POSITIONS[t.id] ?? { x: 0, y: 0 },
    data: {
      name: t.name,
      fields: t.fields.map(f => ({
        id: genId(),
        name: f.name,
        isPK: f.isPK ?? false,
        isFK: f.isFK ?? false,
      })) as Field[],
    } satisfies TableData,
  }));
}

function buildShopEdges(): Edge[] {
  return shopSchema.relationships.map(r => ({
    id: r.id,
    source: r.from,
    target: r.to,
    type: 'relation',
    markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1', width: 18, height: 18 },
    data: { cardinality: r.cardinality ?? 'N:1' },
  }));
}

export default function ERDiagram() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(buildShopNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(buildShopEdges());

  const onConnect = useCallback(
    (conn: Connection) =>
      setEdges(eds => addEdge({ ...conn, ...defaultEdgeOpts }, eds)),
    [setEdges],
  );

  const addTable = () => {
    setNodes(nds => [
      ...nds,
      {
        id: genId(),
        type: 'tableNode',
        position: { x: 100 + Math.random() * 400, y: 100 + Math.random() * 300 },
        data: { name: 'NeueTabelle', fields: [] } satisfies TableData,
      },
    ]);
  };

  const resetExample = () => {
    setNodes(buildShopNodes());
    setEdges(buildShopEdges());
  };

  const clearAll = () => {
    setNodes([]);
    setEdges([]);
  };

  const handleExport = () => {
    const xml = exportToUxf(nodes, edges);
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([xml], { type: 'application/xml' })),
      download: 'datenbankmodell.uxf',
    });
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      defaultEdgeOptions={defaultEdgeOpts}
      connectionMode={ConnectionMode.Loose}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      minZoom={0.2}
      deleteKeyCode="Delete"
      multiSelectionKeyCode="Shift"
      connectionLineStyle={{ stroke: '#6366f1', strokeWidth: 1.5, strokeDasharray: '6 3' }}
      connectionLineType={ConnectionLineType.SmoothStep}
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={24}
        size={1.5}
        color="#e2e8f0"
        style={{ backgroundColor: '#f8fafc' }}
      />
      <Controls className="!rounded-xl !border !border-slate-200 !shadow-lg" />
      <MiniMap
        nodeColor="#a5b4fc"
        maskColor="rgba(248,250,252,0.7)"
        className="!rounded-xl !border !border-slate-200 !shadow-lg"
      />

      <Panel position="top-left" className="flex flex-col gap-2 m-3">
        {/* Actions */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-xl p-3 flex flex-col gap-1.5">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-1 mb-0.5">
            DB Schema Designer
          </p>

          <button
            onClick={addTable}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm shadow-indigo-200"
          >
            <Plus size={15} strokeWidth={2.5} />
            Tabelle hinzufügen
          </button>

          <button
            onClick={resetExample}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition-colors"
          >
            <RotateCcw size={14} />
            Beispiel zurücksetzen
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm shadow-emerald-200"
          >
            <Download size={14} />
            Als .uxf speichern
          </button>

          <div className="h-px bg-slate-100 my-0.5" />

          <button
            onClick={clearAll}
            className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 text-sm font-medium rounded-xl transition-colors"
          >
            <Trash2 size={14} />
            Alles löschen
          </button>
        </div>

        {/* Hints */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/80 shadow-lg px-3 py-2.5 text-[11px] text-slate-500 space-y-1">
          <div className="font-semibold text-slate-600 mb-1">Hinweise</div>
          <div><kbd className="bg-slate-100 px-1.5 rounded text-[10px] font-mono">2×Klick</kbd> Namen bearbeiten</div>
          <div><span className="text-indigo-500 font-bold">●</span> Handle ziehen → Beziehung</div>
          <div><span className="font-bold text-indigo-600">1:N</span> klicken → Kardinalität ändern</div>
          <div><kbd className="bg-slate-100 px-1.5 rounded text-[10px] font-mono">Entf</kbd> Auswahl löschen</div>
        </div>

        {/* About */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/80 shadow-lg px-3 py-2.5">
          <p className="text-[10px] text-slate-400 mb-1">Made by</p>
          <a
            href="https://giorgiodettmar.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Giorgio Dettmar
            <ExternalLink size={11} />
          </a>
        </div>
      </Panel>
    </ReactFlow>
  );
}
