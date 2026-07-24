import { Globe2, Compass } from 'lucide-react';
import { useAtlas } from '@/context/AtlasContext';
import { getCountry, getLanguage, getOrganization, getContinent, getOcean } from '@/data';
import CountryDetail from './CountryDetail';
import LanguageDetail from './LanguageDetail';
import OrganizationDetail from './OrganizationDetail';
import ContinentDetail from './ContinentDetail';
import OceanDetail from './OceanDetail';
import { EmptyState } from './ui';

export default function LeftPanel() {
  const { selection } = useAtlas();

  if (!selection) {
    return (
      <div className="h-full">
        <EmptyState
          icon={<Globe2 className="w-10 h-10" />}
          title="Explore the World"
          message="Click any country on the map, search above, or browse the explorer panel to discover countries, languages, organizations, and more."
        />
      </div>
    );
  }

  let content: React.ReactNode = null;

  if (selection.kind === 'country') {
    const c = getCountry(selection.id);
    if (c) content = <CountryDetail country={c} />;
  } else if (selection.kind === 'language') {
    const l = getLanguage(selection.id);
    if (l) content = <LanguageDetail language={l} />;
  } else if (selection.kind === 'organization') {
    const o = getOrganization(selection.id);
    if (o) content = <OrganizationDetail org={o} />;
  } else if (selection.kind === 'continent') {
    const c = getContinent(selection.id);
    if (c) content = <ContinentDetail continent={c} />;
  } else if (selection.kind === 'ocean') {
    const o = getOcean(selection.id);
    if (o) content = <OceanDetail ocean={o} />;
  }

  if (!content) {
    return (
      <EmptyState
        icon={<Compass className="w-10 h-10" />}
        title="Not Found"
        message="This item doesn't have detailed information yet. Try selecting another country or topic."
      />
    );
  }

  return <div className="h-full">{content}</div>;
}
