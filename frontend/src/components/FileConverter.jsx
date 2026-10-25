import React, { useState } from 'react';
import { 
  Upload, FileText, Download, Copy, Check, Sparkles, 
  Trash2, RefreshCw, ArrowRight, ShieldCheck, FileSpreadsheet, FileCode
} from 'lucide-react';

export default function FileConverter({ setRawPrompt, setActiveTab }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [convertedData, setConvertedData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      processFile(selected);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) {
      setFile(dropped);
      processFile(dropped);
    }
  };

  const processFile = async (targetFile) => {
    setLoading(true);
    setConvertedData(null);
    const formData = new FormData();
    formData.append('file', targetFile);

    try {
      const res = await fetch('/api/files/convert', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Conversion failed');
      setConvertedData(data);
    } catch (err) {
      alert(`Error converting file: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!convertedData) return;
    const blob = new Blob([convertedData.fullContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const baseName = convertedData.filename.substring(0, convertedData.filename.lastIndexOf('.')) || convertedData.filename;
    a.href = url;
    a.download = `${baseName}_converted${convertedData.formatExtension || '.txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    if (!convertedData) return;
    navigator.clipboard.writeText(convertedData.fullContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendToOptimizer = () => {
    if (!convertedData) return;
    const prefix = `### Context Document: ${convertedData.filename}\n\n${convertedData.fullContent}\n\n### Directive:\n`;
    if (setRawPrompt) setRawPrompt(prefix);
    if (setActiveTab) setActiveTab('studio');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans">
      {/* Page Header */}
      <div className="pb-2 border-b border-slate-200/90">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">File Converter</h1>
        <p className="text-sm text-slate-500">
          Upload PDF, Word, PowerPoint, Excel, CSV, or JSON files to convert them into token-efficient Markdown (.md), TSV (.tsv), or TOON (.toon).
        </p>
      </div>

      {/* Upload Dropzone Matching AuthScreen */}
      <div 
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all bg-white shadow-[0_10px_25px_-5px_rgba(203,213,225,0.45),0_8px_10px_-6px_rgba(203,213,225,0.35)] ${
          dragOver ? 'border-blue-500 bg-blue-50/40' : 'border-slate-300 hover:border-blue-500/60'
        }`}
      >
        <div className="max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
            <Upload className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              Upload Document, Spreadsheet, or Schema
            </h3>
            <p className="text-xs text-slate-500">
              Drag and drop your file here, or click to browse
            </p>
          </div>

          <label className="inline-block px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer transition-all shadow-md shadow-blue-500/25">
            <span>Browse Files</span>
            <input 
              type="file" 
              onChange={handleFileChange} 
              accept=".pdf,.docx,.doc,.pptx,.ppt,.xlsx,.xls,.csv,.json"
              className="hidden" 
            />
          </label>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px] text-slate-500 font-mono">
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700">
              PDF / Word → Markdown
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700">
              Excel / CSV → TSV
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700">
              JSON → TOON
            </span>
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-2 shadow-[0_10px_25px_-5px_rgba(203,213,225,0.45)]">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
          <div className="text-sm font-bold text-slate-900">Converting {file?.name}...</div>
          <div className="text-xs text-slate-500 font-mono">Extracting content and optimizing token structures</div>
        </div>
      )}

      {/* Converted Output Card */}
      {convertedData && (
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-[0_10px_25px_-5px_rgba(203,213,225,0.45),0_8px_10px_-6px_rgba(203,213,225,0.35)] p-5 sm:p-6 space-y-5 animate-fadeIn">
          {/* Header Stats */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 shadow-sm">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{convertedData.filename}</h3>
                <p className="text-xs text-slate-500">
                  Converted to <strong className="text-emerald-600 font-mono font-bold">{convertedData.formatExtension}</strong> ({convertedData.targetFormat})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs font-mono shadow-sm">
                {convertedData.conversionSavingsPct}% Token Savings
              </span>
            </div>
          </div>

          {/* Token Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-[#f8fafc] border border-slate-200 shadow-inner">
              <span className="text-slate-500 block text-[11px]">Raw File Tokens</span>
              <span className="text-base font-bold text-slate-900 mt-0.5 block">
                {convertedData.rawEstimatedTokens?.toLocaleString()} tokens
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#f8fafc] border border-slate-200 shadow-inner">
              <span className="text-slate-500 block text-[11px]">Converted Format Tokens</span>
              <span className="text-base font-bold text-emerald-600 mt-0.5 block">
                {convertedData.convertedTokens?.toLocaleString()} tokens
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#f8fafc] border border-slate-200 font-sans shadow-inner">
              <span className="text-slate-500 block text-[11px]">Optimization Mechanism</span>
              <span className="text-slate-700 text-[11px] mt-0.5 block line-clamp-2">
                {convertedData.rationale}
              </span>
            </div>
          </div>

          {/* Converted Preview Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">Converted File Content Preview</span>
              <span className="text-slate-500 font-mono">{convertedData.fullContent.length} characters</span>
            </div>

            <pre className="p-4 rounded-xl bg-[#f8fafc] border border-slate-200 text-slate-900 text-xs font-mono max-h-72 overflow-y-auto whitespace-pre-wrap leading-relaxed shadow-inner">
{convertedData.fullContent}
            </pre>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-blue-600" />}
              <span>{copied ? 'Copied' : 'Copy Content'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Download {convertedData.formatExtension}</span>
            </button>

            <button
              onClick={handleSendToOptimizer}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-blue-500/25"
            >
              <span>Use in Prompt Optimizer</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

