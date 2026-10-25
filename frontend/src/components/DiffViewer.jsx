import React from 'react';

export default function DiffViewer({ diff = [] }) {
  if (!diff || diff.length === 0) {
    return <div className="text-xs text-slate-400 py-3 text-center">No diff available</div>;
  }

  return (
    <div className="font-mono text-xs rounded-xl bg-[#f8fafc] p-3.5 max-h-72 overflow-y-auto border border-slate-200 shadow-inner">
      <div className="flex items-center gap-4 text-[11px] text-slate-500 pb-2 border-b border-slate-200 mb-2">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-emerald-100 border border-emerald-400 inline-block"></span>
          <span>Added / Optimized Directives</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-rose-100 border border-rose-400 inline-block"></span>
          <span>Removed Fluff & Redundancies</span>
        </span>
      </div>
      <div className="space-y-0.5">
        {diff.map((block, idx) => {
          if (block.type === 'removed') {
            return (
              <div
                key={idx}
                className="bg-rose-50 text-rose-700 border-l-2 border-rose-500 px-2 py-0.5 whitespace-pre-wrap break-all rounded-r"
              >
                <span className="select-none text-rose-500 font-bold mr-2">-</span>
                {block.text || ' '}
              </div>
            );
          } else if (block.type === 'added') {
            return (
              <div
                key={idx}
                className="bg-emerald-50 text-emerald-800 border-l-2 border-emerald-500 px-2 py-0.5 whitespace-pre-wrap break-all font-medium rounded-r"
              >
                <span className="select-none text-emerald-600 font-bold mr-2">+</span>
                {block.text || ' '}
              </div>
            );
          } else {
            return (
              <div
                key={idx}
                className="text-slate-600 px-2 py-0.5 whitespace-pre-wrap break-all opacity-90"
              >
                <span className="select-none text-slate-400 mr-2"> </span>
                {block.text || ' '}
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}
