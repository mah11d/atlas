import { useState } from 'react';
import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, X } from 'lucide-react';
import { AtlasProvider, useAtlas } from '@/context/AtlasContext';
import Header from '@/components/Header';
import WorldMap from '@/components/WorldMap';
import LeftPanel from '@/components/LeftPanel';
import RightPanel from '@/components/RightPanel';

function Layout() {
  const { selection } = useAtlas();
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [mobilePanel, setMobilePanel] = useState<null | 'left' | 'right'>(null);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100">
      <Header />

      <div className="flex-1 flex relative overflow-hidden">
        {/* Left panel - desktop */}
        <aside
          className={`hidden lg:flex flex-col transition-all duration-300 ease-out shrink-0 ${
            leftOpen ? 'w-[380px]' : 'w-0'
          }`}
        >
          {leftOpen && (
            <div className="w-[380px] h-full glass border-r border-white/30 dark:border-white/10">
              <LeftPanel />
            </div>
          )}
        </aside>

        {/* Toggle left */}
        <button
          onClick={() => setLeftOpen((o) => !o)}
          className="hidden lg:flex absolute top-3 z-30 w-7 h-7 rounded-lg glass-strong items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-brand-500 hover:text-white transition-colors shadow-md"
          style={{ left: leftOpen ? 380 + 8 : 8 }}
          aria-label="Toggle left panel"
        >
          {leftOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
        </button>

        {/* Center map */}
        <main className="flex-1 relative p-2 sm:p-3 min-w-0">
          <div className="h-full w-full glass rounded-2xl overflow-hidden shadow-xl">
            <WorldMap />
          </div>

          {/* Mobile panel toggles */}
          <div className="lg:hidden absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
            <button
              onClick={() => setMobilePanel(mobilePanel === 'left' ? null : 'left')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold shadow-lg transition-all ${
                mobilePanel === 'left' ? 'bg-brand-500 text-white' : 'glass-strong text-slate-700 dark:text-slate-200'
              }`}
            >
              <PanelLeftOpen className="w-4 h-4" />
              Info
            </button>
            <button
              onClick={() => setMobilePanel(mobilePanel === 'right' ? null : 'right')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold shadow-lg transition-all ${
                mobilePanel === 'right' ? 'bg-brand-500 text-white' : 'glass-strong text-slate-700 dark:text-slate-200'
              }`}
            >
              <PanelRightOpen className="w-4 h-4" />
              Explore
            </button>
          </div>
        </main>

        {/* Right panel - desktop */}
        <aside
          className={`hidden lg:flex flex-col transition-all duration-300 ease-out shrink-0 ${
            rightOpen ? 'w-[320px]' : 'w-0'
          }`}
        >
          {rightOpen && (
            <div className="w-[320px] h-full glass border-l border-white/30 dark:border-white/10">
              <RightPanel />
            </div>
          )}
        </aside>

        {/* Toggle right */}
        <button
          onClick={() => setRightOpen((o) => !o)}
          className="hidden lg:flex absolute top-3 z-30 w-7 h-7 rounded-lg glass-strong items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-brand-500 hover:text-white transition-colors shadow-md"
          style={{ right: rightOpen ? 320 + 8 : 8 }}
          aria-label="Toggle right panel"
        >
          {rightOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
        </button>

        {/* Mobile overlay panels */}
        {mobilePanel && (
          <div className="lg:hidden absolute inset-0 z-40 flex animate-fade-in">
            <div className="flex-1 bg-slate-900/50 backdrop-blur-sm" onClick={() => setMobilePanel(null)} />
            <div className="w-[85%] max-w-sm h-full glass-strong border-l border-white/20 dark:border-white/10 flex flex-col animate-slide-in">
              <button
                onClick={() => setMobilePanel(null)}
                className="absolute top-2 right-2 z-10 w-8 h-8 rounded-lg glass flex items-center justify-center text-slate-600 dark:text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
              {mobilePanel === 'left' ? <LeftPanel /> : <RightPanel />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AtlasProvider>
      <Layout />
    </AtlasProvider>
  );
}
