import React from 'react';
import { X, Keyboard, Command } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShortcutsModal({ isOpen, onClose }: ShortcutsModalProps) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Ctrl + S / ⌘ + S', action: 'Save current file & refresh live preview' },
    { key: 'Ctrl + F / ⌘ + F', action: 'Toggle in-file search and replace' },
    { key: 'Tab', action: 'Insert 2 or 4 spaces indentation' },
    { key: 'Enter', action: 'Auto-indent to previous line indentation level' },
    { key: 'Ctrl + Shift + E', action: 'Open file explorer panel' },
    { key: 'Ctrl + Shift + F', action: 'Open project-wide search' },
    { key: 'Ctrl + `', action: 'Toggle console and error diagnostics drawer' },
    { key: 'Esc', action: 'Close dialogs, search bars, and modals' },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 select-none">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-white">Keyboard Shortcuts</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 text-xs">
          {shortcuts.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 border-b border-zinc-800/60 last:border-none">
              <span className="text-zinc-300">{item.action}</span>
              <kbd className="px-2 py-1 bg-zinc-950 border border-zinc-700/80 rounded font-mono text-[11px] text-blue-400 font-semibold shadow-xs">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-medium transition"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
