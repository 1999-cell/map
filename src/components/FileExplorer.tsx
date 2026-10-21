import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  FilePlus, 
  FolderPlus, 
  Trash2, 
  Edit3, 
  Download, 
  Filter,
  X,
  Check
} from 'lucide-react';
import { VirtualFile } from '../types';
import { FileIcon } from './FileIcon';

interface FileExplorerProps {
  files: VirtualFile[];
  activeFileId: string | null;
  onSelectFile: (file: VirtualFile) => void;
  onCreateFile: (name: string, parentId: string | null) => void;
  onCreateFolder: (name: string, parentId: string | null) => void;
  onRenameItem: (id: string, newName: string) => void;
  onDeleteItem: (id: string) => void;
  onDownloadFile: (file: VirtualFile) => void;
}

export function FileExplorer({
  files,
  activeFileId,
  onSelectFile,
  onCreateFile,
  onCreateFolder,
  onRenameItem,
  onDeleteItem,
  onDownloadFile
}: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'dir-src': true,
    'dir-components': true
  });
  const [filterQuery, setFilterQuery] = useState('');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => ({ ...prev, [folderId]: !prev[folderId] }));
  };

  const collapseAll = () => {
    setExpandedFolders({});
  };

  const expandAll = () => {
    const next: Record<string, boolean> = {};
    files.filter(f => f.isFolder).forEach(f => { next[f.id] = true; });
    setExpandedFolders(next);
  };

  const handleStartRename = (file: VirtualFile, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenamingId(file.id);
    setRenameValue(file.name);
  };

  const handleSaveRename = (id: string) => {
    if (renameValue.trim()) {
      onRenameItem(id, renameValue.trim());
    }
    setRenamingId(null);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    if (isCreatingFile) {
      onCreateFile(newItemName.trim(), selectedParentId);
    } else if (isCreatingFolder) {
      onCreateFolder(newItemName.trim(), selectedParentId);
    }
    setNewItemName('');
    setIsCreatingFile(false);
    setIsCreatingFolder(false);
  };

  // Filter items if search query is active
  const filteredFiles = filterQuery.trim()
    ? files.filter(f => f.name.toLowerCase().includes(filterQuery.toLowerCase()))
    : files;

  // Render tree recursively
  const renderItem = (file: VirtualFile, depth: number = 0) => {
    const isExpanded = expandedFolders[file.id];
    const isSelected = activeFileId === file.id;
    const isRenaming = renamingId === file.id;

    if (file.isFolder) {
      const childFiles = files.filter(f => f.parentId === file.id);

      return (
        <div key={file.id} className="select-none">
          <div
            onClick={() => toggleFolder(file.id)}
            style={{ paddingLeft: `${depth * 12 + 12}px` }}
            className={`group flex items-center justify-between py-1 pr-2 text-xs cursor-pointer hover:bg-zinc-900/80 rounded transition ${
              isSelected ? 'bg-zinc-800/80 text-white' : 'text-zinc-300'
            }`}
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-zinc-500 group-hover:text-zinc-300 transition">
                {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </span>
              <FileIcon name={file.name} isFolder isOpen={isExpanded} />
              
              {isRenaming ? (
                <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                  <input
                    type="text"
                    value={renameValue}
                    onChange={e => setRenameValue(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleSaveRename(file.id);
                      if (e.key === 'Escape') setRenamingId(null);
                    }}
                    autoFocus
                    className="bg-zinc-950 border border-blue-500 rounded px-1 py-0.5 text-xs text-white focus:outline-none"
                  />
                  <button onClick={() => handleSaveRename(file.id)} className="text-emerald-400 hover:text-emerald-300">
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setRenamingId(null)} className="text-zinc-400 hover:text-zinc-300">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <span className="truncate font-medium">{file.name}</span>
              )}
            </div>

            {/* Folder Actions */}
            <div className="hidden group-hover:flex items-center gap-1 opacity-80" onClick={e => e.stopPropagation()}>
              <button
                onClick={() => {
                  setSelectedParentId(file.id);
                  setIsCreatingFile(true);
                  setIsCreatingFolder(false);
                  if (!isExpanded) toggleFolder(file.id);
                }}
                title="Add file inside folder"
                className="p-1 hover:text-blue-400 hover:bg-zinc-800 rounded transition"
              >
                <FilePlus className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => handleStartRename(file, e)}
                title="Rename folder"
                className="p-1 hover:text-yellow-400 hover:bg-zinc-800 rounded transition"
              >
                <Edit3 className="w-3 h-3" />
              </button>
              <button
                onClick={() => onDeleteItem(file.id)}
                title="Delete folder"
                className="p-1 hover:text-rose-400 hover:bg-zinc-800 rounded transition"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Children */}
          {isExpanded && (
            <div>
              {childFiles.map(child => renderItem(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    // Single File Item
    return (
      <div
        key={file.id}
        onClick={() => onSelectFile(file)}
        style={{ paddingLeft: `${depth * 12 + 12}px` }}
        className={`group flex items-center justify-between py-1.5 pr-2 text-xs cursor-pointer rounded transition select-none ${
          isSelected 
            ? 'bg-blue-600/20 text-blue-300 font-medium' 
            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/70'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <FileIcon name={file.name} language={file.language} />
          {isRenaming ? (
            <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
              <input
                type="text"
                value={renameValue}
                onChange={e => setRenameValue(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSaveRename(file.id);
                  if (e.key === 'Escape') setRenamingId(null);
                }}
                autoFocus
                className="bg-zinc-950 border border-blue-500 rounded px-1 py-0.5 text-xs text-white focus:outline-none"
              />
              <button onClick={() => handleSaveRename(file.id)} className="text-emerald-400 hover:text-emerald-300">
                <Check className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setRenamingId(null)} className="text-zinc-400 hover:text-zinc-300">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <span className="truncate">{file.name}</span>
          )}

          {file.isModified && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" title="Unsaved changes" />
          )}
        </div>

        {/* Hover Quick Actions */}
        <div className="hidden group-hover:flex items-center gap-1 opacity-90" onClick={e => e.stopPropagation()}>
          <button
            onClick={() => onDownloadFile(file)}
            title="Download file"
            className="p-1 hover:text-blue-400 hover:bg-zinc-800 rounded transition"
          >
            <Download className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => handleStartRename(file, e)}
            title="Rename file"
            className="p-1 hover:text-yellow-400 hover:bg-zinc-800 rounded transition"
          >
            <Edit3 className="w-3 h-3" />
          </button>
          <button
            onClick={() => onDeleteItem(file.id)}
            title="Delete file"
            className="p-1 hover:text-rose-400 hover:bg-zinc-800 rounded transition"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  };

  // Top level root items (parentId === null)
  const rootFiles = filteredFiles.filter(f => f.parentId === null);

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-zinc-300 select-none">
      {/* Explorer Header */}
      <div className="h-9 px-3 border-b border-zinc-800/80 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-zinc-400">
        <span className="truncate">Files & Project</span>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setSelectedParentId(null);
              setIsCreatingFile(true);
              setIsCreatingFolder(false);
            }}
            className="p-1 hover:text-white hover:bg-zinc-800 rounded transition"
            title="New File in Root"
          >
            <FilePlus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setSelectedParentId(null);
              setIsCreatingFolder(true);
              setIsCreatingFile(false);
            }}
            className="p-1 hover:text-white hover:bg-zinc-800 rounded transition"
            title="New Folder in Root"
          >
            <FolderPlus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={collapseAll}
            className="p-1 hover:text-white hover:bg-zinc-800 rounded transition text-[10px] font-mono"
            title="Collapse All Folders"
          >
            −
          </button>
          <button
            onClick={expandAll}
            className="p-1 hover:text-white hover:bg-zinc-800 rounded transition text-[10px] font-mono"
            title="Expand All Folders"
          >
            +
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-2 border-b border-zinc-900">
        <div className="relative">
          <Filter className="w-3 h-3 absolute left-2.5 top-2.5 text-zinc-500" />
          <input
            type="text"
            value={filterQuery}
            onChange={e => setFilterQuery(e.target.value)}
            placeholder="Filter files..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1.5 pl-7 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
          />
          {filterQuery && (
            <button
              onClick={() => setFilterQuery('')}
              className="absolute right-2 top-2 text-zinc-500 hover:text-zinc-300"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Inline Create Input Dialog */}
      {(isCreatingFile || isCreatingFolder) && (
        <form onSubmit={handleCreateSubmit} className="p-2 bg-zinc-900 border-b border-zinc-800 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span>{isCreatingFile ? 'Create New File' : 'Create New Folder'}</span>
            <button
              type="button"
              onClick={() => {
                setIsCreatingFile(false);
                setIsCreatingFolder(false);
              }}
              className="text-zinc-500 hover:text-zinc-300"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <div className="flex gap-1">
            <input
              type="text"
              value={newItemName}
              onChange={e => setNewItemName(e.target.value)}
              placeholder={isCreatingFile ? 'e.g. Button.tsx' : 'e.g. utils'}
              autoFocus
              className="flex-1 bg-zinc-950 border border-blue-500 rounded px-2 py-1 text-xs text-white focus:outline-none"
            />
            <button
              type="submit"
              className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-medium transition"
            >
              Create
            </button>
          </div>
        </form>
      )}

      {/* File Tree List */}
      <div className="flex-1 overflow-y-auto py-1">
        {rootFiles.length === 0 ? (
          <div className="p-4 text-center text-xs text-zinc-500">
            No matching files found
          </div>
        ) : (
          rootFiles.map(file => renderItem(file, 0))
        )}
      </div>

      {/* Footer Info */}
      <div className="p-2 border-t border-zinc-900 text-[11px] text-zinc-500 flex items-center justify-between">
        <span>{files.filter(f => !f.isFolder).length} files</span>
        <span>{files.filter(f => f.isModified).length} modified</span>
      </div>
    </div>
  );
}
