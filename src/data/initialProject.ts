import { VirtualFile } from '../types';

export const INITIAL_FILES: VirtualFile[] = [
  // Root files
  {
    id: 'f-index-html',
    name: 'index.html',
    path: '/index.html',
    isFolder: false,
    parentId: null,
    language: 'html',
    content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>DevForge App</title>
    <!-- Tailwind CSS CDN for instant live preview -->
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <style>
      body {
        font-family: 'Plus Jakarta Sans', sans-serif;
        background-color: #09090b;
        color: #f4f4f5;
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`,
  },
  {
    id: 'f-package-json',
    name: 'package.json',
    path: '/package.json',
    isFolder: false,
    parentId: null,
    language: 'json',
    content: `{
  "name": "devforge-workspace",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --port=3000 --host=0.0.0.0",
    "build": "vite build",
    "lint": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^19.0.1",
    "react-dom": "^19.0.1",
    "lucide-react": "^0.546.0",
    "tailwindcss": "^4.3.3"
  }
}`,
  },
  {
    id: 'f-metadata-json',
    name: 'metadata.json',
    path: '/metadata.json',
    isFolder: false,
    parentId: null,
    language: 'json',
    content: `{
  "name": "DevForge — Web IDE & Workspace",
  "description": "In-browser development environment with file explorer, multi-tab code editor, live sandboxed preview, and instant code updates.",
  "requestFramePermissions": [],
  "majorCapabilities": ["MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API"]
}`,
  },
  {
    id: 'f-env-example',
    name: '.env.example',
    path: '/.env.example',
    isFolder: false,
    parentId: null,
    language: 'env',
    content: `# GEMINI_API_KEY: Required for Gemini AI API calls.
GEMINI_API_KEY="MY_GEMINI_API_KEY"

# APP_URL: Development and production URL
APP_URL="https://localhost:3000"`,
  },
  {
    id: 'f-tsconfig-json',
    name: 'tsconfig.json',
    path: '/tsconfig.json',
    isFolder: false,
    parentId: null,
    language: 'json',
    content: `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "skipLibCheck": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}`,
  },
  {
    id: 'f-vite-config',
    name: 'vite.config.ts',
    path: '/vite.config.ts',
    isFolder: false,
    parentId: null,
    language: 'typescript',
    content: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    host: '0.0.0.0'
  }
});`,
  },
  {
    id: 'f-readme',
    name: 'README.md',
    path: '/README.md',
    isFolder: false,
    parentId: null,
    language: 'markdown',
    content: `# DevForge Development Environment

Welcome to your browser IDE workspace.

### Features
- **Multi-File Editing**: Open, create, rename, and delete project files.
- **Instant Live Preview**: React components render immediately in the sandbox pane.
- **Interactive Console**: Logs, warnings, errors, and live JavaScript REPL.
- **Export & Download**: Download your updated project files or full ZIP archive anytime.
- **Responsive Previews**: Switch between Desktop, Tablet, and Mobile viewports with a single click.`,
  },

  // Folders
  {
    id: 'dir-src',
    name: 'src',
    path: '/src',
    isFolder: true,
    parentId: null,
    language: 'typescript',
    content: '',
  },
  {
    id: 'dir-components',
    name: 'components',
    path: '/src/components',
    isFolder: true,
    parentId: 'dir-src',
    language: 'typescript',
    content: '',
  },

  // Files in src/
  {
    id: 'f-app-tsx',
    name: 'App.tsx',
    path: '/src/App.tsx',
    isFolder: false,
    parentId: 'dir-src',
    language: 'typescript',
    content: `import React, { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Inspect workspace files', done: true },
    { id: 2, title: 'Edit App.tsx code', done: false },
    { id: 3, title: 'Observe instant live preview', done: false },
  ]);
  const [inputVal, setInputVal] = useState('');

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
    console.log(\`Task \${id} toggled\`);
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    const newTask = { id: Date.now(), title: inputVal.trim(), done: false };
    setTasks([...tasks, newTask]);
    console.log('Added task:', newTask.title);
    setInputVal('');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="border-b border-zinc-800 pb-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-400">DevForge Preview</span>
            <span className="text-xs text-zinc-400 font-mono">React 19 + Tailwind</span>
          </div>
          <h1 className="text-2xl font-bold mt-1 text-white">Interactive Sandbox</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Edit code in <code className="text-blue-400 bg-zinc-800 px-1 py-0.5 rounded text-xs font-mono">App.tsx</code> to see live updates instantly!
          </p>
        </div>

        {/* Counter Widget */}
        <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-lg p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-zinc-400">Interactive Counter</span>
            <div className="text-2xl font-bold font-mono text-emerald-400">{count}</div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => { setCount(c => c - 1); console.log('Count:', count - 1); }}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-sm font-semibold transition"
            >
              -
            </button>
            <button 
              onClick={() => { setCount(c => c + 1); console.log('Count:', count + 1); }}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm font-semibold transition shadow"
            >
              Increment
            </button>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Project Checklist</span>
            <span>{tasks.filter(t => t.done).length} / {tasks.length} completed</span>
          </div>
          
          <form onSubmit={addTask} className="flex gap-2">
            <input 
              type="text" 
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Add a new test task..."
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500"
            />
            <button 
              type="submit"
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-sm font-medium transition"
            >
              Add
            </button>
          </form>

          <div className="space-y-1.5 pt-1">
            {tasks.map(task => (
              <div 
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className="flex items-center gap-3 p-2.5 rounded bg-zinc-950/40 hover:bg-zinc-800/40 border border-zinc-800/60 cursor-pointer transition text-sm"
              >
                <input 
                  type="checkbox" 
                  checked={task.done} 
                  onChange={() => {}} 
                  className="rounded border-zinc-700 text-blue-500 focus:ring-0 cursor-pointer"
                />
                <span className={task.done ? "line-through text-zinc-500" : "text-zinc-200"}>
                  {task.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-2 text-center text-xs text-zinc-500 font-mono">
          Press Ctrl+S or click Run in the editor to re-render.
        </div>
      </div>
    </div>
  );
}`,
  },
  {
    id: 'f-main-tsx',
    name: 'main.tsx',
    path: '/src/main.tsx',
    isFolder: false,
    parentId: 'dir-src',
    language: 'typescript',
    content: `import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);`,
  },
  {
    id: 'f-index-css',
    name: 'index.css',
    path: '/src/index.css',
    isFolder: false,
    parentId: 'dir-src',
    language: 'css',
    content: `@import "tailwindcss";

:root {
  color-scheme: dark;
}

body {
  margin: 0;
  font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  background-color: #09090b;
  color: #f4f4f5;
  -webkit-font-smoothing: antialiased;
}`,
  },
  {
    id: 'f-statcard-tsx',
    name: 'StatCard.tsx',
    path: '/src/components/StatCard.tsx',
    isFolder: false,
    parentId: 'dir-components',
    language: 'typescript',
    content: `import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export function StatCard({ label, value, change, trend = 'neutral' }: StatCardProps) {
  const trendColor = trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-rose-400' : 'text-zinc-400';

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-1">
      <div className="text-xs text-zinc-400 font-medium">{label}</div>
      <div className="text-2xl font-bold font-mono text-zinc-100">{value}</div>
      {change && (
        <div className={\`text-xs \${trendColor} font-mono flex items-center gap-1\`}>
          <span>{trend === 'up' ? '↑' : trend === 'down' ? '↓' : '•'}</span>
          <span>{change}</span>
        </div>
      )}
    </div>
  );
}`,
  },
];
