import type { Node, Edge } from '@xyflow/react';
import type { TableData } from '@/components/TableNode';

function escapeXml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const NODE_W = 200;
const FIELD_H = 22;
const HEADER_H = 36;
const FOOTER_H = 30;

function nodeHeight(data: TableData) {
  return Math.max(80, HEADER_H + data.fields.length * FIELD_H + FOOTER_H);
}

function nodeCenter(node: Node) {
  const data = node.data as TableData;
  return {
    x: Math.round(node.position.x + NODE_W / 2),
    y: Math.round(node.position.y + nodeHeight(data) / 2),
  };
}

function cardinalityToUmlet(card: string): string {
  const [m1, m2] = card.split(':');
  const lines = ['lt=-&gt;'];
  if (m1) lines.push(`m1=${m1}`);
  if (m2) lines.push(`m2=${m2}`);
  return lines.join('\n');
}

export function exportToUxf(nodes: Node[], edges: Edge[]): string {
  const classElements = nodes.map(node => {
    const data = node.data as TableData;
    const x = Math.round(node.position.x);
    const y = Math.round(node.position.y);
    const h = nodeHeight(data);

    let attrs = escapeXml(data.name) + '\n--\n';
    for (const f of data.fields) {
      const prefix =
        f.isPK && f.isFK ? 'PK/FK ' : f.isPK ? 'PK ' : f.isFK ? 'FK ' : '';
      attrs += `${prefix}${escapeXml(f.name)}\n`;
    }

    return `  <element>
    <id>UMLClass</id>
    <coordinates><x>${x}</x><y>${y}</y><w>${NODE_W}</w><h>${h}</h></coordinates>
    <panel_attributes>${attrs.trimEnd()}</panel_attributes>
    <additional_attributes/>
  </element>`;
  });

  const relationElements = edges.flatMap(edge => {
    const src = nodes.find(n => n.id === edge.source);
    const tgt = nodes.find(n => n.id === edge.target);
    if (!src || !tgt) return [];

    const sc = nodeCenter(src);
    const tc = nodeCenter(tgt);
    const pad = 15;
    const bx = Math.min(sc.x, tc.x) - pad;
    const by = Math.min(sc.y, tc.y) - pad;
    const bw = Math.max(Math.abs(sc.x - tc.x) + pad * 2, 30);
    const bh = Math.max(Math.abs(sc.y - tc.y) + pad * 2, 30);

    const cardinality = (edge.data as { cardinality?: string })?.cardinality ?? '1:N';
    const panelAttrs = cardinalityToUmlet(cardinality);

    return [`  <element>
    <id>Relation</id>
    <coordinates><x>${bx}</x><y>${by}</y><w>${bw}</w><h>${bh}</h></coordinates>
    <panel_attributes>${panelAttrs}</panel_attributes>
    <additional_attributes>${sc.x - bx};${sc.y - by};${tc.x - bx};${tc.y - by}</additional_attributes>
  </element>`];
  });

  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<diagram program="umlet" version="15.1">
  <zoom_level>10</zoom_level>
${[...classElements, ...relationElements].join('\n')}
</diagram>`;
}
