import React, { useState } from 'react';
import { 
  Terminal, 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  Trash2, 
  X, 
  ChevronRight,
  Send
} from 'lucide-react';
import { ConsoleEntry } from '../types';

interface ConsoleDrawerProps {
  logs: ConsoleEntry[];
  onClearLogs: () => void;
  onClose: () => void;
  onExecuteJs: (code: string) => void;
}

export function ConsoleDrawer({
  logs,
  onClearLogs,
  onClose,
  onExecuteJs
}: ConsoleDrawerProps) {
  const [activeSubTab, setActiveSubTab] = useState<'console' | 'diagnostics' | 'terminal'>('console');
  const [logFilter, setLogFilter] = useState<'all' | 'error' | 'warn' | 'log'>('all');
  const [replInput, setReplInput] = useState('');

  const errorLogs = logs.filter(l => l.level === 'error');
  const warnLogs = logs.filter(l => l.level === 'warn');

  const filteredLogs = logs.filter(l => {
    if (logFilter === 'all') return true;
    return l.level === logFilter;
  });

  const handleReplSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replInput.trim()) return;
    onExecuteJs(replInput.trim());
    setReplInput('');
  };

  const getLogIcon = (level: ConsoleEntry['level']) => {
    switch (level) {
      case 'error':
        return <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />;
      case 'warn':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />;
      case 'info':
        return <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />;
      default:
        return <ChevronRight className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />;
    }
  };

  const getLogStyle = (level: ConsoleEntry['level']) => {
    switch (level) {
      case 'error':
        return 'text-rose-300 bg-rose-950/20 border-l-2 border-l-rose-500';
      case 'warn':
        return 'text-amber-300 bg-amber-950/20 border-l-2 border-l-amber-500';
      case 'info':
        return 'text-blue-300 bg-blue-950/10';
      default:
        return 'text-zinc-300 hover:bg-zinc-900/50';
    }
  };

  return (
    <div className="h-48 sm:h-56 bg-zinc-950 border-t border-zinc-800 flex flex-col font-mono text-xs select-none z-10">
      {/* Header Bar */}
      <div className="h-8 bg-zinc-900/80 border-b border-zinc-800 px-3 flex items-center justify-between text-xs shrink-0">
        {/* Tabs */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveSubTab('console')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition text-xs font-sans ${
              activeSubTab === 'console'
                ? 'bg-zinc-800 text-white font-medium'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Console</span>
            {logs.length > 0 && (
              <span className="text-[10px] font-mono bg-zinc-700/80 px-1 rounded text-zinc-300">
                {logs.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('diagnostics')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition text-xs font-sans ${
              activeSubTab === 'diagnostics'
                ? 'bg-zinc-800 text-white font-medium'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>Problems</span>
            {errorLogs.length > 0 && (
              <span className="text-[10px] font-mono bg-rose-900/60 text-rose-300 px-1 rounded">
                {errorLogs.length}
              </span>
            )}
          </button>
        </div>

        {/* Filter & Actions */}
        <div className="flex items-center gap-2">
          {activeSubTab === 'console' && (
            <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded px-1 text-[11px]">
              {(['all', 'error', 'warn', 'log'] as const).map(filter => (
                <button
                  key={filter}
                  onClick={() => setLogFilter(filter)}
                  className={`px-1.5 py-0.5 rounded capitalize ${
                    logFilter === filter ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={onClearLogs}
            className="p-1 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded transition"
            title="Clear Console"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded transition"
            title="Close Drawer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 font-mono text-[11px]">
        {activeSubTab === 'diagnostics' ? (
          <div>
            {errorLogs.length === 0 && warnLogs.length === 0 ? (
              <div className="p-4 text-center text-zinc-500 font-sans text-xs">
                No problems detected in current project workspace.
              </div>
            ) : (
              <div className="space-y-1">
                {errorLogs.map(log => (
                  <div key={log.id} className="p-2 bg-rose-950/20 border border-rose-900/40 rounded flex items-start gap-2 text-rose-300">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                    <div>
                      <div className="font-semibold text-rose-200">Error</div>
                      <div className="whitespace-pre-wrap">{log.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {filteredLogs.length === 0 ? (
              <div className="p-4 text-center text-zinc-500 font-sans text-xs">
                Console is empty. Application logs, prints, and warnings will appear here.
              </div>
            ) : (
              filteredLogs.map(log => (
                <div
                  key={log.id}
                  className={`flex items-start gap-2 py-1 px-2 rounded transition ${getLogStyle(log.level)}`}
                >
                  {getLogIcon(log.level)}
                  <div className="flex-1 whitespace-pre-wrap break-all leading-relaxed">
                    {log.text}
                  </div>
                  <span className="text-[10px] text-zinc-600 shrink-0 tabular-nums">
                    {log.timestamp}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* REPL Input Line */}
      {activeSubTab === 'console' && (
        <form onSubmit={handleReplSubmit} className="h-7 bg-zinc-950 border-t border-zinc-900 px-2 flex items-center gap-2 shrink-0">
          <span className="text-blue-400 font-bold text-xs">{'>'}</span>
          <input
            type="text"
            value={replInput}
            onChange={e => setReplInput(e.target.value)}
            placeholder="Evaluate JavaScript expression or run command..."
            className="flex-1 bg-transparent text-zinc-200 placeholder-zinc-600 focus:outline-none text-[11px] font-mono"
          />
          <button
            type="submit"
            className="text-zinc-500 hover:text-blue-400 transition"
            title="Execute"
          >
            <Send className="w-3 h-3" />
          </button>
        </form>
      )}
    </div>
  );
}
