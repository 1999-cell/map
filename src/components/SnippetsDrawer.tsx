import React from 'react';
import { Copy, Plus, Check } from 'lucide-react';
import { VirtualFile } from '../types';

interface Snippet {
  id: string;
  title: string;
  category: string;
  description: string;
  code: string;
}

const SNIPPETS: Snippet[] = [
  {
    id: 'react-component',
    title: 'Standard React Component',
    category: 'React',
    description: 'Boilerplate functional component with typed props',
    code: `import React from 'react';

interface ComponentProps {
  title: string;
  description?: string;
}

export function CustomWidget({ title, description }: ComponentProps) {
  return (
    <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {description && <p className="text-sm text-zinc-400 mt-1">{description}</p>}
    </div>
  );
}`
  },
  {
    id: 'state-toggle',
    title: 'Interactive Toggle Button',
    category: 'React & State',
    description: 'Toggle switch with smooth CSS transition and state',
    code: `const [enabled, setEnabled] = useState(false);

return (
  <button
    onClick={() => setEnabled(!enabled)}
    className={\`relative inline-flex h-6 w-11 items-center rounded-full transition-colors \${
      enabled ? 'bg-blue-600' : 'bg-zinc-700'
    }\`}
  >
    <span
      className={\`inline-block h-4 w-4 transform rounded-full bg-white transition-transform \${
        enabled ? 'translate-x-6' : 'translate-x-1'
      }\`}
    />
  </button>
);`
  },
  {
    id: 'tailwind-grid',
    title: 'Responsive 3-Column Grid',
    category: 'Layout',
    description: 'Mobile 1-col, tablet 2-col, desktop 3-col card grid',
    code: `<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">Card 1</div>
  <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">Card 2</div>
  <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">Card 3</div>
</div>`
  },
  {
    id: 'badge-pill-free',
    title: 'Clean Unboxed Metadata',
    category: 'Design System',
    description: 'Anti-slop clean metadata row with subtle typographic separators',
    code: `<div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
  <span>Frontend</span>
  <span aria-hidden="true">·</span>
  <span>TypeScript</span>
  <span aria-hidden="true">·</span>
  <span className="text-emerald-400">Ready</span>
</div>`
  },
  {
    id: 'tailwind-modal',
    title: 'Modal Dialog Box',
    category: 'Components',
    description: 'Centered modal backdrop with title, body, and action buttons',
    code: `<div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
  <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-md w-full p-6 shadow-2xl">
    <h3 className="text-lg font-bold text-white">Confirm Action</h3>
    <p className="text-sm text-zinc-400 mt-2">Are you sure you want to proceed with this operation?</p>
    <div className="mt-6 flex justify-end gap-3">
      <button className="px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 rounded-lg">Cancel</button>
      <button className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded-lg">Confirm</button>
    </div>
  </div>
</div>`
  }
];

interface SnippetsDrawerProps {
  onInsertSnippet: (code: string) => void;
  activeFile: VirtualFile | null;
}

export function SnippetsDrawer({ onInsertSnippet, activeFile }: SnippetsDrawerProps) {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = (snippet: Snippet) => {
    navigator.clipboard.writeText(snippet.code);
    setCopiedId(snippet.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-zinc-300 select-none">
      <div className="h-9 px-3 border-b border-zinc-800/80 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-zinc-400">
        <span>Code Snippets</span>
      </div>

      <div className="p-3 text-xs text-zinc-400 border-b border-zinc-900">
        Click <strong className="text-zinc-200">Insert</strong> to append snippet directly into{' '}
        <span className="font-mono text-blue-400">{activeFile ? activeFile.name : 'active file'}</span>, or copy to clipboard.
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-3">
        {SNIPPETS.map(snippet => (
          <div
            key={snippet.id}
            className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition space-y-2"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-zinc-200">{snippet.title}</h4>
                <span className="text-[10px] text-zinc-500 font-mono">{snippet.category}</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleCopy(snippet)}
                  className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition"
                  title="Copy snippet"
                >
                  {copiedId === snippet.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  onClick={() => onInsertSnippet(snippet.code)}
                  className="flex items-center gap-1 px-2 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 border border-blue-500/30 rounded text-[11px] font-medium transition"
                  title="Insert into editor"
                >
                  <Plus className="w-3 h-3" />
                  <span>Insert</span>
                </button>
              </div>
            </div>

            <p className="text-[11px] text-zinc-400 leading-relaxed">{snippet.description}</p>

            <pre className="p-2 rounded bg-zinc-950 border border-zinc-800/80 font-mono text-[10px] text-zinc-300 overflow-x-auto max-h-24">
              {snippet.code}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
