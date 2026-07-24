import { useState } from 'react';
import {
  Heart, MapPin, Globe2, Users, Ruler, Coins, Languages, Building2,
  Clock, Phone, Link2, CalendarDays, Sparkles, Landmark, UtensilsCrossed,
  Bird, Mountain, TreePine, Compass, ArrowRight, GitCompare, StickyNote,
} from 'lucide-react';
import type { Country, CountryTab } from '@/types';
import { useAtlas } from '@/context/AtlasContext';
import {
  getCountry, getLanguage, getOrganization, getContinent,
  neighbors, sharedLanguageCountries, sharedCurrencyCountries,
  sharedReligionCountries, similarCountries,
  formatNumber,
} from '@/data';
import { Section, StatGrid, ChipList, InfoRow } from './ui';

const TABS: { id: CountryTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'history', label: 'History' },
  { id: 'geography', label: 'Geography' },
  { id: 'economy', label: 'Economy' },
  { id: 'culture', label: 'Culture' },
  { id: 'travel', label: 'Travel' },
  { id: 'weather', label: 'Weather' },
  { id: 'connections', label: 'Connections' },
];

function EduNote({ mode, text }: { mode: string; text: string }) {
  if (mode === 'none') return null;
  const labels: Record<string, string> = {
    kids: 'For Kids',
    students: 'For Students',
    travelers: 'For Travelers',
    historians: 'For Historians',
  };
  return (
    <div className="mb-4 p-3 rounded-xl bg-accent-500/10 border border-accent-500/20 animate-fade-in">
      <div className="text-[11px] font-bold uppercase tracking-wide text-accent-600 dark:text-accent-400 mb-1">
        {labels[mode]}
      </div>
      <p className="text-sm text-slate-700 dark:text-slate-200">{text}</p>
    </div>
  );
}

function CountryLink({ id, label }: { id: string; label: string }) {
  const { setSelection, addRecent } = useAtlas();
  return (
    <button
      onClick={() => { addRecent(id); setSelection({ kind: 'country', id }); }}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-white/5 hover:bg-brand-500/10 hover:border-brand-500/30 transition-all text-sm font-medium text-slate-700 dark:text-slate-200"
    >
      <MapPin className="w-3 h-3 text-brand-500" />
      {label}
      <ArrowRight className="w-3 h-3 ml-auto opacity-50" />
    </button>
  );
}

function ConnectionGroup({ title, countries: list }: { title: string; countries: Country[] }) {
  const { setHighlightedCountries } = useAtlas();
  if (list.length === 0) return null;
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</h4>
        <button
          onClick={() => setHighlightedCountries(list.map((c) => c.id))}
          className="text-[10px] font-semibold text-brand-600 dark:text-brand-400 hover:underline"
        >
          Highlight all
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {list.map((c) => (
          <CountryLink key={c.id} id={c.id} label={c.name} />
        ))}
      </div>
    </div>
  );
}

export default function CountryDetail({ country }: { country: Country }) {
  const { theme, favorites, toggleFavorite, isFavorite, compare, toggleCompare, notes, setNote, eduMode, setSelection, setHighlightedCountries, addRecent } = useAtlas();
  const [tab, setTab] = useState<CountryTab>('overview');
  const [showNotes, setShowNotes] = useState(false);

  const fav = isFavorite(country.id);
  const inCompare = compare.includes(country.id);
  const langs = country.languages.map((id) => getLanguage(id)).filter(Boolean);
  const orgs = country.orgs.map((id) => getOrganization(id)).filter(Boolean);
  const continent = getContinent(country.continent);

  const eduTexts: Record<string, Record<CountryTab, string>> = {
    kids: {
      overview: `${country.name} is a country in ${continent?.name ?? 'the world'}. Its capital is ${country.capital}. About ${formatNumber(country.population)} people live here!`,
      history: `${country.name} has a long history. It became independent on ${country.independenceDate}.`,
      geography: `${country.name} is very big! It's ${formatNumber(country.area)} square kilometers. The climate is ${country.climate}.`,
      economy: `People in ${country.name} use the ${country.currencyName} to buy things. The country makes money from farming, factories, and services.`,
      culture: `People in ${country.name} speak ${langs.map((l) => l?.name).join(' and ')}. They eat yummy food like ${country.famousFoods.slice(0, 2).join(' and ')}.`,
      travel: `If you visit ${country.name}, you can see ${country.landmarks.slice(0, 2).join(' and ')}!`,
      weather: `The weather in ${country.name} is ${country.climate}. It's in the ${country.climateZone} zone.`,
      connections: `${country.name} shares borders, languages, and culture with neighboring countries.`,
    },
    students: {
      overview: `${country.name} (${country.id}) is located in ${country.subregion}. With a population of ${formatNumber(country.population)} and area of ${formatNumber(country.area)} km², it has an HDI of ${country.hdi}.`,
      history: country.history,
      geography: country.geographyOverview,
      economy: country.economyOverview,
      culture: country.culture,
      travel: country.travel,
      weather: `${country.name} has a ${country.climateZone} climate. ${country.climate}`,
      connections: `${country.name} is connected to other nations through shared borders, languages, and trade.`,
    },
    travelers: {
      overview: `Welcome to ${country.name}! Capital: ${country.capital}. Currency: ${country.currencyName}. Language: ${langs.map((l) => l?.name).join(', ')}. Time zone: ${country.timezone}.`,
      history: `Don't miss historic sites like ${country.landmarks.slice(0, 3).join(', ')}.`,
      geography: `The climate is ${country.climate}. Pack for ${country.climateZone.toLowerCase()}.`,
      economy: `The currency is ${country.currencyName} (${country.currency}).`,
      culture: `Try the local cuisine: ${country.famousFoods.slice(0, 4).join(', ')}.`,
      travel: `Top landmarks: ${country.landmarks.join(', ')}. Best season depends on region.`,
      weather: `Expect ${country.climate.toLowerCase()}. Climate zone: ${country.climateZone}.`,
      connections: `Explore how ${country.name} relates to its neighbors and the wider world.`,
    },
    historians: {
      overview: `${country.name} gained independence on ${country.independenceDate}. Government: ${country.government}.`,
      history: country.history,
      geography: country.geographyOverview,
      economy: country.economyOverview,
      culture: country.culture,
      travel: `Historic UNESCO sites: ${country.unescoSites.join(', ')}.`,
      weather: `Historic climate context: ${country.climateZone}.`,
      connections: `Historical ties have shaped ${country.name}'s place in the world.`,
    },
  };

  const edu = eduMode !== 'none' ? eduTexts[eduMode] : null;

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Hero image */}
      <div className="relative h-40 sm:h-48 shrink-0 overflow-hidden">
        <img src={country.heroImage} alt={country.name} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
        <div className="absolute top-3 right-3 flex gap-1.5">
          <button
            onClick={() => toggleFavorite(country.id)}
            className={`w-9 h-9 rounded-lg glass-strong flex items-center justify-center transition-all ${
              fav ? 'text-rose-500' : 'text-slate-300 hover:text-rose-400'
            }`}
            aria-label="Favorite"
          >
            <Heart className={`w-4 h-4 ${fav ? 'fill-rose-500' : ''}`} />
          </button>
          <button
            onClick={() => toggleCompare(country.id)}
            className={`w-9 h-9 rounded-lg glass-strong flex items-center justify-center transition-all ${
              inCompare ? 'text-accent-500' : 'text-slate-300 hover:text-accent-400'
            }`}
            aria-label="Compare"
          >
            <GitCompare className={`w-4 h-4 ${inCompare ? 'fill-accent-500' : ''}`} />
          </button>
          <button
            onClick={() => setShowNotes((s) => !s)}
            className={`w-9 h-9 rounded-lg glass-strong flex items-center justify-center transition-all ${
              showNotes || notes[country.id] ? 'text-amber-500' : 'text-slate-300 hover:text-amber-400'
            }`}
            aria-label="Notes"
          >
            <StickyNote className="w-4 h-4" />
          </button>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-end gap-3">
          <img src={country.flagUrl} alt="Flag" className="w-14 h-10 rounded-md object-cover shadow-lg ring-1 ring-white/30" loading="lazy" />
          <div className="flex-1 min-w-0">
            <h1 className="font-display font-extrabold text-2xl text-white drop-shadow-lg truncate">{country.name}</h1>
            <p className="text-sm text-white/80 truncate">{country.nativeName}</p>
          </div>
        </div>
      </div>

      {/* Org badges */}
      {orgs.length > 0 && (
        <div className="px-4 py-2 flex flex-wrap gap-1 border-b border-white/20 dark:border-white/5">
          {orgs.map((o) => (
            <button
              key={o!.id}
              onClick={() => setSelection({ kind: 'organization', id: o!.id })}
              title={o!.name}
              className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide text-white shadow-sm hover:scale-105 transition-transform"
              style={{ background: o!.color }}
            >
              {o!.abbr}
            </button>
          ))}
        </div>
      )}

      {/* Notes panel */}
      {showNotes && (
        <div className="px-4 py-3 border-b border-white/20 dark:border-white/5 bg-amber-500/5 animate-fade-in">
          <textarea
            value={notes[country.id] ?? ''}
            onChange={(e) => setNote(country.id, e.target.value)}
            placeholder={`Write notes about ${country.name}...`}
            className="w-full h-20 px-3 py-2 rounded-lg bg-white/60 dark:bg-slate-800/60 border border-white/30 dark:border-white/10 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 resize-none"
          />
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 px-3 py-2 overflow-x-auto panel-scroll border-b border-white/20 dark:border-white/5 shrink-0">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              tab === t.id
                ? 'bg-brand-500 text-white shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto panel-scroll px-4 py-4">
        {edu && <EduNote mode={eduMode} text={edu[tab]} />}

        {tab === 'overview' && (
          <div className="animate-fade-in">
            <Section title="Key Facts">
              <StatGrid items={[
                { label: 'Capital', value: country.capital },
                { label: 'Population', value: formatNumber(country.population) },
                { label: 'Area', value: `${formatNumber(country.area)} km²` },
                { label: 'Currency', value: country.currencyName },
                { label: 'Government', value: country.governmentType },
                { label: 'Region', value: country.subregion },
                { label: 'Time Zone', value: country.timezone },
                { label: 'Calling Code', value: country.callingCode },
                { label: 'Internet Domain', value: country.internetDomain },
                { label: 'Independence', value: country.independenceDate },
              ]} />
            </Section>

            <Section title="Languages" icon={<Languages className="w-4 h-4" />}>
              <div className="flex flex-wrap gap-1.5">
                {langs.map((l) => (
                  <button
                    key={l!.id}
                    onClick={() => setSelection({ kind: 'language', id: l!.id })}
                    className="px-2.5 py-1 rounded-full text-xs font-medium bg-brand-500/15 text-brand-700 dark:text-brand-300 border border-brand-500/20 hover:bg-brand-500/25 transition-colors"
                  >
                    {l!.name}
                  </button>
                ))}
              </div>
            </Section>

            <Section title="Religion" icon={<Sparkles className="w-4 h-4" />}>
              <p className="text-sm text-slate-700 dark:text-slate-200">{country.religion}</p>
            </Section>

            <Section title="National Symbols" icon={<Landmark className="w-4 h-4" />}>
              <ChipList items={country.nationalSymbols} color="amber" />
            </Section>

            <Section title="Fun Facts" icon={<Sparkles className="w-4 h-4" />}>
              <ul className="space-y-1.5">
                {country.funFacts.map((f, i) => (
                  <li key={i} className="text-sm text-slate-700 dark:text-slate-200 flex gap-2">
                    <span className="text-amber-500 shrink-0">★</span>
                    {f}
                  </li>
                ))}
              </ul>
            </Section>
          </div>
        )}

        {tab === 'history' && (
          <div className="animate-fade-in space-y-4">
            <Section title="Historical Overview" icon={<Landmark className="w-4 h-4" />}>
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">{country.history}</p>
            </Section>
            <Section title="UNESCO World Heritage Sites" icon={<Landmark className="w-4 h-4" />}>
              <ChipList items={country.unescoSites} color="brand" />
            </Section>
            <Section title="Famous Landmarks" icon={<Compass className="w-4 h-4" />}>
              <ChipList items={country.landmarks} color="accent" />
            </Section>
          </div>
        )}

        {tab === 'geography' && (
          <div className="animate-fade-in space-y-4">
            <Section title="Geography" icon={<Mountain className="w-4 h-4" />}>
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">{country.geographyOverview}</p>
            </Section>
            <Section title="Climate" icon={<Compass className="w-4 h-4" />}>
              <p className="text-sm text-slate-700 dark:text-slate-200">{country.climate}</p>
              <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">Climate zone: <span className="font-semibold text-slate-700 dark:text-slate-200">{country.climateZone}</span></div>
            </Section>
            <Section title="Major Cities" icon={<Building2 className="w-4 h-4" />}>
              <ChipList items={country.majorCities} color="brand" />
            </Section>
            <Section title="Wildlife" icon={<Bird className="w-4 h-4" />}>
              <ChipList items={country.wildlife} color="accent" />
            </Section>
          </div>
        )}

        {tab === 'economy' && (
          <div className="animate-fade-in space-y-4">
            <Section title="Economy Overview" icon={<Coins className="w-4 h-4" />}>
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">{country.economyOverview}</p>
            </Section>
            <Section title="Economic Indicators">
              <StatGrid items={[
                { label: 'GDP (nominal)', value: `$${formatNumber(country.gdp)}B` },
                { label: 'GDP per capita', value: `$${formatNumber(country.gdpPerCapita)}` },
                { label: 'HDI', value: country.hdi.toFixed(3) },
                { label: 'Literacy Rate', value: `${country.literacyRate}%` },
                { label: 'Internet Usage', value: `${country.internetUsage}%` },
                { label: 'Life Expectancy', value: `${country.lifeExpectancy} yrs` },
                { label: 'Tourism Arrivals', value: `${country.tourismArrivals}M/yr` },
                { label: 'Forest Area', value: `${country.forestArea}%` },
                { label: 'Military Personnel', value: formatNumber(country.militaryPersonnel) },
                { label: 'Currency', value: country.currencyName },
              ]} />
            </Section>
          </div>
        )}

        {tab === 'culture' && (
          <div className="animate-fade-in space-y-4">
            <Section title="Culture" icon={<Sparkles className="w-4 h-4" />}>
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">{country.culture}</p>
            </Section>
            <Section title="Famous Foods" icon={<UtensilsCrossed className="w-4 h-4" />}>
              <ChipList items={country.famousFoods} color="amber" />
            </Section>
            <Section title="National Symbols" icon={<Landmark className="w-4 h-4" />}>
              <ChipList items={country.nationalSymbols} color="brand" />
            </Section>
            <Section title="Wildlife" icon={<TreePine className="w-4 h-4" />}>
              <ChipList items={country.wildlife} color="accent" />
            </Section>
          </div>
        )}

        {tab === 'travel' && (
          <div className="animate-fade-in space-y-4">
            <Section title="Travel Guide" icon={<Compass className="w-4 h-4" />}>
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">{country.travel}</p>
            </Section>
            <Section title="Must-See Landmarks" icon={<Landmark className="w-4 h-4" />}>
              <div className="grid grid-cols-1 gap-2">
                {country.landmarks.map((l, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-white/5">
                    <div className="w-8 h-8 rounded-lg bg-brand-500/15 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-brand-500" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{l}</span>
                  </div>
                ))}
              </div>
            </Section>
            <Section title="Famous Foods to Try" icon={<UtensilsCrossed className="w-4 h-4" />}>
              <ChipList items={country.famousFoods} color="amber" />
            </Section>
          </div>
        )}

        {tab === 'weather' && (
          <div className="animate-fade-in space-y-4">
            <Section title="Climate & Weather" icon={<Compass className="w-4 h-4" />}>
              <div className="p-4 rounded-xl bg-gradient-to-br from-brand-500/10 to-accent-500/10 border border-white/30 dark:border-white/5">
                <div className="text-3xl font-bold text-slate-800 dark:text-white">{country.climateZone}</div>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{country.climate}</p>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-white/50 dark:bg-slate-800/50 p-3">
                    <div className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold">Avg Temperature</div>
                    <div className="text-lg font-bold text-slate-800 dark:text-white">{country.avgTemp}</div>
                  </div>
                  <div className="rounded-lg bg-white/50 dark:bg-slate-800/50 p-3">
                    <div className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold">Avg Rainfall</div>
                    <div className="text-lg font-bold text-slate-800 dark:text-white">{country.avgRainfall}</div>
                  </div>
                </div>
              </div>
            </Section>
            <Section title="Seasons" icon={<TreePine className="w-4 h-4" />}>
              <div className="space-y-2">
                {country.seasons.map((s, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-white/5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-800 dark:text-white">{s.name}</span>
                      <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">{s.months}</span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{s.temp}</div>
                    <p className="text-sm text-slate-700 dark:text-slate-200 mt-1">{s.description}</p>
                  </div>
                ))}
              </div>
            </Section>
            <Section title="Major Rivers" icon={<Mountain className="w-4 h-4" />}>
              {country.majorRivers.length > 0 ? (
                <ChipList items={country.majorRivers} color="accent" />
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">No major rivers data available.</p>
              )}
            </Section>
          </div>
        )}

        {tab === 'connections' && (
          <div className="animate-fade-in space-y-4">
            <Section title="Bordering Countries" icon={<Globe2 className="w-4 h-4" />}>
              <ConnectionGroup title="Neighbors" countries={neighbors(country.id)} />
            </Section>
            <Section title="Shared Languages" icon={<Languages className="w-4 h-4" />}>
              <ConnectionGroup title="Common Language" countries={sharedLanguageCountries(country.id)} />
            </Section>
            <Section title="Shared Currency" icon={<Coins className="w-4 h-4" />}>
              <ConnectionGroup title="Same Currency" countries={sharedCurrencyCountries(country.id)} />
            </Section>
            <Section title="Same Religion" icon={<Sparkles className="w-4 h-4" />}>
              <ConnectionGroup title="Shared Faith" countries={sharedReligionCountries(country.id)} />
            </Section>
            <Section title="Similar Countries" icon={<Sparkles className="w-4 h-4" />}>
              <div className="space-y-2">
                {similarCountries(country.id).map(({ country: c, reasons }) => (
                  <button
                    key={c.id}
                    onClick={() => { addRecent(c.id); setSelection({ kind: 'country', id: c.id }); }}
                    onMouseEnter={() => setHighlightedCountries([c.id])}
                    onMouseLeave={() => setHighlightedCountries([])}
                    className="w-full p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-white/5 hover:bg-brand-500/10 hover:border-brand-500/30 transition-all text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={c.flagUrl} alt="" className="w-7 h-5 rounded object-cover" loading="lazy" />
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{c.name}</span>
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {reasons.map((r) => (
                        <span key={r} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300">{r}</span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </Section>
          </div>
        )}

      </div>
    </div>
  );
}
