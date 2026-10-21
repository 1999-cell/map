import React from 'react';
import { Sliders, RotateCcw } from 'lucide-react';
import { EditorSettings } from '../types';

interface SettingsModalProps {
  settings: EditorSettings;
  onUpdateSettings: (newSettings: Partial<EditorSettings>) => void;
  onResetSettings: () => void;
}

export function SettingsModal({
  settings,
  onUpdateSettings,
  onResetSettings
}: SettingsModalProps) {
  return (
    <div className="h-full flex flex-col bg-zinc-950 text-zinc-300 select-none">
      <div className="h-9 px-3 border-b border-zinc-800/80 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-zinc-400">
        <span className="flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-blue-400" />
          <span>Editor Settings</span>
        </span>
        <button
          onClick={onResetSettings}
          className="text-zinc-500 hover:text-zinc-300 transition"
          title="Reset to default settings"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
        {/* Font Size */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium text-zinc-200">Font Size</span>
            <span className="font-mono text-zinc-400">{settings.fontSize}px</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {[12, 13, 14, 16].map(size => (
              <button
                key={size}
                onClick={() => onUpdateSettings({ fontSize: size })}
                className={`py-1 rounded text-center font-mono transition border ${
                  settings.fontSize === size
                    ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-bold'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {size}px
              </button>
            ))}
          </div>
        </div>

        {/* Tab Size */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium text-zinc-200">Tab Size</span>
            <span className="font-mono text-zinc-400">{settings.tabSize} spaces</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[2, 4].map(tabs => (
              <button
                key={tabs}
                onClick={() => onUpdateSettings({ tabSize: tabs })}
                className={`py-1 rounded text-center font-mono transition border ${
                  settings.tabSize === tabs
                    ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-bold'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {tabs} spaces
              </button>
            ))}
          </div>
        </div>

        {/* Word Wrap Toggle */}
        <div className="flex items-center justify-between py-2 border-t border-zinc-900">
          <div>
            <div className="font-medium text-zinc-200">Word Wrap</div>
            <div className="text-[11px] text-zinc-500">Wrap long lines in editor</div>
          </div>
          <button
            onClick={() => onUpdateSettings({ wordWrap: !settings.wordWrap })}
            className={`w-9 h-5 rounded-full transition-colors relative ${
              settings.wordWrap ? 'bg-blue-600' : 'bg-zinc-800'
            }`}
          >
            <span
              className={`block w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                settings.wordWrap ? 'translate-x-4' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Auto Run Toggle */}
        <div className="flex items-center justify-between py-2 border-t border-zinc-900">
          <div>
            <div className="font-medium text-zinc-200">Auto-Run Live Preview</div>
            <div className="text-[11px] text-zinc-500">Re-render as you type (debounced)</div>
          </div>
          <button
            onClick={() => onUpdateSettings({ autoRun: !settings.autoRun })}
            className={`w-9 h-5 rounded-full transition-colors relative ${
              settings.autoRun ? 'bg-blue-600' : 'bg-zinc-800'
            }`}
          >
            <span
              className={`block w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                settings.autoRun ? 'translate-x-4' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Show Line Numbers */}
        <div className="flex items-center justify-between py-2 border-t border-zinc-900">
          <div>
            <div className="font-medium text-zinc-200">Line Numbers</div>
            <div className="text-[11px] text-zinc-500">Display line gutter</div>
          </div>
          <button
            onClick={() => onUpdateSettings({ showLineNumbers: !settings.showLineNumbers })}
            className={`w-9 h-5 rounded-full transition-colors relative ${
              settings.showLineNumbers ? 'bg-blue-600' : 'bg-zinc-800'
            }`}
          >
            <span
              className={`block w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                settings.showLineNumbers ? 'translate-x-4' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
