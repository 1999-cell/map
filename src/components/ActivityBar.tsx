import React from 'react';
import { Files, Search, Sparkles, Sliders, Terminal } from 'lucide-react';
import { ActiveSidebarTab } from '../types';

interface ActivityBarProps {
  activeTab: ActiveSidebarTab;
  setActiveTab: (tab: ActiveSidebarTab) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  toggleConsole: () => void;
  isConsoleOpen: boolean;
  errorCount: number;
}

export function ActivityBar({
  activeTab,
  setActiveTab,
  isSidebarOpen,
  toggleSidebar,
  toggleConsole,
  isConsoleOpen,
  errorCount
}: ActivityBarProps) {
  const handleTabClick = (tab: ActiveSidebarTab) => {
    if (activeTab === tab && isSidebarOpen) {
      toggleSidebar();
    } else {
      setActiveTab(tab);
      if (!isSidebarOpen) toggleSidebar();
    }
  };

  return (
    <aside className="w-12 bg-zinc-950 border-r border-zinc-800 flex flex-col items-center justify-between py-2 shrink-0 select-none z-10">
      {/* Top Tool Icons */}
      <div className="flex flex-col items-center gap-1 w-full">
        <button
          onClick={() => handleTabClick('explorer')}
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition relative ${
            isSidebarOpen && activeTab === 'explorer'
              ? 'text-white bg-zinc-800/90'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
          }`}
          title="File Explorer (Ctrl+Shift+E)"
        >
          <Files className="w-5 h-5" />
          {isSidebarOpen && activeTab === 'explorer' && (
            <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-blue-500 rounded-r" />
          )}
        </button>

        <button
          onClick={() => handleTabClick('search')}
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition relative ${
            isSidebarOpen && activeTab === 'search'
              ? 'text-white bg-zinc-800/90'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
          }`}
          title="Search in Files (Ctrl+Shift+F)"
        >
          <Search className="w-5 h-5" />
          {isSidebarOpen && activeTab === 'search' && (
            <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-blue-500 rounded-r" />
          )}
        </button>

        <button
          onClick={() => handleTabClick('templates')}
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition relative ${
            isSidebarOpen && activeTab === 'templates'
              ? 'text-white bg-zinc-800/90'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
          }`}
          title="Snippets & Templates"
        >
          <Sparkles className="w-5 h-5" />
          {isSidebarOpen && activeTab === 'templates' && (
            <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-blue-500 rounded-r" />
          )}
        </button>
      </div>

      {/* Bottom Tool Icons */}
      <div className="flex flex-col items-center gap-1 w-full">
        <button
          onClick={toggleConsole}
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition relative ${
            isConsoleOpen
              ? 'text-white bg-zinc-800/90'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
          }`}
          title="Toggle Console / Diagnostics (Ctrl+\`)"
        >
          <Terminal className="w-5 h-5" />
          {errorCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
          )}
        </button>

        <button
          onClick={() => handleTabClick('settings')}
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition relative ${
            isSidebarOpen && activeTab === 'settings'
              ? 'text-white bg-zinc-800/90'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
          }`}
          title="Editor Settings"
        >
          <Sliders className="w-5 h-5" />
          {isSidebarOpen && activeTab === 'settings' && (
            <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-blue-500 rounded-r" />
          )}
        </button>
      </div>
    </aside>
  );
}
