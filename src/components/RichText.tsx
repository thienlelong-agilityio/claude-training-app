import type { ReactNode } from 'react';

const TOKEN = /`([^`]+)`|\*\*([^*]+)\*\*/g;

export default function RichText({ text }: { text: string }) {
  const nodes: ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(TOKEN)) {
    const start = m.index ?? 0;
    if (start > last) nodes.push(text.slice(last, start));
    if (m[1] !== undefined) {
      nodes.push(
        <code
          key={`c${i++}`}
          className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-gray-800"
        >
          {m[1]}
        </code>,
      );
    } else {
      nodes.push(<strong key={`b${i++}`}>{m[2]}</strong>);
    }
    last = start + m[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return <>{nodes}</>;
}
