import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { Selection, Theme, MapMode, ExplorerTab, CountryNote } from '@/types';

interface AtlasState {
  selection: Selection | null;
  setSelection: (s: Selection | null) => void;
  theme: Theme;
  toggleTheme: () => void;
  mapMode: MapMode;
  setMapMode: (m: MapMode) => void;
  explorerTab: ExplorerTab;
  setExplorerTab: (t: ExplorerTab) => void;
  favorites: string[];
  toggleFavorite: (countryId: string) => void;
  isFavorite: (countryId: string) => boolean;
  recents: string[];
  addRecent: (countryId: string) => void;
  compare: string[];
  toggleCompare: (countryId: string) => void;
  clearCompare: () => void;
  notes: Record<string, string>;
  setNote: (countryId: string, text: string) => void;
  hoveredCountry: string | null;
  setHoveredCountry: (id: string | null) => void;
  highlightedCountries: string[];
  setHighlightedCountries: (ids: string[]) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  eduMode: 'none' | 'kids' | 'students' | 'travelers' | 'historians';
  setEduMode: (m: 'none' | 'kids' | 'students' | 'travelers' | 'historians') => void;
}

const AtlasContext = createContext<AtlasState | null>(null);

const STORAGE_KEY = 'atlas-state-v1';

interface PersistedState {
  theme: Theme;
  favorites: string[];
  recents: string[];
  notes: Record<string, string>;
}

function loadPersisted(): Partial<PersistedState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Partial<PersistedState>;
  } catch {
    // ignore
  }
  return {};
}

export function AtlasProvider({ children }: { children: ReactNode }) {
  const persisted = loadPersisted();
  const [selection, setSelection] = useState<Selection | null>(null);
  const [theme, setTheme] = useState<Theme>(persisted.theme ?? 'dark');
  const [mapMode, setMapMode] = useState<MapMode>('political');
  const [explorerTab, setExplorerTab] = useState<ExplorerTab>('countries');
  const [favorites, setFavorites] = useState<string[]>(persisted.favorites ?? []);
  const [recents, setRecents] = useState<string[]>(persisted.recents ?? []);
  const [compare, setCompare] = useState<string[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>(persisted.notes ?? {});
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [highlightedCountries, setHighlightedCountries] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [eduMode, setEduMode] = useState<'none' | 'kids' | 'students' | 'travelers' | 'historians'>('none');

  // Persist + apply theme
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    const state: PersistedState = { theme, favorites, recents, notes };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [theme, favorites, recents, notes]);

  const toggleTheme = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  }, []);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  const addRecent = useCallback((id: string) => {
    setRecents((r) => [id, ...r.filter((x) => x !== id)].slice(0, 12));
  }, []);

  const toggleCompare = useCallback((id: string) => {
    setCompare((c) => {
      if (c.includes(id)) return c.filter((x) => x !== id);
      if (c.length >= 4) return c;
      return [...c, id];
    });
  }, []);

  const clearCompare = useCallback(() => setCompare([]), []);

  const setNote = useCallback((id: string, text: string) => {
    setNotes((n) => {
      const next = { ...n };
      if (text) next[id] = text;
      else delete next[id];
      return next;
    });
  }, []);

  const value: AtlasState = {
    selection, setSelection,
    theme, toggleTheme,
    mapMode, setMapMode,
    explorerTab, setExplorerTab,
    favorites, toggleFavorite, isFavorite,
    recents, addRecent,
    compare, toggleCompare, clearCompare,
    notes, setNote,
    hoveredCountry, setHoveredCountry,
    highlightedCountries, setHighlightedCountries,
    searchQuery, setSearchQuery,
    eduMode, setEduMode,
  };

  return <AtlasContext.Provider value={value}>{children}</AtlasContext.Provider>;
}

export function useAtlas(): AtlasState {
  const ctx = useContext(AtlasContext);
  if (!ctx) throw new Error('useAtlas must be used within AtlasProvider');
  return ctx;
}
