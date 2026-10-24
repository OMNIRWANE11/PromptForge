import React from 'react';

export default function DiffViewer({ diff = [] }) {
  if (!diff || diff.length === 0) {
    return <div className="text-xs text-slate-500 py-3 text-center">No diff available</div>;
  }

  return (
    <div className="font-mono text-xs rounded-lg bg-slate-950 p-3 max-h-72 overflow-y-auto border border-slate-800">
      <div className="flex items-center gap-4 text-[11px] text-slate-400 pb-2 border-b border-slate-800 mb-2">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-emerald-500/20 border border-emerald-500/60 inline-block"></span>
          <span>Added / Optimized Directives</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-rose-500/20 border border-rose-500/60 inline-block"></span>
          <span>Removed Fluff & Redundancies</span>
        </span>
      </div>
      <div className="space-y-0.5">
        {diff.map((block, idx) => {
          if (block.type === 'removed') {
            return (
              <div
                key={idx}
                className="bg-rose-950/40 text-rose-300 border-l-2 border-rose-500 px-2 py-0.5 whitespace-pre-wrap break-all"
              >
                <span className="select-none text-rose-500 font-bold mr-2">-</span>
                {block.text || ' '}
              </div>
            );
          } else if (block.type === 'added') {
            return (
              <div
                key={idx}
                className="bg-emerald-950/40 text-emerald-300 border-l-2 border-emerald-500 px-2 py-0.5 whitespace-pre-wrap break-all"
              >
                <span className="select-none text-emerald-500 font-bold mr-2">+</span>
                {block.text || ' '}
              </div>
            );
          } else {
            return (
              <div
                key={idx}
                className="text-slate-400 px-2 py-0.5 whitespace-pre-wrap break-all opacity-80"
              >
                <span className="select-none text-slate-600 mr-2"> </span>
                {block.text || ' '}
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}

