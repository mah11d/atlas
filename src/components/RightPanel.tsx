import { useState, useMemo } from 'react';
import {
  Globe2, Languages, Building2, Map, Trophy, Heart, Clock, GitCompare,
  Search, ArrowRight, X, Crown,
} from 'lucide-react';
import { useAtlas } from '@/context/AtlasContext';
import {
  countries as allCountries, languages, organizations, continents, oceans,
  getCountry, formatNumber,
} from '@/data';
import type { ExplorerTab, Country } from '@/types';

const TABS: { id: ExplorerTab; label: string; icon: typeof Globe2 }[] = [
  { id: 'countries', label: 'Countries', icon: Globe2 },
  { id: 'languages', label: 'Languages', icon: Languages },
  { id: 'organizations', label: 'Orgs', icon: Building2 },
  { id: 'religion', label: 'Religion', icon: Heart },
  { id: 'continents', label: 'Geography', icon: Map },
  { id: 'rankings', label: 'Rankings', icon: Trophy },
  { id: 'favorites', label: 'Favorites', icon: Heart },
  { id: 'recents', label: 'Recents', icon: Clock },
  { id: 'compare', label: 'Compare', icon: GitCompare },
];

type SortKey = 'population' | 'area' | 'gdp' | 'hdi' | 'literacyRate' | 'internetUsage' | 'tourismArrivals' | 'forestArea' | 'militaryPersonnel' | 'lifeExpectancy' | 'gdpPerCapita';

const RANK_OPTIONS: { key: SortKey; label: string; format: (c: Country) => string }[] = [
  { key: 'population', label: 'Population', format: (c) => formatNumber(c.population) },
  { key: 'area', label: 'Area', format: (c) => `${formatNumber(c.area)} km²` },
  { key: 'gdp', label: 'GDP (nominal)', format: (c) => `$${formatNumber(c.gdp)}B` },
  { key: 'gdpPerCapita', label: 'GDP per capita', format: (c) => `$${formatNumber(c.gdpPerCapita)}` },
  { key: 'hdi', label: 'HDI', format: (c) => c.hdi.toFixed(3) },
  { key: 'literacyRate', label: 'Literacy', format: (c) => `${c.literacyRate}%` },
  { key: 'internetUsage', label: 'Internet Usage', format: (c) => `${c.internetUsage}%` },
  { key: 'tourismArrivals', label: 'Tourism', format: (c) => `${c.tourismArrivals}M` },
  { key: 'forestArea', label: 'Forest Area', format: (c) => `${c.forestArea}%` },
  { key: 'militaryPersonnel', label: 'Military', format: (c) => formatNumber(c.militaryPersonnel) },
  { key: 'lifeExpectancy', label: 'Life Expectancy', format: (c) => `${c.lifeExpectancy} yrs` },
];

function CountryRow({ id, rank, value, highlight }: { id: string; rank?: number; value?: string; highlight?: boolean }) {
  const { setSelection, addRecent, setHighlightedCountries } = useAtlas();
  const c = getCountry(id);
  if (!c) return null;
  return (
    <button
      onClick={() => { addRecent(id); setSelection({ kind: 'country', id }); }}
      onMouseEnter={() => setHighlightedCountries([id])}
      onMouseLeave={() => setHighlightedCountries([])}
      className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl border transition-all text-left ${
        highlight
          ? 'bg-brand-500/15 border-brand-500/30'
          : 'bg-white/40 dark:bg-slate-800/40 border-white/30 dark:border-white/5 hover:bg-brand-500/10 hover:border-brand-500/20'
      }`}
    >
      {rank !== undefined && (
        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
          rank === 1 ? 'bg-amber-400 text-amber-900' : rank === 2 ? 'bg-slate-300 text-slate-700' : rank === 3 ? 'bg-orange-400 text-orange-900' : 'bg-slate-200/60 dark:bg-slate-700/60 text-slate-500 dark:text-slate-400'
        }`}>
          {rank}
        </span>
      )}
      <img src={c.flagUrl} alt="" className="w-7 h-5 rounded object-cover shrink-0" loading="lazy" />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{c.name}</div>
        {value && <div className="text-xs text-slate-500 dark:text-slate-400">{value}</div>}
      </div>
      <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
    </button>
  );
}

function ExplorerCountries() {
  const [filter, setFilter] = useState('');
  const [continent, setContinent] = useState('all');
  const list = useMemo(() => {
    return allCountries
      .filter((c) => continent === 'all' || c.continent === continent)
      .filter((c) => c.name.toLowerCase().includes(filter.toLowerCase()) || c.capital.toLowerCase().includes(filter.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [filter, continent]);

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter countries..."
          className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-white/10 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
        />
      </div>
      <div className="flex flex-wrap gap-1">
        <button
          onClick={() => setContinent('all')}
          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${continent === 'all' ? 'bg-brand-500 text-white' : 'bg-slate-200/60 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300'}`}
        >
          All
        </button>
        {continents.filter((c) => c.id !== 'AN').map((c) => (
          <button
            key={c.id}
            onClick={() => setContinent(c.id)}
            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${continent === c.id ? 'bg-brand-500 text-white' : 'bg-slate-200/60 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300'}`}
          >
            {c.name}
          </button>
        ))}
      </div>
      <div className="space-y-1.5">
        {list.map((c) => (
          <CountryRow key={c.id} id={c.id} value={`${c.capital} · ${formatNumber(c.population)}`} />
        ))}
        {list.length === 0 && <p className="text-xs text-slate-400 text-center py-4">No countries match your filter.</p>}
      </div>
    </div>
  );
}

function ExplorerLanguages() {
  const { setSelection, setHighlightedCountries } = useAtlas();
  return (
    <div className="space-y-1.5">
      {languages.map((l) => (
        <button
          key={l.id}
          onClick={() => setSelection({ kind: 'language', id: l.id })}
          onMouseEnter={() => setHighlightedCountries(l.officialCountries)}
          onMouseLeave={() => setHighlightedCountries([])}
          className="w-full p-2.5 rounded-xl bg-white/40 dark:bg-slate-800/40 border border-white/30 dark:border-white/5 hover:bg-brand-500/10 hover:border-brand-500/20 transition-all text-left"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{l.name}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{formatNumber(l.nativeSpeakers + l.secondSpeakers)}M</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{l.family} · {l.officialCountries.length} countries</div>
        </button>
      ))}
    </div>
  );
}

function ExplorerOrganizations() {
  const { setSelection, setHighlightedCountries } = useAtlas();
  const grouped = useMemo(() => {
    const map: Record<string, typeof organizations> = {};
    for (const o of organizations) {
      const cat = o.categories[0] ?? 'Other';
      if (!map[cat]) map[cat] = [];
      map[cat].push(o);
    }
    return map;
  }, []);

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([cat, orgs]) => (
        <div key={cat}>
          <h4 className="text-[11px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1.5">{cat}</h4>
          <div className="space-y-1.5">
            {orgs.map((o) => (
              <button
                key={o.id}
                onClick={() => setSelection({ kind: 'organization', id: o.id })}
                onMouseEnter={() => setHighlightedCountries(o.members)}
                onMouseLeave={() => setHighlightedCountries([])}
                className="w-full flex items-center gap-2.5 p-2 rounded-xl bg-white/40 dark:bg-slate-800/40 border border-white/30 dark:border-white/5 hover:bg-brand-500/10 transition-all text-left"
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-base shrink-0" style={{ background: o.color + '33' }}>
                  {o.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{o.abbr}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{o.members.length} members</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ExplorerReligion() {
  const { setSelection, setExplorerTab } = useAtlas();
  const religionMap = useMemo(() => {
    const map: Record<string, { name: string; countries: Country[] }> = {};
    for (const c of allCountries) {
      const key = c.religion || 'Unknown';
      if (!map[key]) map[key] = { name: key, countries: [] };
      map[key].countries.push(c);
    }
    return Object.values(map).sort((a, b) => b.countries.length - a.countries.length);
  }, []);

  return (
    <div className="space-y-3">
      {religionMap.map((r) => (
        <div key={r.name} className="rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-white/5 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-slate-800 dark:text-white">{r.name}</span>
            <span className="text-xs font-semibold text-slate-400">{r.countries.length} countries</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {r.countries.slice(0, 12).map((c) => (
              <button
                key={c.id}
                onClick={() => { setSelection({ kind: 'country', id: c.id }); setExplorerTab('countries'); }}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100/60 dark:bg-slate-700/60 hover:bg-brand-500/15 transition-colors"
              >
                <img src={c.flagUrl} alt="" className="w-4 h-3 rounded-sm object-cover" loading="lazy" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-200">{c.name}</span>
              </button>
            ))}
            {r.countries.length > 12 && <span className="text-xs text-slate-400 self-center">+{r.countries.length - 12} more</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

function ExplorerGeography() {
  const { setSelection, setHighlightedCountries } = useAtlas();
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-[11px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1.5">Continents</h4>
        <div className="grid grid-cols-2 gap-1.5">
          {continents.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelection({ kind: 'continent', id: c.id })}
              onMouseEnter={() => setHighlightedCountries(c.countries)}
              onMouseLeave={() => setHighlightedCountries([])}
              className="p-2.5 rounded-xl bg-white/40 dark:bg-slate-800/40 border border-white/30 dark:border-white/5 hover:bg-brand-500/10 transition-all text-left"
            >
              <div className="text-sm font-bold text-slate-800 dark:text-slate-100">{c.name}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">{c.countries.length} countries</div>
            </button>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-[11px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1.5">Oceans</h4>
        <div className="space-y-1.5">
          {oceans.map((o) => (
            <button
              key={o.id}
              onClick={() => setSelection({ kind: 'ocean', id: o.id })}
              onMouseEnter={() => setHighlightedCountries(o.borderingCountries)}
              onMouseLeave={() => setHighlightedCountries([])}
              className="w-full flex items-center gap-2.5 p-2 rounded-xl bg-white/40 dark:bg-slate-800/40 border border-white/30 dark:border-white/5 hover:bg-cyan-500/10 transition-all text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
                <Map className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{o.name}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">{formatNumber(o.area)} km²</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ExplorerRankings() {
  const [sortKey, setSortKey] = useState<SortKey>('population');
  const opt = RANK_OPTIONS.find((o) => o.key === sortKey)!;
  const sorted = useMemo(() => [...allCountries].sort((a, b) => (b[sortKey] as number) - (a[sortKey] as number)), [sortKey]);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
        {RANK_OPTIONS.map((o) => (
          <button
            key={o.key}
            onClick={() => setSortKey(o.key)}
            className={`px-2 py-1 rounded-full text-[10px] font-semibold transition-all ${
              sortKey === o.key ? 'bg-brand-500 text-white' : 'bg-slate-200/60 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-300/60'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
      <div className="space-y-1.5">
        {sorted.map((c, i) => (
          <CountryRow key={c.id} id={c.id} rank={i + 1} value={opt.format(c)} highlight={i < 3} />
        ))}
      </div>
    </div>
  );
}

function ExplorerFavorites() {
  const { favorites } = useAtlas();
  if (favorites.length === 0) {
    return <p className="text-xs text-slate-400 text-center py-8">No favorites yet. Tap the heart on any country to save it here.</p>;
  }
  return (
    <div className="space-y-1.5">
      {favorites.map((id) => (
        <CountryRow key={id} id={id} />
      ))}
    </div>
  );
}

function ExplorerRecents() {
  const { recents } = useAtlas();
  if (recents.length === 0) {
    return <p className="text-xs text-slate-400 text-center py-8">No recently viewed items yet.</p>;
  }
  return (
    <div className="space-y-1.5">
      {recents.map((id) => (
        <CountryRow key={id} id={id} />
      ))}
    </div>
  );
}

function ExplorerCompare() {
  const { compare, toggleCompare, clearCompare, setSelection, addRecent } = useAtlas();

  if (compare.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-xs text-slate-400 mb-2">Add up to 4 countries to compare side by side.</p>
        <p className="text-xs text-slate-400">Tap the compare icon on any country profile.</p>
      </div>
    );
  }

  const cs = compare.map((id) => getCountry(id)).filter(Boolean) as Country[];
  const metrics: { key: keyof Country; label: string; format: (c: Country) => string }[] = [
    { key: 'population', label: 'Population', format: (c) => formatNumber(c.population) },
    { key: 'area', label: 'Area', format: (c) => `${formatNumber(c.area)} km²` },
    { key: 'gdp', label: 'GDP', format: (c) => `$${formatNumber(c.gdp)}B` },
    { key: 'gdpPerCapita', label: 'GDP/capita', format: (c) => `$${formatNumber(c.gdpPerCapita)}` },
    { key: 'hdi', label: 'HDI', format: (c) => c.hdi.toFixed(3) },
    { key: 'lifeExpectancy', label: 'Life Exp.', format: (c) => `${c.lifeExpectancy} yrs` },
    { key: 'literacyRate', label: 'Literacy', format: (c) => `${c.literacyRate}%` },
    { key: 'internetUsage', label: 'Internet', format: (c) => `${c.internetUsage}%` },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{compare.length} of 4 selected</span>
        <button onClick={clearCompare} className="text-[11px] font-semibold text-rose-500 hover:underline">Clear all</button>
      </div>
      <div className="overflow-x-auto panel-scroll -mx-1 px-1">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="text-left p-2 font-semibold text-slate-500 dark:text-slate-400 sticky left-0 bg-transparent">Metric</th>
              {cs.map((c) => (
                <th key={c.id} className="p-2 min-w-[90px]">
                  <div className="flex flex-col items-center gap-1">
                    <img src={c.flagUrl} alt="" className="w-7 h-5 rounded object-cover" loading="lazy" />
                    <button onClick={() => { addRecent(c.id); setSelection({ kind: 'country', id: c.id }); }} className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-500 truncate max-w-[80px]">
                      {c.name}
                    </button>
                    <button onClick={() => toggleCompare(c.id)} className="text-slate-400 hover:text-rose-500">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metrics.map((m) => {
              const values = cs.map((c) => Number(c[m.key as keyof Country] as number));
              const max = Math.max(...values);
              return (
                <tr key={m.key} className="border-t border-white/20 dark:border-white/5">
                  <td className="p-2 font-semibold text-slate-500 dark:text-slate-400 sticky left-0 bg-transparent">{m.label}</td>
                  {cs.map((c, i) => {
                    const val = m.format(c);
                    const isMax = values[i] === max;
                    return (
                      <td key={c.id} className={`p-2 text-center font-medium ${isMax ? 'text-brand-600 dark:text-brand-400 font-bold' : 'text-slate-700 dark:text-slate-200'}`}>
                        {val}
                        {isMax && <Crown className="w-2.5 h-2.5 inline ml-0.5 text-amber-400" />}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function RightPanel() {
  const { explorerTab, setExplorerTab } = useAtlas();

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="px-3 pt-3 pb-2 shrink-0">
        <h2 className="font-display font-bold text-sm text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-1.5">
          <Globe2 className="w-4 h-4 text-brand-500" />
          Explorer
        </h2>
        <div className="flex flex-wrap gap-1">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = explorerTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setExplorerTab(t.id)}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  active
                    ? 'bg-brand-500 text-white shadow-md'
                    : 'bg-white/40 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700/60'
                }`}
              >
                <Icon className="w-3 h-3" />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto panel-scroll px-3 pb-3 pt-1">
        {explorerTab === 'countries' && <ExplorerCountries />}
        {explorerTab === 'languages' && <ExplorerLanguages />}
        {explorerTab === 'organizations' && <ExplorerOrganizations />}
        {explorerTab === 'religion' && <ExplorerReligion />}
        {explorerTab === 'continents' && <ExplorerGeography />}
        {explorerTab === 'rankings' && <ExplorerRankings />}
        {explorerTab === 'favorites' && <ExplorerFavorites />}
        {explorerTab === 'recents' && <ExplorerRecents />}
        {explorerTab === 'compare' && <ExplorerCompare />}
      </div>
    </div>
  );
}
