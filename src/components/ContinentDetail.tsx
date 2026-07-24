import { Globe2, MapPin, Mountain, Droplets, Bird, Coins, BookOpen } from 'lucide-react';
import type { Continent } from '@/types';
import { useAtlas } from '@/context/AtlasContext';
import { getCountry, formatNumber } from '@/data';
import { Section, StatGrid, ChipList } from './ui';

export default function ContinentDetail({ continent }: { continent: Continent }) {
  const { setSelection, addRecent, setHighlightedCountries } = useAtlas();
  const countries = continent.countries.map((id) => getCountry(id)).filter(Boolean);

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="relative h-32 shrink-0 flex items-end px-4 pb-3" style={{ background: `linear-gradient(135deg, ${continent.color}, ${continent.color}aa)` }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, white 1.5px, transparent 1.5px)', backgroundSize: '20px 20px' }} />
        <div className="relative">
          <div className="flex items-center gap-2 mb-0.5">
            <Globe2 className="w-4 h-4 text-white/90" />
            <span className="text-xs font-semibold uppercase tracking-wide text-white/80">Continent</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl text-white drop-shadow">{continent.name}</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto panel-scroll px-4 py-4">
        <Section title="Overview">
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">{continent.description}</p>
        </Section>

        <Section title="Key Facts">
          <StatGrid items={[
            { label: 'Population', value: formatNumber(continent.population) },
            { label: 'Area', value: `${formatNumber(continent.area)} km²` },
            { label: 'Countries', value: `${countries.length}` },
            { label: 'Largest City', value: continent.largestCities[0] ?? '—' },
          ]} />
        </Section>

        <Section title="Climate" icon={<Globe2 className="w-4 h-4" />}>
          <p className="text-sm text-slate-700 dark:text-slate-200">{continent.climate}</p>
        </Section>

        <Section title="Largest Cities" icon={<MapPin className="w-4 h-4" />}>
          <ChipList items={continent.largestCities} color="brand" />
        </Section>

        <Section title="Mountains" icon={<Mountain className="w-4 h-4" />}>
          <ChipList items={continent.mountains} color="accent" />
        </Section>

        <Section title="Rivers" icon={<Droplets className="w-4 h-4" />}>
          <ChipList items={continent.rivers} color="brand" />
        </Section>

        <Section title="Wildlife" icon={<Bird className="w-4 h-4" />}>
          <ChipList items={continent.wildlife} color="accent" />
        </Section>

        <Section title="Economy" icon={<Coins className="w-4 h-4" />}>
          <p className="text-sm text-slate-700 dark:text-slate-200">{continent.economy}</p>
        </Section>

        <Section title="History" icon={<BookOpen className="w-4 h-4" />}>
          <p className="text-sm text-slate-700 dark:text-slate-200">{continent.history}</p>
        </Section>

        <Section title={`Countries (${countries.length})`} icon={<MapPin className="w-4 h-4" />}>
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => setHighlightedCountries(continent.countries)}
              className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Highlight all on map
            </button>
            <button
              onClick={() => setHighlightedCountries([])}
              className="text-[11px] font-semibold text-slate-400 hover:underline"
            >
              Clear
            </button>
          </div>
          <div className="grid grid-cols-1 gap-1.5">
            {countries.map((c) => (
              <button
                key={c!.id}
                onClick={() => { addRecent(c!.id); setSelection({ kind: 'country', id: c!.id }); }}
                onMouseEnter={() => setHighlightedCountries([c!.id])}
                onMouseLeave={() => setHighlightedCountries(continent.countries)}
                className="flex items-center gap-2 p-2 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-white/5 hover:bg-brand-500/10 transition-all text-left"
              >
                <img src={c!.flagUrl} alt="" className="w-6 h-4 rounded object-cover" loading="lazy" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{c!.name}</span>
              </button>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
