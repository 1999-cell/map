import React from 'react';
import { GitCompare, X, Check, FileCode } from 'lucide-react';
import { VirtualFile } from '../types';
import { INITIAL_FILES } from '../data/initialProject';

interface DiffViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeFile: VirtualFile | null;
  files: VirtualFile[];
}

export function DiffViewerModal({ isOpen, onClose, activeFile, files }: DiffViewerModalProps) {
  if (!isOpen || !activeFile) return null;

  // Find original file from INITIAL_FILES
  const originalFile = INITIAL_FILES.find(f => f.path === activeFile.path);
  const originalContent = originalFile ? originalFile.content : '';
  const currentContent = activeFile.content;

  const originalLines = originalContent.split('\n');
  const currentLines = currentContent.split('\n');

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 select-none">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-4xl w-full h-[80vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Diff Inspector</span>
                <span className="font-mono text-xs text-zinc-400">({activeFile.name})</span>
              </h3>
              <p className="text-[11px] text-zinc-400">Comparing current working edits with template baseline</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Diff view split panes */}
        <div className="flex-1 flex min-h-0 font-mono text-xs overflow-hidden">
          {/* Baseline Left */}
          <div className="w-1/2 border-r border-zinc-800 flex flex-col bg-zinc-950">
            <div className="px-3 py-1.5 bg-zinc-900/60 border-b border-zinc-800 text-[11px] text-zinc-400 font-sans font-medium flex justify-between">
              <span>Original Template Baseline</span>
              <span>{originalLines.length} lines</span>
            </div>
            <div className="flex-1 overflow-auto p-3 space-y-0.5 text-zinc-400">
              {originalLines.map((line, i) => (
                <div key={i} className="flex gap-3 leading-relaxed">
                  <span className="w-8 text-right text-zinc-600 select-none tabular-nums shrink-0">{i + 1}</span>
                  <span className="whitespace-pre">{line}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Current Working Right */}
          <div className="w-1/2 flex flex-col bg-[#121214]">
            <div className="px-3 py-1.5 bg-zinc-900/60 border-b border-zinc-800 text-[11px] text-emerald-400 font-sans font-medium flex justify-between">
              <span>Current Working Draft</span>
              <span>{currentLines.length} lines</span>
            </div>
            <div className="flex-1 overflow-auto p-3 space-y-0.5 text-zinc-200">
              {currentLines.map((line, i) => {
                const isDifferent = originalLines[i] !== line;
                return (
                  <div
                    key={i}
                    className={`flex gap-3 leading-relaxed ${
                      isDifferent ? 'bg-emerald-950/30 text-emerald-300' : ''
                    }`}
                  >
                    <span className="w-8 text-right text-zinc-600 select-none tabular-nums shrink-0">{i + 1}</span>
                    <span className="whitespace-pre">{line}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between text-xs text-zinc-400 shrink-0">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500/30 border border-emerald-500" />
              <span>Modified Line</span>
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition"
          >
            Close Diff
          </button>
        </div>
      </div>
    </div>
  );
}
