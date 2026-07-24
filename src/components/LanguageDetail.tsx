import { Globe2, Users, BookOpen, Languages, ArrowRight, MapPin } from 'lucide-react';
import type { Language } from '@/types';
import { useAtlas } from '@/context/AtlasContext';
import { getCountry, getLanguage } from '@/data';
import { Section, StatGrid, ChipList } from './ui';

export default function LanguageDetail({ language }: { language: Language }) {
  const { setSelection, addRecent, setHighlightedCountries } = useAtlas();
  const officialCountries = language.officialCountries.map((id) => getCountry(id)).filter(Boolean);
  const spokenCountries = language.spokenCountries.map((id) => getCountry(id)).filter(Boolean);
  const similar = language.similarLanguages.map((id) => getLanguage(id)).filter(Boolean);

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Header */}
      <div className="relative h-32 shrink-0 bg-gradient-to-br from-brand-600 via-brand-500 to-accent-500 flex items-end px-4 pb-3">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <Languages className="w-5 h-5 text-white/90" />
            <span className="text-xs font-semibold uppercase tracking-wide text-white/80">Language</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl text-white drop-shadow">{language.name}</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto panel-scroll px-4 py-4">
        <Section title="Overview">
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">{language.description}</p>
        </Section>

        <Section title="Key Facts">
          <StatGrid items={[
            { label: 'Language Family', value: language.family },
            { label: 'Writing System', value: language.writingSystem },
            { label: 'Origin', value: language.origin },
            { label: 'Native Speakers', value: `${language.nativeSpeakers}M` },
            { label: 'Second Speakers', value: `${language.secondSpeakers}M` },
            { label: 'Total Speakers', value: `${language.nativeSpeakers + language.secondSpeakers}M` },
          ]} />
        </Section>

        <Section title="Classification" icon={<BookOpen className="w-4 h-4" />}>
          <ChipList items={language.classification} color="accent" />
        </Section>

        <Section title="Official Countries" icon={<Globe2 className="w-4 h-4" />}>
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => setHighlightedCountries(language.officialCountries)}
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
            {officialCountries.map((c) => (
              <button
                key={c!.id}
                onClick={() => { addRecent(c!.id); setSelection({ kind: 'country', id: c!.id }); }}
                onMouseEnter={() => setHighlightedCountries([c!.id])}
                onMouseLeave={() => setHighlightedCountries(language.officialCountries)}
                className="flex items-center gap-2 p-2 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-white/5 hover:bg-brand-500/10 transition-all text-left"
              >
                <img src={c!.flagUrl} alt="" className="w-6 h-4 rounded object-cover" loading="lazy" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{c!.name}</span>
                <ArrowRight className="w-3 h-3 ml-auto text-slate-400" />
              </button>
            ))}
          </div>
        </Section>

        {spokenCountries.length > officialCountries.length && (
          <Section title="Also Spoken In" icon={<Users className="w-4 h-4" />}>
            <div className="flex flex-wrap gap-1.5">
              {spokenCountries.filter((c) => !language.officialCountries.includes(c!.id)).map((c) => (
                <button
                  key={c!.id}
                  onClick={() => { addRecent(c!.id); setSelection({ kind: 'country', id: c!.id }); }}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-slate-200/50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-brand-500/15 transition-colors"
                >
                  <MapPin className="w-3 h-3" />
                  {c!.name}
                </button>
              ))}
            </div>
          </Section>
        )}

        {similar.length > 0 && (
          <Section title="Similar Languages" icon={<Languages className="w-4 h-4" />}>
            <div className="flex flex-wrap gap-1.5">
              {similar.map((l) => (
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
        )}
      </div>
    </div>
  );
}
