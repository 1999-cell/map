/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  VirtualFile, 
  FileLanguage, 
  ConsoleEntry, 
  LayoutMode, 
  ActiveSidebarTab, 
  EditorSettings 
} from './types';
import { INITIAL_FILES } from './data/initialProject';
import { buildSandboxedHtml } from './utils/compiler';
import { downloadProjectAsZip, downloadSingleFile } from './utils/exporter';
import { Header } from './components/Header';
import { ActivityBar } from './components/ActivityBar';
import { FileExplorer } from './components/FileExplorer';
import { GlobalSearch } from './components/GlobalSearch';
import { SnippetsDrawer } from './components/SnippetsDrawer';
import { SettingsModal } from './components/SettingsModal';
import { CodeEditor } from './components/CodeEditor';
import { LivePreview } from './components/LivePreview';
import { ConsoleDrawer } from './components/ConsoleDrawer';
import { ShortcutsModal } from './components/ShortcutsModal';
import { TemplatesModal, ProjectTemplate } from './components/TemplatesModal';
import { DiffViewerModal } from './components/DiffViewerModal';

const LOCAL_STORAGE_KEY = 'devforge_project_files_v1';
const SETTINGS_KEY = 'devforge_editor_settings_v1';

const DEFAULT_SETTINGS: EditorSettings = {
  fontSize: 13,
  tabSize: 2,
  wordWrap: false,
  autoRun: true,
  showLineNumbers: true,
  autoIndent: true,
};

export default function App() {
  // Load files from storage or default
  const [files, setFiles] = useState<VirtualFile[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    return INITIAL_FILES;
  });

  // Settings
  const [settings, setSettings] = useState<EditorSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch (_) {}
    return DEFAULT_SETTINGS;
  });

  // Editor and navigation state
  const [activeFileId, setActiveFileId] = useState<string>('f-app-tsx');
  const [openFileIds, setOpenFileIds] = useState<string[]>([
    'f-app-tsx',
    'f-index-css',
    'f-package-json'
  ]);
  const [activeSidebarTab, setActiveSidebarTab] = useState<ActiveSidebarTab>('explorer');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('split');
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isDiffOpen, setIsDiffOpen] = useState(false);

  // Runtime and preview state
  const [htmlPayload, setHtmlPayload] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<ConsoleEntry[]>([]);

  const activeFile = files.find(f => f.id === activeFileId) || null;
  const errorCount = logs.filter(l => l.level === 'error').length;

  // Persist files to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(files));
    } catch (_) {}
  }, [files]);

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (_) {}
  }, [settings]);

  // Compile sandboxed HTML
  const compilePreview = useCallback((currentFiles: VirtualFile[]) => {
    setIsRunning(true);
    const newHtml = buildSandboxedHtml(currentFiles);
    setHtmlPayload(newHtml);
    setTimeout(() => {
      setIsRunning(false);
    }, 250);
  }, []);

  // Initial compile
  useEffect(() => {
    compilePreview(files);
  }, []);

  // Debounced auto-run when files change (if enabled)
  useEffect(() => {
    if (!settings.autoRun) return;

    const timer = setTimeout(() => {
      compilePreview(files);
    }, 700);

    return () => clearTimeout(timer);
  }, [files, settings.autoRun, compilePreview]);

  // Listen to sandbox postMessages (console logs and errors)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'DEVFORGE_CONSOLE') {
        const { level, text, timestamp } = event.data;
        setLogs(prev => [
          ...prev.slice(-150), // keep last 150 logs
          {
            id: `${Date.now()}-${Math.random()}`,
            level: level || 'log',
            text: text || '',
            timestamp: timestamp || new Date().toLocaleTimeString()
          }
        ]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        compilePreview(files);
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'E') {
        e.preventDefault();
        setActiveSidebarTab('explorer');
        setIsSidebarOpen(true);
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        setActiveSidebarTab('search');
        setIsSidebarOpen(true);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '`') {
        e.preventDefault();
        setIsConsoleOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsShortcutsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [files, compilePreview]);

  // File selection
  const handleSelectFile = (file: VirtualFile) => {
    if (file.isFolder) return;
    setActiveFileId(file.id);
    if (!openFileIds.includes(file.id)) {
      setOpenFileIds(prev => [...prev, file.id]);
    }
  };

  // Close tab
  const handleCloseTab = (fileId: string) => {
    const nextOpen = openFileIds.filter(id => id !== fileId);
    setOpenFileIds(nextOpen);
    if (activeFileId === fileId) {
      if (nextOpen.length > 0) {
        setActiveFileId(nextOpen[nextOpen.length - 1]);
      } else {
        setActiveFileId('');
      }
    }
  };

  // Close other tabs
  const handleCloseOtherTabs = (fileId: string) => {
    setOpenFileIds([fileId]);
    setActiveFileId(fileId);
  };

  // Content update
  const handleUpdateFileContent = (fileId: string, content: string) => {
    setFiles(prev =>
      prev.map(f => (f.id === fileId ? { ...f, content, isModified: true } : f))
    );
  };

  // Save file
  const handleSaveFile = (fileId: string) => {
    setFiles(prev =>
      prev.map(f => (f.id === fileId ? { ...f, isModified: false } : f))
    );
    compilePreview(files);
  };

  // Helper to determine language
  const detectLanguage = (filename: string): FileLanguage => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (filename.startsWith('.env')) return 'env';
    switch (ext) {
      case 'tsx':
      case 'ts':
        return 'typescript';
      case 'jsx':
      case 'js':
        return 'javascript';
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      case 'json':
        return 'json';
      case 'md':
        return 'markdown';
      default:
        return 'typescript';
    }
  };

  // Create file
  const handleCreateFile = (name: string, parentId: string | null) => {
    const parent = parentId ? files.find(f => f.id === parentId) : null;
    const parentPath = parent ? parent.path : '';
    const newPath = `${parentPath}/${name}`;
    const id = `f-${Date.now()}`;
    const lang = detectLanguage(name);

    let defaultContent = '';
    if (lang === 'typescript' || lang === 'javascript') {
      defaultContent = `import React from 'react';\n\nexport default function ${name.split('.')[0]}() {\n  return (\n    <div>\n      <h3>${name}</h3>\n    </div>\n  );\n}`;
    } else if (lang === 'json') {
      defaultContent = '{\n  \n}';
    } else if (lang === 'css') {
      defaultContent = '/* Custom CSS */\n';
    }

    const newFile: VirtualFile = {
      id,
      name,
      path: newPath,
      content: defaultContent,
      language: lang,
      isFolder: false,
      parentId,
      isModified: true
    };

    setFiles(prev => [...prev, newFile]);
    setOpenFileIds(prev => [...prev, id]);
    setActiveFileId(id);
  };

  // Upload file from local computer
  const handleUploadFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const id = `f-uploaded-${Date.now()}`;
      const name = file.name;
      const lang = detectLanguage(name);

      const newFile: VirtualFile = {
        id,
        name,
        path: `/${name}`,
        content: text,
        language: lang,
        isFolder: false,
        parentId: null,
        isModified: true
      };

      setFiles(prev => [...prev, newFile]);
      setOpenFileIds(prev => [...prev, id]);
      setActiveFileId(id);
    };
    reader.readAsText(file);
  };

  // Switch to a starter template
  const handleSelectTemplate = (template: ProjectTemplate) => {
    setFiles(prev =>
      prev.map(f =>
        f.path === '/src/App.tsx'
          ? { ...f, content: template.appCode, isModified: true }
          : f
      )
    );
    const appFile = files.find(f => f.path === '/src/App.tsx');
    if (appFile) {
      setActiveFileId(appFile.id);
      if (!openFileIds.includes(appFile.id)) {
        setOpenFileIds(prev => [...prev, appFile.id]);
      }
    }
    // Re-compile live preview
    const updated = files.map(f =>
      f.path === '/src/App.tsx'
        ? { ...f, content: template.appCode, isModified: true }
        : f
    );
    compilePreview(updated);
  };

  // Create folder
  const handleCreateFolder = (name: string, parentId: string | null) => {
    const parent = parentId ? files.find(f => f.id === parentId) : null;
    const parentPath = parent ? parent.path : '';
    const newPath = `${parentPath}/${name}`;
    const id = `dir-${Date.now()}`;

    const newFolder: VirtualFile = {
      id,
      name,
      path: newPath,
      content: '',
      language: 'typescript',
      isFolder: true,
      parentId
    };

    setFiles(prev => [...prev, newFolder]);
  };

  // Rename item
  const handleRenameItem = (id: string, newName: string) => {
    setFiles(prev => {
      const target = prev.find(f => f.id === id);
      if (!target) return prev;

      const pathSegments = target.path.split('/');
      pathSegments[pathSegments.length - 1] = newName;
      const newPath = pathSegments.join('/');

      return prev.map(f => {
        if (f.id === id) {
          return {
            ...f,
            name: newName,
            path: newPath,
            language: f.isFolder ? f.language : detectLanguage(newName)
          };
        }
        // If updating folder, update prefix of children
        if (target.isFolder && f.path.startsWith(target.path + '/')) {
          return {
            ...f,
            path: f.path.replace(target.path, newPath)
          };
        }
        return f;
      });
    });
  };

  // Delete item
  const handleDeleteItem = (id: string) => {
    const target = files.find(f => f.id === id);
    if (!target) return;

    if (!confirm(`Are you sure you want to delete "${target.name}"?`)) return;

    setFiles(prev => {
      if (target.isFolder) {
        return prev.filter(f => f.id !== id && !f.path.startsWith(target.path + '/'));
      }
      return prev.filter(f => f.id !== id);
    });

    handleCloseTab(id);
  };

  // Download project as ZIP
  const handleDownloadZip = () => {
    downloadProjectAsZip(files, 'devforge-app');
  };

  // Reset project
  const handleResetProject = () => {
    if (confirm('Reset workspace to original project template? Any unsaved local edits will be cleared.')) {
      setFiles(INITIAL_FILES);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setActiveFileId('f-app-tsx');
      setOpenFileIds(['f-app-tsx', 'f-index-css', 'f-package-json']);
      setLogs([]);
      compilePreview(INITIAL_FILES);
    }
  };

  // Insert snippet into active file
  const handleInsertSnippet = (snippetCode: string) => {
    if (!activeFile) return;
    const newContent = activeFile.content + '\n\n' + snippetCode;
    handleUpdateFileContent(activeFile.id, newContent);
  };

  // Execute JavaScript REPL in iframe context
  const handleExecuteJs = (code: string) => {
    try {
      // Evaluate locally or display in logs
      const result = eval(code);
      setLogs(prev => [
        ...prev,
        {
          id: `${Date.now()}`,
          level: 'log',
          text: `> ${code}\n< ${result !== undefined ? String(result) : 'undefined'}`,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } catch (err: any) {
      setLogs(prev => [
        ...prev,
        {
          id: `${Date.now()}`,
          level: 'error',
          text: `> ${code}\nError: ${err.message || String(err)}`,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#09090b] text-zinc-100 overflow-hidden font-sans selection:bg-blue-600/40">
      {/* Top Navigation Bar */}
      <Header
        activeFile={activeFile}
        layoutMode={layoutMode}
        setLayoutMode={setLayoutMode}
        onRunPreview={() => compilePreview(files)}
        onDownloadZip={handleDownloadZip}
        onNewFile={() => {
          setActiveSidebarTab('explorer');
          setIsSidebarOpen(true);
        }}
        onResetProject={handleResetProject}
        onOpenSnippets={() => {
          setActiveSidebarTab('templates');
          setIsSidebarOpen(true);
        }}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        onOpenDiff={() => setIsDiffOpen(true)}
        isRunning={isRunning}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Activity Rail */}
        <ActivityBar
          activeTab={activeSidebarTab}
          setActiveTab={setActiveSidebarTab}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(prev => !prev)}
          toggleConsole={() => setIsConsoleOpen(prev => !prev)}
          isConsoleOpen={isConsoleOpen}
          errorCount={errorCount}
        />

        {/* Collapsible Tool Drawer */}
        {isSidebarOpen && (
          <div className="w-64 sm:w-72 border-r border-zinc-800/80 bg-zinc-950 flex flex-col shrink-0 select-none">
            {activeSidebarTab === 'explorer' && (
              <FileExplorer
                files={files}
                activeFileId={activeFileId}
                onSelectFile={handleSelectFile}
                onCreateFile={handleCreateFile}
                onCreateFolder={handleCreateFolder}
                onRenameItem={handleRenameItem}
                onDeleteItem={handleDeleteItem}
                onDownloadFile={downloadSingleFile}
                onUploadFile={handleUploadFile}
              />
            )}
            {activeSidebarTab === 'search' && (
              <GlobalSearch
                files={files}
                onOpenFileAtLine={(file, line) => {
                  handleSelectFile(file);
                }}
              />
            )}
            {activeSidebarTab === 'templates' && (
              <SnippetsDrawer
                onInsertSnippet={handleInsertSnippet}
                activeFile={activeFile}
              />
            )}
            {activeSidebarTab === 'settings' && (
              <SettingsModal
                settings={settings}
                onUpdateSettings={(newVals) => setSettings(prev => ({ ...prev, ...newVals }))}
                onResetSettings={() => setSettings(DEFAULT_SETTINGS)}
              />
            )}
          </div>
        )}

        {/* Work Area: Editor & Live Preview */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="flex-1 flex min-h-0 overflow-hidden">
            {/* Code Editor Pane */}
            {(layoutMode === 'split' || layoutMode === 'editor-only') && (
              <div className={`h-full min-w-0 ${layoutMode === 'split' ? 'w-1/2 border-r border-zinc-800/80' : 'w-full'}`}>
                <CodeEditor
                  files={files}
                  activeFile={activeFile}
                  openFileIds={openFileIds}
                  onSelectTab={setActiveFileId}
                  onCloseTab={handleCloseTab}
                  onCloseOtherTabs={handleCloseOtherTabs}
                  onUpdateFileContent={handleUpdateFileContent}
                  onSaveFile={handleSaveFile}
                  settings={settings}
                />
              </div>
            )}

            {/* Live Preview Pane */}
            {(layoutMode === 'split' || layoutMode === 'preview-only') && (
              <div className={`h-full min-w-0 ${layoutMode === 'split' ? 'w-1/2' : 'w-full'}`}>
                <LivePreview
                  htmlPayload={htmlPayload}
                  onRefresh={() => compilePreview(files)}
                  isRunning={isRunning}
                />
              </div>
            )}
          </div>

          {/* Bottom Console Drawer */}
          {isConsoleOpen && (
            <ConsoleDrawer
              logs={logs}
              onClearLogs={() => setLogs([])}
              onClose={() => setIsConsoleOpen(false)}
              onExecuteJs={handleExecuteJs}
            />
          )}
        </div>
      </div>

      {/* Shortcuts Modal */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Starter Templates Modal */}
      <TemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />

      {/* Diff Inspector Modal */}
      <DiffViewerModal
        isOpen={isDiffOpen}
        onClose={() => setIsDiffOpen(false)}
        activeFile={activeFile}
        files={files}
      />
    </div>
  );
}
