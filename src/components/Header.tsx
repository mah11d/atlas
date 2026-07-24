import { useState, useRef, useEffect } from 'react';
import { Search, Moon, Sun, Map, Globe2, Sunrise, GraduationCap, X } from 'lucide-react';
import { useAtlas } from '@/context/AtlasContext';
import { search } from '@/data';
import type { MapMode } from '@/types';
import type { SearchResult } from '@/data';

const MAP_MODES: { id: MapMode; label: string; icon: typeof Map }[] = [
  { id: 'political', label: 'Political', icon: Map },
  { id: 'physical', label: 'Physical', icon: Globe2 },
  { id: 'daynight', label: 'Day/Night', icon: Sunrise },
];

const EDU_MODES = [
  { id: 'none' as const, label: 'Off' },
  { id: 'kids' as const, label: 'Kids' },
  { id: 'students' as const, label: 'Students' },
  { id: 'travelers' as const, label: 'Travelers' },
  { id: 'historians' as const, label: 'Historians' },
];

export default function Header() {
  const { theme, toggleTheme, mapMode, setMapMode, setSelection, setExplorerTab, eduMode, setEduMode } = useAtlas();
  const [localQuery, setLocalQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [eduOpen, setEduOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!localQuery.trim()) {
      setResults([]);
      return;
    }
    setResults(search(localQuery));
    setShowResults(true);
  }, [localQuery]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selectResult = (r: SearchResult) => {
    setSelection({ kind: r.kind, id: r.id });
    setExplorerTab(r.kind === 'country' ? 'countries' : r.kind === 'language' ? 'languages' : r.kind === 'organization' ? 'organizations' : r.kind === 'continent' ? 'continents' : 'countries');
    setLocalQuery('');
    setShowResults(false);
  };

  return (
    <header className="relative z-40 glass-strong border-b border-white/30 dark:border-white/10">
      <div className="flex items-center gap-3 px-3 sm:px-5 py-2.5">
        {/* Logo */}
        <button
          onClick={() => setSelection(null)}
          className="flex items-center gap-2 shrink-0 group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform">
            <Globe2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-extrabold text-xl tracking-tight text-slate-800 dark:text-white hidden sm:block">
            Atlas
          </span>
        </button>

        {/* Search */}
        <div ref={searchRef} className="relative flex-1 max-w-xl mx-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              onFocus={() => results.length && setShowResults(true)}
              placeholder="Search countries, capitals, languages, organizations..."
              className="w-full pl-10 pr-8 py-2 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-white/40 dark:border-white/10 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
            />
            {localQuery && (
              <button
                onClick={() => { setLocalQuery(''); setResults([]); }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Autocomplete dropdown */}
          {showResults && results.length > 0 && (
            <div className="absolute top-full mt-2 w-full glass-strong rounded-xl shadow-2xl overflow-hidden animate-scale-in max-h-96 overflow-y-auto panel-scroll z-50">
              {results.map((r, i) => (
                <button
                  key={`${r.kind}-${r.id}-${i}`}
                  onClick={() => selectResult(r)}
                  className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-brand-500/10 transition-colors text-left border-b border-white/10 last:border-0"
                >
                  <div>
                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{r.label}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{r.sublabel}</div>
                  </div>
                  <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-slate-200/60 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300">
                    {r.kind}
                  </span>
                </button>
              ))}
            </div>
          )}
          {showResults && localQuery && results.length === 0 && (
            <div className="absolute top-full mt-2 w-full glass-strong rounded-xl shadow-2xl px-4 py-3 text-sm text-slate-500 animate-scale-in z-50">
              No results found for "{localQuery}"
            </div>
          )}
        </div>

        {/* Map modes */}
        <div className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-white/40 dark:bg-slate-800/40 border border-white/30 dark:border-white/10">
          {MAP_MODES.map((m) => {
            const Icon = m.icon;
            const active = mapMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMapMode(m.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  active
                    ? 'bg-brand-500 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {m.label}
              </button>
            );
          })}
        </div>

        {/* Educational mode */}
        <div className="relative hidden lg:block">
          <button
            onClick={() => setEduOpen((o) => !o)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              eduMode !== 'none'
                ? 'bg-accent-500 text-white border-accent-500 shadow-md'
                : 'bg-white/40 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300 border-white/30 dark:border-white/10 hover:bg-white/60'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            {eduMode !== 'none' ? eduMode : 'Edu'}
          </button>
          {eduOpen && (
            <div className="absolute top-full mt-2 right-0 w-40 glass-strong rounded-xl shadow-2xl p-1.5 animate-scale-in z-50">
              {EDU_MODES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => { setEduMode(m.id); setEduOpen(false); }}
                  className={`w-full px-3 py-1.5 rounded-lg text-xs font-medium text-left transition-colors ${
                    eduMode === m.id ? 'bg-accent-500 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700/60'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-xl glass flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-brand-500 hover:text-white transition-colors shrink-0"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile map modes */}
      <div className="md:hidden flex items-center gap-1 px-3 pb-2 overflow-x-auto panel-scroll">
        {MAP_MODES.map((m) => {
          const Icon = m.icon;
          const active = mapMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setMapMode(m.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all ${
                active ? 'bg-brand-500 text-white' : 'bg-white/40 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {m.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
