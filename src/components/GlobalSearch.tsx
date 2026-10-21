import React, { useState } from 'react';
import { Search, X, FileCode } from 'lucide-react';
import { VirtualFile } from '../types';
import { FileIcon } from './FileIcon';

interface GlobalSearchProps {
  files: VirtualFile[];
  onOpenFileAtLine: (file: VirtualFile, lineNumber: number) => void;
}

interface SearchMatch {
  file: VirtualFile;
  line: number;
  content: string;
}

export function GlobalSearch({ files, onOpenFileAtLine }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [isCaseSensitive, setIsCaseSensitive] = useState(false);

  const nonFolderFiles = files.filter(f => !f.isFolder);

  const searchResults: SearchMatch[] = [];

  if (query.trim().length >= 2) {
    for (const file of nonFolderFiles) {
      const lines = file.content.split('\n');
      lines.forEach((line, index) => {
        const needle = isCaseSensitive ? query : query.toLowerCase();
        const haystack = isCaseSensitive ? line : line.toLowerCase();

        if (haystack.includes(needle)) {
          searchResults.push({
            file,
            line: index + 1,
            content: line.trim()
          });
        }
      });
    }
  }

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-zinc-300 select-none">
      {/* Header */}
      <div className="h-9 px-3 border-b border-zinc-800/80 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-zinc-400">
        <span>Search in Project</span>
      </div>

      {/* Input */}
      <div className="p-2 border-b border-zinc-900 space-y-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-zinc-500" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search code across all files..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1.5 pl-8 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-2 top-2 text-zinc-500 hover:text-zinc-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between text-[11px] text-zinc-400">
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-zinc-200">
            <input
              type="checkbox"
              checked={isCaseSensitive}
              onChange={e => setIsCaseSensitive(e.target.checked)}
              className="rounded border-zinc-700 text-blue-500 focus:ring-0"
            />
            <span>Match Case</span>
          </label>
          <span className="text-zinc-500 font-mono">
            {query.trim().length >= 2 ? `${searchResults.length} results` : 'Type 2+ chars'}
          </span>
        </div>
      </div>

      {/* Results List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {query.trim().length < 2 ? (
          <div className="p-4 text-center text-xs text-zinc-500">
            Type search keywords to find code across files
          </div>
        ) : searchResults.length === 0 ? (
          <div className="p-4 text-center text-xs text-zinc-500">
            No matches found for "{query}"
          </div>
        ) : (
          searchResults.map((match, idx) => (
            <div
              key={`${match.file.id}-${match.line}-${idx}`}
              onClick={() => onOpenFileAtLine(match.file, match.line)}
              className="p-2 rounded bg-zinc-900/50 hover:bg-zinc-800/80 border border-zinc-800/60 cursor-pointer transition text-xs group"
            >
              <div className="flex items-center gap-1.5 text-zinc-300 font-medium mb-1 truncate">
                <FileIcon name={match.file.name} language={match.file.language} className="w-3.5 h-3.5" />
                <span className="truncate">{match.file.path.slice(1)}</span>
                <span className="text-[10px] text-zinc-500 font-mono ml-auto shrink-0">
                  Ln {match.line}
                </span>
              </div>
              <div className="font-mono text-[11px] text-zinc-400 group-hover:text-zinc-200 truncate pl-5">
                {match.content}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
