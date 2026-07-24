import type { Country, Language, Organization, Continent, Ocean, PhysicalFeature } from '@/types';
import { countries as handCurated } from './countries';
import { generatedCountries } from './countryGenerator';
import { languages } from './languages';
import { organizations } from './organizations';
import { continents, oceans, physicalFeatures } from './geography';

// Merge hand-curated countries with generated ones, dedup by ID (hand-curated wins)
export const allCountries: Country[] = (() => {
  const map = new Map<string, Country>();
  for (const c of generatedCountries) map.set(c.id, c);
  for (const c of handCurated) map.set(c.id, c);
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
})();

export const countries = allCountries;
export { languages, organizations, continents, oceans, physicalFeatures };

export const countryById = new Map<string, Country>(allCountries.map((c) => [c.id, c]));
export const languageById = new Map<string, Language>(languages.map((l) => [l.id, l]));
export const orgById = new Map<string, Organization>(organizations.map((o) => [o.id, o]));
export const continentById = new Map<string, Continent>(continents.map((c) => [c.id, c]));
export const oceanById = new Map<string, Ocean>(oceans.map((o) => [o.id, o]));
export const featureById = new Map<string, PhysicalFeature>(physicalFeatures.map((f) => [f.id, f]));

export function getCountry(id: string): Country | undefined {
  return countryById.get(id);
}
export function getLanguage(id: string): Language | undefined {
  return languageById.get(id);
}
export function getOrganization(id: string): Organization | undefined {
  return orgById.get(id);
}
export function getContinent(id: string): Continent | undefined {
  return continentById.get(id);
}
export function getOcean(id: string): Ocean | undefined {
  return oceanById.get(id);
}

// Similar countries by weighted factors
export function similarCountries(id: string, limit = 5): { country: Country; reasons: string[] }[] {
  const c = countryById.get(id);
  if (!c) return [];
  const result: { country: Country; score: number; reasons: string[] }[] = [];
  for (const other of allCountries) {
    if (other.id === id) continue;
    let score = 0;
    const reasons: string[] = [];
    if (other.continent === c.continent) { score += 3; reasons.push('Same continent'); }
    const sharedLang = other.languages.filter((l) => c.languages.includes(l));
    if (sharedLang.length) { score += 2; reasons.push('Shared language'); }
    if (other.currency === c.currency) { score += 1.5; reasons.push('Shared currency'); }
    if (other.religion === c.religion) { score += 1; reasons.push('Same religion'); }
    const hdiDiff = Math.abs(other.hdi - c.hdi);
    if (hdiDiff < 0.05) { score += 2; reasons.push('Similar HDI'); }
    const popDiff = Math.abs(Math.log10(other.population) - Math.log10(c.population));
    if (popDiff < 0.3) { score += 1.5; reasons.push('Similar population'); }
    if (other.climateZone === c.climateZone) { score += 1; reasons.push('Similar climate'); }
    if (score >= 2) result.push({ country: other, score, reasons });
  }
  return result.sort((a, b) => b.score - a.score).slice(0, limit).map((r) => ({ country: r.country, reasons: r.reasons }));
}

// Countries sharing a border
export function neighbors(id: string): Country[] {
  const c = countryById.get(id);
  if (!c) return [];
  return c.borders.map((b) => countryById.get(b)).filter((x): x is Country => !!x);
}

// Countries sharing an official language
export function sharedLanguageCountries(id: string): Country[] {
  const c = countryById.get(id);
  if (!c) return [];
  return allCountries.filter((o) => o.id !== id && o.languages.some((l) => c.languages.includes(l)));
}

// Countries sharing a currency
export function sharedCurrencyCountries(id: string): Country[] {
  const c = countryById.get(id);
  if (!c) return [];
  return allCountries.filter((o) => o.id !== id && o.currency === c.currency);
}

// Countries with same religion
export function sharedReligionCountries(id: string): Country[] {
  const c = countryById.get(id);
  if (!c) return [];
  return allCountries.filter((o) => o.id !== id && o.religion === c.religion);
}

export interface SearchResult {
  kind: 'country' | 'language' | 'organization' | 'continent' | 'ocean';
  id: string;
  label: string;
  sublabel: string;
}

export function search(query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const results: SearchResult[] = [];
  for (const c of allCountries) {
    if (c.name.toLowerCase().includes(q) || c.capital.toLowerCase().includes(q) || c.iso2.toLowerCase() === q || c.id.toLowerCase() === q) {
      results.push({ kind: 'country', id: c.id, label: c.name, sublabel: `Capital: ${c.capital}` });
    }
  }
  for (const l of languages) {
    if (l.name.toLowerCase().includes(q)) {
      results.push({ kind: 'language', id: l.id, label: l.name, sublabel: `Language · ${l.family}` });
    }
  }
  for (const o of organizations) {
    if (o.name.toLowerCase().includes(q) || o.abbr.toLowerCase().includes(q)) {
      results.push({ kind: 'organization', id: o.id, label: o.abbr, sublabel: o.name });
    }
  }
  for (const c of continents) {
    if (c.name.toLowerCase().includes(q)) {
      results.push({ kind: 'continent', id: c.id, label: c.name, sublabel: 'Continent' });
    }
  }
  for (const o of oceans) {
    if (o.name.toLowerCase().includes(q)) {
      results.push({ kind: 'ocean', id: o.id, label: o.name, sublabel: 'Ocean' });
    }
  }
  return results.slice(0, 12);
}

export function formatNumber(n: number): string {
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return n.toString();
}
