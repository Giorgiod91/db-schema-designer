'use client';

import { memo, useState, useRef, useEffect } from 'react';
import {
  Handle,
  Position,
  type NodeProps,
  type Node,
  useReactFlow,
  ConnectionMode,
} from '@xyflow/react';
import { Trash2, Plus, X } from 'lucide-react';

export interface Field {
  id: string;
  name: string;
  isPK: boolean;
  isFK: boolean;
}

export interface TableData extends Record<string, unknown> {
  name: string;
  fields: Field[];
}

export type TableNodeType = Node<TableData, 'tableNode'>;

const genId = () => Math.random().toString(36).slice(2, 9);

function TableNode({ id, data, selected }: NodeProps<TableNodeType>) {
  const { updateNodeData, deleteElements } = useReactFlow();
  const [editingName, setEditingName] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingName) {
      nameRef.current?.focus();
      nameRef.current?.select();
    }
  }, [editingName]);

  const patchData = (patch: Partial<TableData>) =>
    updateNodeData(id, patch);

  const addField = () => {
    const newField: Field = { id: genId(), name: 'spalte', isPK: false, isFK: false };
    patchData({ fields: [...data.fields, newField] });
    setEditingFieldId(newField.id);
  };

  const removeField = (fid: string) =>
    patchData({ fields: data.fields.filter(f => f.id !== fid) });

  const patchField = (fid: string, patch: Partial<Field>) =>
    patchData({ fields: data.fields.map(f => (f.id === fid ? { ...f, ...patch } : f)) });

  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden select-none transition-all duration-150 ${
        selected
          ? 'shadow-[0_0_0_2px_#6366f1,0_12px_40px_rgba(99,102,241,0.18)]'
          : 'shadow-[0_4px_24px_rgba(0,0,0,0.09)] ring-1 ring-black/[0.06]'
      }`}
      style={{ minWidth: 220 }}
    >
      {/* Handles — all 4 sides, both source + target via ConnectionMode.Loose */}
      {(['Top', 'Right', 'Bottom', 'Left'] as const).map(side => (
        <Handle
          key={side}
          type="source"
          position={Position[side]}
          id={side.toLowerCase()}
          className="!w-3 !h-3 !rounded-full !bg-indigo-500 !border-[2.5px] !border-white !transition-opacity hover:!opacity-100"
          style={{ opacity: selected ? 1 : 0.4 }}
        />
      ))}

      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-600 px-3 py-2.5 flex items-center gap-2">
        {editingName ? (
          <input
            ref={nameRef}
            className="nodrag flex-1 bg-white/20 text-white placeholder-white/50 text-sm font-bold rounded-lg px-2 py-0.5 focus:outline-none focus:bg-white/30 min-w-0"
            value={data.name}
            placeholder="Tabellenname"
            onChange={e => patchData({ name: e.target.value })}
            onBlur={() => setEditingName(false)}
            onKeyDown={e => { if (e.key === 'Enter') setEditingName(false); }}
          />
        ) : (
          <span
            className="flex-1 text-white font-bold text-sm truncate cursor-text"
            onDoubleClick={() => setEditingName(true)}
            title="Doppelklick zum Bearbeiten"
          >
            {data.name || <span className="opacity-50 italic">Tabellenname</span>}
          </span>
        )}
        <button
          className="nodrag shrink-0 rounded-lg p-1 text-white/70 hover:text-white hover:bg-white/20 transition-colors"
          onClick={addField}
          title="Feld hinzufügen"
        >
          <Plus size={14} strokeWidth={2.5} />
        </button>
        <button
          className="nodrag shrink-0 rounded-lg p-1 text-white/60 hover:text-red-200 hover:bg-white/20 transition-colors"
          onClick={() => deleteElements({ nodes: [{ id }] })}
          title="Tabelle löschen"
        >
          <Trash2 size={14} strokeWidth={2.5} />
        </button>
      </div>

      {/* Fields */}
      <div className="divide-y divide-slate-100/80">
        {data.fields.length === 0 && (
          <div className="px-4 py-4 text-[11px] text-slate-400 italic text-center">
            Kein Feld — klick auf&nbsp;+
          </div>
        )}
        {data.fields.map(field => (
          <div
            key={field.id}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 group/row transition-colors ${
              field.isPK ? 'bg-amber-50/70' : 'hover:bg-slate-50/80'
            }`}
          >
            {/* PK badge */}
            <button
              className={`nodrag shrink-0 text-[10px] font-bold px-1.5 py-[2px] rounded-md border transition-all ${
                field.isPK
                  ? 'bg-amber-100 border-amber-300 text-amber-700'
                  : 'border-slate-200 text-slate-300 hover:border-amber-300 hover:text-amber-500'
              }`}
              onClick={() => patchField(field.id, { isPK: !field.isPK })}
              title="Primärschlüssel umschalten"
            >
              PK
            </button>
            {/* FK badge */}
            <button
              className={`nodrag shrink-0 text-[10px] font-bold px-1.5 py-[2px] rounded-md border transition-all ${
                field.isFK
                  ? 'bg-blue-100 border-blue-300 text-blue-700'
                  : 'border-slate-200 text-slate-300 hover:border-blue-300 hover:text-blue-500'
              }`}
              onClick={() => patchField(field.id, { isFK: !field.isFK })}
              title="Fremdschlüssel umschalten"
            >
              FK
            </button>

            {/* Field name */}
            {editingFieldId === field.id ? (
              <input
                autoFocus
                className="nodrag flex-1 text-xs font-mono bg-indigo-50 border border-indigo-300 rounded-lg px-2 py-0.5 focus:outline-none min-w-0"
                value={field.name}
                onChange={e => patchField(field.id, { name: e.target.value })}
                onBlur={() => setEditingFieldId(null)}
                onKeyDown={e => { if (e.key === 'Enter') setEditingFieldId(null); }}
              />
            ) : (
              <span
                className={`flex-1 text-xs font-mono truncate cursor-text min-w-0 ${
                  field.isPK
                    ? 'font-bold text-slate-800 underline underline-offset-2 decoration-amber-400'
                    : 'text-slate-600'
                }`}
                onDoubleClick={() => setEditingFieldId(field.id)}
                title={field.name}
              >
                {field.name || <span className="opacity-40 italic">name</span>}
              </span>
            )}

            <button
              className="nodrag shrink-0 opacity-0 group-hover/row:opacity-100 text-slate-300 hover:text-red-400 transition-all"
              onClick={() => removeField(field.id)}
              title="Feld entfernen"
            >
              <X size={12} strokeWidth={2.5} />
            </button>
          </div>
        ))}
      </div>

      {/* Footer add button */}
      <button
        className="nodrag w-full py-2 text-[11px] text-slate-400 hover:text-indigo-600 hover:bg-indigo-50/80 transition-colors flex items-center justify-center gap-1 border-t border-slate-100"
        onClick={addField}
      >
        <Plus size={10} strokeWidth={3} />
        Feld hinzufügen
      </button>
    </div>
  );
}

export default memo(TableNode);
