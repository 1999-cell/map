import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Search, 
  Replace, 
  Sparkles, 
  Save, 
  Check, 
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { VirtualFile, EditorSettings } from '../types';
import { FileIcon } from './FileIcon';

interface CodeEditorProps {
  files: VirtualFile[];
  activeFile: VirtualFile | null;
  openFileIds: string[];
  onSelectTab: (fileId: string) => void;
  onCloseTab: (fileId: string) => void;
  onCloseOtherTabs: (fileId: string) => void;
  onUpdateFileContent: (fileId: string, content: string) => void;
  onSaveFile: (fileId: string) => void;
  settings: EditorSettings;
}

export function CodeEditor({
  files,
  activeFile,
  openFileIds,
  onSelectTab,
  onCloseTab,
  onCloseOtherTabs,
  onUpdateFileContent,
  onSaveFile,
  settings
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  // Search & Replace bar state
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const [savedFeedback, setSavedFeedback] = useState(false);

  const openFiles = openFileIds
    .map(id => files.find(f => f.id === id))
    .filter((f): f is VirtualFile => Boolean(f));

  // Sync line numbers scroll with textarea scroll
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Track cursor position
  const updateCursorPosition = () => {
    if (!textareaRef.current || !activeFile) return;
    const text = activeFile.content.substring(0, textareaRef.current.selectionStart);
    const lines = text.split('\n');
    setCursorPos({
      line: lines.length,
      col: lines[lines.length - 1].length + 1
    });
  };

  // Keyboard handler for Tab, Enter auto-indent, Ctrl+S, Ctrl+F
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!activeFile) return;

    // Ctrl+S / Cmd+S save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      onSaveFile(activeFile.id);
      setSavedFeedback(true);
      setTimeout(() => setSavedFeedback(false), 1500);
      return;
    }

    // Ctrl+F find
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
      e.preventDefault();
      setShowSearch(prev => !prev);
      return;
    }

    const textarea = textareaRef.current;
    if (!textarea) return;

    // Tab key indent
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const spaces = ' '.repeat(settings.tabSize);

      const newContent = 
        activeFile.content.substring(0, start) + 
        spaces + 
        activeFile.content.substring(end);

      onUpdateFileContent(activeFile.id, newContent);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + settings.tabSize;
        updateCursorPosition();
      }, 0);
    }

    // Auto-indent on Enter
    if (e.key === 'Enter' && settings.autoIndent) {
      const start = textarea.selectionStart;
      const textBeforeCursor = activeFile.content.substring(0, start);
      const currentLine = textBeforeCursor.split('\n').pop() || '';
      const match = currentLine.match(/^(\s+)/);
      const indent = match ? match[1] : '';

      if (indent.length > 0) {
        e.preventDefault();
        const end = textarea.selectionEnd;
        const newContent = 
          activeFile.content.substring(0, start) + 
          '\n' + indent + 
          activeFile.content.substring(end);

        onUpdateFileContent(activeFile.id, newContent);

        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 1 + indent.length;
          updateCursorPosition();
        }, 0);
      }
    }
  };

  const handleSearchReplace = (replaceAll: boolean = false) => {
    if (!activeFile || !searchTerm) return;
    let newContent = activeFile.content;
    if (replaceAll) {
      newContent = newContent.replaceAll(searchTerm, replaceTerm);
    } else {
      newContent = newContent.replace(searchTerm, replaceTerm);
    }
    onUpdateFileContent(activeFile.id, newContent);
  };

  if (!activeFile) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-zinc-950 text-zinc-500 select-none p-6 text-center">
        <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mb-3">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-300">No File Open</h3>
        <p className="text-xs text-zinc-500 max-w-sm mt-1">
          Select a file from the explorer on the left or press New File to start editing.
        </p>
      </div>
    );
  }

  const lines = activeFile.content.split('\n');
  const lineCount = lines.length;

  return (
    <div className="h-full flex flex-col bg-[#121214] text-zinc-200 select-none relative overflow-hidden">
      {/* Tab Navigation Bar */}
      <div className="h-9 bg-zinc-950 border-b border-zinc-800 flex items-center overflow-x-auto no-scrollbar shrink-0 select-none">
        {openFiles.map(file => {
          const isActive = file.id === activeFile.id;
          return (
            <div
              key={file.id}
              onClick={() => onSelectTab(file.id)}
              className={`group h-full flex items-center gap-2 px-3 border-r border-zinc-800 text-xs cursor-pointer transition select-none shrink-0 ${
                isActive
                  ? 'bg-[#121214] text-zinc-100 font-medium border-t-2 border-t-blue-500'
                  : 'bg-zinc-950/80 text-zinc-400 hover:bg-zinc-900/80 hover:text-zinc-200'
              }`}
            >
              <FileIcon name={file.name} language={file.language} className="w-3.5 h-3.5" />
              <span className="truncate max-w-[140px]">{file.name}</span>

              {/* Dirty indicator / Close button */}
              <div className="flex items-center ml-1">
                {file.isModified ? (
                  <span 
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloseTab(file.id);
                    }}
                    className="w-2 h-2 rounded-full bg-amber-400 group-hover:hidden" 
                    title="Modified"
                  />
                ) : null}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseTab(file.id);
                  }}
                  className={`p-0.5 rounded text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition ${
                    file.isModified ? 'hidden group-hover:block' : ''
                  }`}
                  title="Close tab"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}

        {/* Tab Bar Utilities */}
        <div className="ml-auto flex items-center pr-2 gap-1">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`p-1.5 rounded transition ${
              showSearch ? 'bg-zinc-800 text-blue-400' : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title="Find & Replace in file (Ctrl+F)"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onSaveFile(activeFile.id)}
            className="flex items-center gap-1 p-1.5 rounded text-zinc-500 hover:text-emerald-400 transition"
            title="Save changes (Ctrl+S)"
          >
            {savedFeedback ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* In-File Search & Replace Bar */}
      {showSearch && (
        <div className="bg-zinc-900/90 border-b border-zinc-800 px-4 py-2 flex flex-wrap items-center gap-2 text-xs shrink-0 z-10">
          <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 rounded px-2 py-1">
            <Search className="w-3 h-3 text-zinc-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Find in file..."
              className="bg-transparent text-white focus:outline-none w-36 text-xs"
              autoFocus
            />
          </div>

          <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 rounded px-2 py-1">
            <Replace className="w-3 h-3 text-zinc-500" />
            <input
              type="text"
              value={replaceTerm}
              onChange={e => setReplaceTerm(e.target.value)}
              placeholder="Replace with..."
              className="bg-transparent text-white focus:outline-none w-36 text-xs"
            />
          </div>

          <button
            onClick={() => handleSearchReplace(false)}
            className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded font-medium transition"
          >
            Replace
          </button>
          <button
            onClick={() => handleSearchReplace(true)}
            className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded font-medium transition"
          >
            All
          </button>
          <button
            onClick={() => setShowSearch(false)}
            className="p-1 text-zinc-500 hover:text-zinc-300 ml-auto"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Editor Body with Gutter */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Line Numbers Gutter */}
        {settings.showLineNumbers && (
          <div
            ref={lineNumbersRef}
            className="w-12 bg-[#0e0e10] border-r border-zinc-800/80 text-zinc-600 font-mono text-xs select-none py-3 text-right pr-3 overflow-hidden shrink-0 tabular-nums"
            style={{ fontSize: `${settings.fontSize}px`, lineHeight: '1.6' }}
          >
            {Array.from({ length: lineCount }).map((_, i) => (
              <div 
                key={i} 
                className={cursorPos.line === i + 1 ? 'text-zinc-300 font-medium' : ''}
              >
                {i + 1}
              </div>
            ))}
          </div>
        )}

        {/* Code Textarea Area */}
        <div className="flex-1 relative h-full overflow-hidden bg-[#121214]">
          <textarea
            ref={textareaRef}
            value={activeFile.content}
            onChange={e => onUpdateFileContent(activeFile.id, e.target.value)}
            onKeyDown={handleKeyDown}
            onKeyUp={updateCursorPosition}
            onClick={updateCursorPosition}
            onScroll={handleScroll}
            spellCheck={false}
            wrap={settings.wordWrap ? 'on' : 'off'}
            className="w-full h-full p-3 font-mono text-zinc-200 bg-transparent resize-none focus:outline-none leading-relaxed selection:bg-blue-600/40 tab-size-2"
            style={{
              fontSize: `${settings.fontSize}px`,
              lineHeight: '1.6',
              whiteSpace: settings.wordWrap ? 'pre-wrap' : 'pre'
            }}
          />
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="h-6 bg-[#0a0a0c] border-t border-zinc-800/80 px-3 flex items-center justify-between text-[11px] text-zinc-500 font-mono select-none shrink-0 tabular-nums">
        <div className="flex items-center gap-3">
          <span className="text-zinc-400">
            Ln {cursorPos.line}, Col {cursorPos.col}
          </span>
          <span>·</span>
          <span>{lineCount} lines</span>
          <span>·</span>
          <span>{activeFile.content.length} chars</span>
        </div>

        <div className="flex items-center gap-3">
          <span>Spaces: {settings.tabSize}</span>
          <span>·</span>
          <span>UTF-8</span>
          <span>·</span>
          <span className="capitalize text-blue-400 font-medium">
            {activeFile.language}
          </span>
        </div>
      </div>
    </div>
  );
}
