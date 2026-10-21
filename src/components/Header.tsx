import React from 'react';
import { 
  Code2, 
  Play, 
  Download, 
  Columns, 
  Maximize2, 
  Eye, 
  RotateCcw,
  Sparkles,
  FilePlus,
  HelpCircle,
  LayoutGrid,
  GitCompare
} from 'lucide-react';
import { LayoutMode, VirtualFile } from '../types';

interface HeaderProps {
  activeFile: VirtualFile | null;
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;
  onRunPreview: () => void;
  onDownloadZip: () => void;
  onNewFile: () => void;
  onResetProject: () => void;
  onOpenSnippets: () => void;
  onOpenShortcuts: () => void;
  onOpenTemplates: () => void;
  onOpenDiff: () => void;
  isRunning: boolean;
}

export function Header({
  activeFile,
  layoutMode,
  setLayoutMode,
  onRunPreview,
  onDownloadZip,
  onNewFile,
  onResetProject,
  onOpenSnippets,
  onOpenShortcuts,
  onOpenTemplates,
  onOpenDiff,
  isRunning
}: HeaderProps) {
  return (
    <header className="h-12 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-4 select-none shrink-0 z-20">
      {/* Zone 1: Wordmark & Active Breadcrumb */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Code2 className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm tracking-tight text-white whitespace-nowrap">
            DevForge
          </span>
          <span className="text-[10px] font-mono uppercase bg-zinc-800/80 text-blue-400 px-1.5 py-0.5 rounded border border-zinc-700/60">
            IDE
          </span>
        </div>

        {/* Breadcrumb */}
        {activeFile && (
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-400 font-mono truncate border-l border-zinc-800 pl-4">
            <span className="text-zinc-500">workspace</span>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-300 truncate">{activeFile.path.slice(1)}</span>
            {activeFile.isModified && (
              <span className="w-2 h-2 rounded-full bg-amber-400 ml-1 shrink-0" title="Unsaved changes" />
            )}
          </div>
        )}
      </div>

      {/* Zone 2: Navigation & View Mode Toggles */}
      <div className="flex items-center gap-2">
        {/* Layout Segmented Control */}
        <div className="flex items-center bg-zinc-900 border border-zinc-800 p-0.5 rounded-lg text-xs">
          <button
            onClick={() => setLayoutMode('split')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition font-medium whitespace-nowrap ${
              layoutMode === 'split' 
                ? 'bg-zinc-800 text-white shadow-sm' 
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Split Editor & Preview"
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Split</span>
          </button>
          <button
            onClick={() => setLayoutMode('editor-only')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition font-medium whitespace-nowrap ${
              layoutMode === 'editor-only' 
                ? 'bg-zinc-800 text-white shadow-sm' 
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Code Editor Only"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Editor</span>
          </button>
          <button
            onClick={() => setLayoutMode('preview-only')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition font-medium whitespace-nowrap ${
              layoutMode === 'preview-only' 
                ? 'bg-zinc-800 text-white shadow-sm' 
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Live Preview Only"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Preview</span>
          </button>
        </div>

        {/* Quick Nav Tools */}
        <button
          onClick={onOpenTemplates}
          className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 text-xs text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition"
          title="Starter Project Templates"
        >
          <LayoutGrid className="w-3.5 h-3.5 text-blue-400" />
          <span>Templates</span>
        </button>

        <button
          onClick={onOpenDiff}
          className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 text-xs text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition"
          title="Inspect Diff vs Baseline"
        >
          <GitCompare className="w-3.5 h-3.5 text-emerald-400" />
          <span>Diff</span>
        </button>

        <button
          onClick={onNewFile}
          className="hidden md:flex items-center gap-1 px-2.5 py-1.5 text-xs text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition"
          title="Create New File"
        >
          <FilePlus className="w-3.5 h-3.5 text-blue-400" />
          <span>New File</span>
        </button>

        <button
          onClick={onOpenSnippets}
          className="hidden xl:flex items-center gap-1 px-2.5 py-1.5 text-xs text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition"
          title="Component Snippets"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Snippets</span>
        </button>

        <button
          onClick={onResetProject}
          className="hidden md:flex items-center gap-1 px-2 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 rounded-lg transition"
          title="Reset Workspace to Defaults"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="sr-only">Reset</span>
        </button>

        <button
          onClick={onOpenShortcuts}
          className="hidden sm:flex items-center gap-1 p-1.5 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 rounded-lg transition"
          title="Keyboard Shortcuts"
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Zone 3: Primary Actions */}
      <div className="flex items-center gap-2">
        {/* Run / Update Live Preview Button */}
        <button
          onClick={onRunPreview}
          disabled={isRunning}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/60 rounded-lg transition shadow-sm disabled:opacity-50"
          title="Run Code & Update Preview (Ctrl+S / Cmd+S)"
        >
          <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
          <span className="whitespace-nowrap">Run Live</span>
        </button>

        {/* Download Project ZIP */}
        <button
          onClick={onDownloadZip}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition shadow-sm whitespace-nowrap"
          title="Download complete workspace as ZIP"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export ZIP</span>
        </button>
      </div>
    </header>
  );
}
