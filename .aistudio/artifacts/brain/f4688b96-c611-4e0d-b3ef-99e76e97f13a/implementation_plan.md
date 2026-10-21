# DevForge — In-Browser Development Environment & Live Workspace

A production-grade, VS Code-inspired browser development environment featuring an interactive file tree, multi-tab code editor with syntax highlighting and line numbers, real-time live preview sandbox, file creation/editing/updating/deletion, and import/export capabilities.

### User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and aesthetic choices were confirmed from your selections and are set as the baseline for implementation:

- **Confirmed Environment Type**: Full-featured web code editor with live preview and interactive file explorer.
- **Confirmed Aesthetic Direction**: Modern dark IDE theme inspired by VS Code (`#18181b` canvas, `#09090b` sidebars, `#27272a` borders, syntax token highlighting, and monospace tabular numerals).
- **Confirmed Core Capability**: Multi-file editing with live syntax highlighting, multi-tab navigation, line numbers, and instant file synchronization with an isolated live preview iframe.
- **Interactive File Management**: Full file operations including create file/folder, rename, edit, update, delete, search in files, and export/download project zip or JSON.

---

### 1. Overview & Core Concept

- **What It Does**: DevForge provides a self-contained, responsive browser IDE and playground. It pre-populates the repository's files (`index.html`, `package.json`, `metadata.json`, `src/App.tsx`, `src/main.tsx`, `src/index.css`, `vite.config.ts`, `tsconfig.json`, `.env.example`, etc.), allows developers to inspect, edit, create, and delete files, switch between multiple tabs, format code, and immediately see rendered HTML/CSS/JS results inside a sandboxed live preview with console output.
- **Target Audience / Persona**: Developers, designers, and testers who need a rapid playground to test UI components, edit code, update templates, prototype HTML/React widgets, and inspect repository configuration files directly in the browser without local setup friction.
- **Key Value**: Zero setup friction, instantaneous live preview feedback, complete file CRUD operations, search across project files, and full keyboard-friendly developer experience.

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **Explore Project Files**: The left sidebar renders the complete project tree with directory collapsing, file status markers, file extensions, and quick actions (new file, new folder, collapse all, search).
2. **Open & Multi-Tab Editing**: Clicking any file opens it in the active editor tab. Users can keep multiple tabs open, switch between them, reorder or close tabs, and see dirty/unsaved state indicators.
3. **Edit & Live Update**: As the user edits code (with syntax highlighting, line numbers, bracket matching, indentation support, and code formatting), the live preview updates automatically (with debounced compilation) or upon manual trigger.
4. **Inspect Live Preview & Console**: The split pane features a responsive sandboxed iframe with viewport toggles (Desktop 100%, Tablet 768px, Mobile 375px), refresh, popout view, and an expandable interactive console log drawer capturing stdout, warnings, and errors.
5. **Project Operations**: Quick header action bar to download project snapshot, upload/import files, reset to defaults, and toggle view modes (split editor/preview, editor-only, preview-only).

#### Visual Identity & Theme
- **Aesthetic Direction**: VS Code Dark modern studio aesthetic with high contrast, precise 1px borders, subtle hover highlights, and authentic IDE typography.
- **Color Palette**:
  - Deep Canvas: `#09090b` (activity bar and status bar)
  - Editor Background: `#121214` (active editing area)
  - Sidebar & Panels: `#18181b` (file explorer, tabs, console)
  - Surface Hairlines: `#27272a` (1px dividers and tab separators)
  - Primary Accent: `#3b82f6` (blue cursor focus, active tab top bar, primary actions)
  - Semantic Status: Emerald `#10b981` (clean/saved), Amber `#f59e0b` (dirty/modified), Rose `#f43f5e` (errors)
- **Typography & Scale**:
  - UI Labels & Headers: `Plus Jakarta Sans` / system sans (12px–14px, medium/semibold)
  - Code Editor & Logs: `JetBrains Mono` / `Menlo` monospace font with `font-variant-numeric: tabular-nums`
- **Component Styling & Layout**:
  - 3-Zone top bar: Project title & active breadcrumb on left, layout mode switches in center, action buttons (New File, Run Preview, Download) on right.
  - Left activity bar with icons (Explorer, Search, Settings, Help).
  - Resizable split panes for file tree, code editor, and live preview.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Client-Side Virtual File System with Initial Repo Seeding**
  - *Chosen Approach*: Maintain an in-memory reactive file system state pre-seeded with the project's actual repository files (`App.tsx`, `index.html`, `package.json`, etc.) with `localStorage` backup persistence.
  - *Why*: Allows rapid, latency-free file editing, undo/redo, file renaming, creation, and deletion without risking destructive file system accidents or server crashes.
  - *Alternatives Considered*: Direct disk file mutation via server endpoints was evaluated; however, in-browser sandbox safety and instant preview reactivity make virtualized project state with export/download vastly more responsive and reliable.
- **Decision 2: Live Sandboxed Code Execution Engine**
  - *Chosen Approach*: Dynamic `srcdoc` iframe runtime with automatic Babel/TypeScript transpilation for JSX/TSX and HTML/CSS injection, paired with a captured postMessage console bridge.
  - *Why*: Provides immediate visual rendering of React components and HTML/CSS changes without requiring a slow backend bundler build loop for every keystroke.
- **Decision 3: Multi-Tab Editor Architecture with Syntax Highlighting**
  - *Chosen Approach*: Custom lightweight syntax-highlighted editor with line numbering, scroll synchronization, auto-indentation, and quick snippet insertions.
  - *Why*: Guarantees rock-solid reliability, zero external heavy script loading failures in sandbox iframe environments, and ultra-crisp responsive performance.

---

### 4. Technical Architecture & Data Strategy

#### System & Component Architecture
```
┌────────────────────────────────────────────────────────────────────────┐
│                        Top Navigation Bar                              │
│  [DevForge IDE] · [Active Breadcrumb] ── [Split / Full] ── [Run/Export]│
├────────┬─────────────────────────────┬─────────────────────────────────┤
│ Activity│ File Explorer & Search      │ Active Tabs (App.tsx | CSS)     │
│ Bar    ├─────────────────────────────┼─────────────────────────────────┤
│        │ ▾ src                       │ 1  import React from 'react';   │
│ [Files]│   ▸ components              │ 2                               │
│ [Search│     App.tsx       (modified)│ 3  export default function App()│
│ [Config│     main.tsx                │ 4    return (                   │
│        │     index.css               │ 5      <div className="p-4">... │
│        │   package.json              │ 6    );                         │
│        │   index.html                │ 7  }                            │
│        ├─────────────────────────────┴─────────────────────────────────┤
│        │ Live Sandbox Preview                    Interactive Console   │
│        │ ┌──────────────────────────────────────┐ [Logs] [Warn] [Clear]│
│        │ │  Preview Viewport (Desktop / Mobile) │ > App mounted        │
│        │ │  [Rendered React / HTML Output]      │ > Ready              │
│        │ └──────────────────────────────────────┘                      │
├────────┴───────────────────────────────────────────────────────────────┤
│ Status Bar: [Branch: main] · [UTF-8] · [TypeScript React] · [Ln 5, Col 12]
└────────────────────────────────────────────────────────────────────────┘
```

#### State Model
- `VirtualFile`: `{ id: string, name: string, path: string, content: string, language: string, isModified: boolean, isFolder: boolean, parentId: string | null }`
- `EditorState`: `{ openFileIds: string[], activeFileId: string, cursorPosition: { line: number, col: number }, layout: 'split' | 'editor-only' | 'preview-only', previewDevice: 'desktop' | 'tablet' | 'mobile' }`
- `ConsoleLog`: `{ id: string, type: 'log' | 'info' | 'warn' | 'error', message: string, timestamp: number }`

#### Interactive Component & State Mapping
- **File Explorer**: Create file/folder dialogs, inline rename on double-click, delete with confirmation, collapse/expand folders, and file search filter.
- **Code Editor**: Tab close/switch handlers, line number gutter, keyboard shortcuts (`Ctrl+S` / `Cmd+S` to trigger preview refresh, `Tab` for 2 spaces, `Ctrl+F` for find), formatted syntax highlighting.
- **Live Preview Runtime**: Debounced compiler that extracts HTML, CSS, and transpiles JSX/TSX into executable bundles passed to the sandboxed iframe, with message listener for console logs.
- **Top Bar Actions**: New File, Format Code, Reset to Template, Download Project ZIP/JSON, Viewport switcher.
