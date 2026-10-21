import React, { useState } from 'react';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  RotateCw, 
  ExternalLink,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { ViewportDevice } from '../types';

interface LivePreviewProps {
  htmlPayload: string;
  onRefresh: () => void;
  isRunning: boolean;
}

export function LivePreview({
  htmlPayload,
  onRefresh,
  isRunning
}: LivePreviewProps) {
  const [device, setDevice] = useState<ViewportDevice>('desktop');
  const [scale, setScale] = useState<number>(100);

  const handlePopout = () => {
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(htmlPayload);
      newWindow.document.close();
    }
  };

  const getContainerWidth = () => {
    switch (device) {
      case 'mobile':
        return 'w-[375px] h-[667px] shadow-2xl rounded-2xl border-4 border-zinc-800 my-auto';
      case 'tablet':
        return 'w-[768px] h-[90%] shadow-2xl rounded-xl border-4 border-zinc-800 my-auto';
      case 'desktop':
      default:
        return 'w-full h-full';
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0e0e10] border-l border-zinc-800/80 overflow-hidden select-none">
      {/* Top Preview Control Bar */}
      <div className="h-9 bg-zinc-950 border-b border-zinc-800 px-3 flex items-center justify-between text-xs shrink-0 select-none">
        {/* Device Switcher */}
        <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-0.5 rounded-lg">
          <button
            onClick={() => setDevice('desktop')}
            className={`p-1 rounded transition ${
              device === 'desktop' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title="Desktop 100%"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDevice('tablet')}
            className={`p-1 rounded transition ${
              device === 'tablet' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title="Tablet (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDevice('mobile')}
            className={`p-1 rounded transition ${
              device === 'mobile' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title="Mobile (375px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Pseudo Browser Address Bar */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900/80 border border-zinc-800/80 rounded-md text-[11px] font-mono text-zinc-400 max-w-xs truncate">
          <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
          <span className="truncate">sandbox://localhost:3000</span>
        </div>

        {/* Preview Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={onRefresh}
            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition"
            title="Reload Preview Sandbox"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin text-blue-400' : ''}`} />
          </button>
          <button
            onClick={handlePopout}
            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition"
            title="Open in popout window"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex-1 bg-[#09090b] flex items-center justify-center p-2 overflow-auto">
        <div className={`transition-all duration-200 flex flex-col overflow-hidden bg-zinc-950 ${getContainerWidth()}`}>
          <iframe
            title="DevForge Live Sandbox"
            srcDoc={htmlPayload}
            sandbox="allow-scripts allow-modals allow-forms allow-same-origin"
            className="w-full h-full border-none bg-[#09090b]"
          />
        </div>
      </div>
    </div>
  );
}
