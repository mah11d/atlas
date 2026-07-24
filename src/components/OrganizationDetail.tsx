import { Building2, MapPin, CalendarDays, Target, Globe2, ArrowRight } from 'lucide-react';
import type { Organization } from '@/types';
import { useAtlas } from '@/context/AtlasContext';
import { getCountry } from '@/data';
import { Section, StatGrid, ChipList } from './ui';

export default function OrganizationDetail({ org }: { org: Organization }) {
  const { setSelection, addRecent, setHighlightedCountries } = useAtlas();
  const members = org.members.map((id) => getCountry(id)).filter(Boolean);

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Header */}
      <div className="relative h-32 shrink-0 flex items-end px-4 pb-3" style={{ background: `linear-gradient(135deg, ${org.color}, ${org.color}cc)` }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, white 2px, transparent 2px)', backgroundSize: '32px 32px' }} />
        <div className="relative flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-3xl shrink-0">
            {org.logo}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Building2 className="w-4 h-4 text-white/90" />
              <span className="text-xs font-semibold uppercase tracking-wide text-white/80">Organization</span>
            </div>
            <h1 className="font-display font-extrabold text-xl text-white drop-shadow leading-tight">{org.abbr}</h1>
            <p className="text-xs text-white/80 truncate">{org.name}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto panel-scroll px-4 py-4">
        <Section title="Description">
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">{org.description}</p>
        </Section>

        <Section title="Key Facts">
          <StatGrid items={[
            { label: 'Full Name', value: org.name.length > 22 ? org.abbr : org.name },
            { label: 'Founded', value: org.founded },
            { label: 'Headquarters', value: org.headquarters },
            { label: 'Members', value: `${members.length}` },
          ]} />
        </Section>

        <Section title="Mission" icon={<Target className="w-4 h-4" />}>
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">{org.mission}</p>
        </Section>

        <Section title="Categories" icon={<Globe2 className="w-4 h-4" />}>
          <ChipList items={org.categories} color="brand" />
        </Section>

        <Section title={`Member Countries (${members.length})`} icon={<MapPin className="w-4 h-4" />}>
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => setHighlightedCountries(org.members)}
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
            {members.map((c) => (
              <button
                key={c!.id}
                onClick={() => { addRecent(c!.id); setSelection({ kind: 'country', id: c!.id }); }}
                onMouseEnter={() => setHighlightedCountries([c!.id])}
                onMouseLeave={() => setHighlightedCountries(org.members)}
                className="flex items-center gap-2 p-2 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-white/5 hover:bg-brand-500/10 transition-all text-left"
              >
                <img src={c!.flagUrl} alt="" className="w-6 h-4 rounded object-cover" loading="lazy" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{c!.name}</span>
                <ArrowRight className="w-3 h-3 ml-auto text-slate-400" />
              </button>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
