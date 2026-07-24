import { Waves, Droplets, Fish, MapPin, Palmtree, Sparkles } from 'lucide-react';
import type { Ocean } from '@/types';
import { useAtlas } from '@/context/AtlasContext';
import { getCountry, formatNumber } from '@/data';
import { Section, StatGrid, ChipList } from './ui';

export default function OceanDetail({ ocean }: { ocean: Ocean }) {
  const { setSelection, addRecent, setHighlightedCountries } = useAtlas();
  const bordering = ocean.borderingCountries.map((id) => getCountry(id)).filter(Boolean);

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="relative h-32 shrink-0 bg-gradient-to-br from-cyan-600 via-brand-600 to-blue-900 flex items-end px-4 pb-3">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(255,255,255,0.15) 8px, rgba(255,255,255,0.15) 9px)' }} />
        <div className="relative">
          <div className="flex items-center gap-2 mb-0.5">
            <Waves className="w-4 h-4 text-white/90" />
            <span className="text-xs font-semibold uppercase tracking-wide text-white/80">Ocean</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl text-white drop-shadow">{ocean.name}</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto panel-scroll px-4 py-4">
        <Section title="Overview">
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">{ocean.description}</p>
        </Section>

        <Section title="Key Facts">
          <StatGrid items={[
            { label: 'Area', value: `${formatNumber(ocean.area)} km²` },
            { label: 'Max Depth', value: `${formatNumber(ocean.maxDepth)} m` },
            { label: 'Bordering Countries', value: `${bordering.length}` },
            { label: 'Major Seas', value: `${ocean.majorSeas.length}` },
          ]} />
        </Section>

        <Section title="Marine Life" icon={<Fish className="w-4 h-4" />}>
          <ChipList items={ocean.marineLife} color="accent" />
        </Section>

        <Section title="Major Seas" icon={<Droplets className="w-4 h-4" />}>
          <ChipList items={ocean.majorSeas} color="brand" />
        </Section>

        <Section title="Islands" icon={<Palmtree className="w-4 h-4" />}>
          <ChipList items={ocean.islands} color="accent" />
        </Section>

        <Section title="Interesting Facts" icon={<Sparkles className="w-4 h-4" />}>
          <ul className="space-y-1.5">
            {ocean.facts.map((f, i) => (
              <li key={i} className="text-sm text-slate-700 dark:text-slate-200 flex gap-2">
                <span className="text-cyan-500 shrink-0">★</span>
                {f}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Bordering Countries" icon={<MapPin className="w-4 h-4" />}>
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => setHighlightedCountries(ocean.borderingCountries)}
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
          <div className="flex flex-wrap gap-1.5">
            {bordering.map((c) => (
              <button
                key={c!.id}
                onClick={() => { addRecent(c!.id); setSelection({ kind: 'country', id: c!.id }); }}
                className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-white/5 hover:bg-brand-500/10 transition-all"
              >
                <img src={c!.flagUrl} alt="" className="w-4 h-3 rounded object-cover" loading="lazy" />
                {c!.name}
              </button>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
