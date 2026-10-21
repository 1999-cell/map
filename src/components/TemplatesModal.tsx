import React from 'react';
import { LayoutGrid, Check, Sparkles, X, ArrowRight } from 'lucide-react';

export interface ProjectTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  appCode: string;
}

export const STARTER_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'saas-dashboard',
    name: 'SaaS Analytics Dashboard',
    category: 'Analytics & Admin',
    description: 'Executive dashboard with KPI metric cards, revenue trends, and recent transaction table.',
    appCode: `import React, { useState } from 'react';

export default function App() {
  const [timeRange, setTimeRange] = useState('7d');

  const metrics = [
    { label: 'Total Revenue', value: '$48,290', change: '+14.2%', trend: 'up' },
    { label: 'Active Subscriptions', value: '1,429', change: '+8.1%', trend: 'up' },
    { label: 'Avg. Churn Rate', value: '1.2%', change: '-0.4%', trend: 'down' },
    { label: 'API Uptime', value: '99.98%', change: '+0.01%', trend: 'up' },
  ];

  const transactions = [
    { id: 'tx-1', client: 'Acme Corp', plan: 'Enterprise Annual', amount: '$12,000', status: 'Completed', date: 'Oct 21, 2026' },
    { id: 'tx-2', client: 'Starlight Labs', plan: 'Scale Tier', amount: '$4,500', status: 'Completed', date: 'Oct 20, 2026' },
    { id: 'tx-3', client: 'Quantum Cloud', plan: 'Developer Pro', amount: '$490', status: 'Processing', date: 'Oct 20, 2026' },
    { id: 'tx-4', client: 'Nexus AI', plan: 'Enterprise Monthly', amount: '$2,800', status: 'Completed', date: 'Oct 19, 2026' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
              <span>Platform</span>
              <span>·</span>
              <span>Production Metrics</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white mt-1">Executive Overview</h1>
          </div>

          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-1 rounded-lg text-xs font-medium">
            {['24h', '7d', '30d', '90d'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={\`px-3 py-1 rounded transition \${timeRange === range ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}\`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map(m => (
            <div key={m.label} className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl space-y-1">
              <div className="text-xs text-zinc-400">{m.label}</div>
              <div className="text-2xl font-bold font-mono text-white tracking-tight">{m.value}</div>
              <div className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                <span>{m.change}</span>
                <span className="text-zinc-500 font-sans">vs prior period</span>
              </div>
            </div>
          ))}
        </div>

        {/* Transactions Table */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Recent Settlements</h3>
            <span className="text-xs text-zinc-500 font-mono">Live Sync</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-zinc-950/60 text-zinc-400 border-b border-zinc-800">
                <tr>
                  <th className="py-2.5 px-4 font-medium">Client</th>
                  <th className="py-2.5 px-4 font-medium">Plan</th>
                  <th className="py-2.5 px-4 font-medium">Amount</th>
                  <th className="py-2.5 px-4 font-medium">Status</th>
                  <th className="py-2.5 px-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-mono">
                {transactions.map(t => (
                  <tr key={t.id} className="hover:bg-zinc-800/30 transition">
                    <td className="py-3 px-4 font-sans font-medium text-zinc-200">{t.client}</td>
                    <td className="py-3 px-4 text-zinc-400 font-sans">{t.plan}</td>
                    <td className="py-3 px-4 text-white font-bold">{t.amount}</td>
                    <td className="py-3 px-4 font-sans">
                      <span className="text-xs text-emerald-400">● {t.status}</span>
                    </td>
                    <td className="py-3 px-4 text-zinc-500 text-[11px]">{t.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}`
  },
  {
    id: 'kanban-board',
    name: 'Kanban Task Manager',
    category: 'Productivity',
    description: 'Multi-column task board with status workflow, quick task adder, and priority tags.',
    appCode: `import React, { useState } from 'react';

interface Task {
  id: string;
  title: string;
  col: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'med' | 'high';
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Implement OAuth refresh token rotation', col: 'todo', priority: 'high' },
    { id: '2', title: 'Review Tailwind v4 theme color tokens', col: 'todo', priority: 'low' },
    { id: '3', title: 'Optimize live preview sandbox bundle', col: 'in_progress', priority: 'high' },
    { id: '4', title: 'Write comprehensive integration tests', col: 'in_progress', priority: 'med' },
    { id: '5', title: 'Setup production Cloud Run instance', col: 'done', priority: 'med' },
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState('');

  const moveTask = (id: string, targetCol: Task['col']) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, col: targetCol } : t));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setTasks([...tasks, {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      col: 'todo',
      priority: 'med'
    }]);
    setNewTaskTitle('');
  };

  const columns = [
    { key: 'todo' as const, label: 'Backlog & Ready', count: tasks.filter(t => t.col === 'todo').length },
    { key: 'in_progress' as const, label: 'In Progress', count: tasks.filter(t => t.col === 'in_progress').length },
    { key: 'done' as const, label: 'Shipped', count: tasks.filter(t => t.col === 'done').length },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div>
            <h1 className="text-xl font-bold text-white">Sprint Board</h1>
            <p className="text-xs text-zinc-400 mt-0.5">Q4 Core Engineering Milestones</p>
          </div>

          <form onSubmit={addTask} className="flex gap-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={e => setNewTaskTitle(e.target.value)}
              placeholder="Add new task..."
              className="bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 w-56"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold transition"
            >
              Add
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map(col => (
            <div key={col.key} className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-3 flex flex-col min-h-[400px]">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-bold text-zinc-200">{col.label}</span>
                <span className="text-[11px] font-mono bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">{col.count}</span>
              </div>

              <div className="space-y-2 flex-1">
                {tasks.filter(t => t.col === col.key).map(task => (
                  <div key={task.id} className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg shadow-sm space-y-2 group">
                    <p className="text-xs text-zinc-200 font-medium leading-relaxed">{task.title}</p>
                    <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                      <span className={task.priority === 'high' ? 'text-rose-400' : 'text-zinc-400'}>
                        {task.priority.toUpperCase()}
                      </span>
                      <div className="flex gap-1 opacity-60 group-hover:opacity-100 transition">
                        {col.key !== 'todo' && (
                          <button onClick={() => moveTask(task.id, 'todo')} className="hover:text-white px-1">◀</button>
                        )}
                        {col.key !== 'in_progress' && (
                          <button onClick={() => moveTask(task.id, 'in_progress')} className="hover:text-blue-400 px-1">●</button>
                        )}
                        {col.key !== 'done' && (
                          <button onClick={() => moveTask(task.id, 'done')} className="hover:text-emerald-400 px-1">▶</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`
  },
  {
    id: 'ecommerce-showcase',
    name: 'Modern E-Commerce Store',
    category: 'Retail & Commerce',
    description: 'Clean product catalog with category filter, shopping bag counter, and instant cart calculation.',
    appCode: `import React, { useState } from 'react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
}

export default function App() {
  const [selectedCat, setSelectedCat] = useState('All');
  const [cartCount, setCartCount] = useState(0);

  const products: Product[] = [
    { id: '1', name: 'Studio Mechanical Keyboard', category: 'Hardware', price: 180, rating: 4.9 },
    { id: '2', name: 'Precision Ergonomic Mouse', category: 'Hardware', price: 95, rating: 4.8 },
    { id: '3', name: 'Acoustic Soundproofing Mat', category: 'Accessories', price: 45, rating: 4.7 },
    { id: '4', name: 'Anodized Aluminum Monitor Stand', category: 'Furniture', price: 120, rating: 4.9 },
    { id: '5', name: 'Braided Type-C Fast Cable', category: 'Accessories', price: 28, rating: 4.6 },
    { id: '6', name: 'Minimalist Desk Pad XL', category: 'Accessories', price: 55, rating: 4.8 },
  ];

  const categories = ['All', 'Hardware', 'Accessories', 'Furniture'];

  const filtered = selectedCat === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCat);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Kinesis Studio Gear</h1>
            <p className="text-xs text-zinc-400 mt-0.5">Architectural workspace hardware</p>
          </div>

          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg text-xs font-mono">
            <span>Bag:</span>
            <span className="text-blue-400 font-bold">{cartCount} items</span>
          </div>
        </div>

        {/* Filter categories */}
        <div className="flex gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={\`px-3 py-1 rounded-md text-xs font-medium transition \${
                selectedCat === cat 
                  ? 'bg-white text-zinc-950 font-bold' 
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
              }\`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(item => (
            <div key={item.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex flex-col justify-between space-y-4 hover:border-zinc-700 transition">
              <div>
                <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                  <span>{item.category}</span>
                  <span className="text-amber-400">★ {item.rating}</span>
                </div>
                <h3 className="text-sm font-semibold text-white mt-2 leading-snug">{item.name}</h3>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
                <span className="text-base font-bold font-mono text-white">\${item.price}</span>
                <button
                  onClick={() => setCartCount(c => c + 1)}
                  className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-xs font-medium transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`
  }
];

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: ProjectTemplate) => void;
}

export function TemplatesModal({ isOpen, onClose, onSelectTemplate }: TemplatesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 select-none">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="text-base font-bold text-white">Starter Project Templates</h3>
              <p className="text-xs text-zinc-400">Instantly replace App.tsx with a production-ready application layout</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {STARTER_TEMPLATES.map(t => (
            <div
              key={t.id}
              onClick={() => {
                onSelectTemplate(t);
                onClose();
              }}
              className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800 hover:border-blue-500/80 hover:bg-zinc-950 cursor-pointer transition flex flex-col justify-between space-y-3 group"
            >
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400">{t.category}</span>
                <h4 className="text-sm font-bold text-white mt-1 group-hover:text-blue-300 transition">{t.name}</h4>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{t.description}</p>
              </div>

              <div className="flex items-center gap-1 text-xs text-blue-400 font-medium group-hover:translate-x-1 transition-transform">
                <span>Load Template</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
