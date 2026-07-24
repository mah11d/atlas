export type SelectionKind =
  | 'country'
  | 'language'
  | 'organization'
  | 'continent'
  | 'ocean'
  | 'river'
  | 'mountain'
  | 'desert'
  | 'lake';

export interface Selection {
  kind: SelectionKind;
  id: string;
}

export interface Country {
  id: string; // ISO alpha-3
  iso2: string;
  name: string;
  nativeName: string;
  capital: string;
  population: number;
  area: number; // km²
  currency: string; // code
  currencyName: string;
  languages: string[]; // language ids
  religion: string;
  government: string;
  continent: string; // continent id
  region: string;
  subregion: string;
  timezone: string;
  callingCode: string;
  internetDomain: string;
  independenceDate: string;
  flagEmoji: string;
  flagUrl: string;
  coatOfArmsUrl?: string;
  heroImage: string;
  coordinates: [number, number]; // [lon, lat] for marker
  orgs: string[]; // organization ids
  borders: string[]; // country ids
  economyOverview: string;
  geographyOverview: string;
  climate: string;
  majorCities: string[];
  nationalSymbols: string[];
  unescoSites: string[];
  landmarks: string[];
  famousFoods: string[];
  wildlife: string[];
  funFacts: string[];
  history: string;
  culture: string;
  travel: string;
  hdi: number; // 0-1
  gdp: number; // USD nominal, billions
  literacyRate: number; // %
  internetUsage: number; // %
  lifeExpectancy: number; // years
  tourismArrivals: number; // millions/year
  forestArea: number; // %
  militaryPersonnel: number; // active
  climateZone: string;
  gdpPerCapita: number; // USD
  governmentType: string; // e.g. "Republic", "Constitutional Monarchy"
  majorRivers: string[];
  seasons: { name: string; months: string; temp: string; description: string }[];
  avgTemp: string;
  avgRainfall: string;
}

export interface Language {
  id: string;
  name: string;
  family: string;
  writingSystem: string;
  origin: string;
  nativeSpeakers: number; // millions
  secondSpeakers: number; // millions
  classification: string[]; // Official, National, etc.
  officialCountries: string[]; // country ids
  spokenCountries: string[]; // country ids
  similarLanguages: string[]; // language ids
  description: string;
}

export interface Organization {
  id: string;
  abbr: string;
  name: string;
  description: string;
  mission: string;
  headquarters: string;
  founded: string;
  members: string[]; // country ids
  categories: string[];
  logo: string; // emoji or short
  color: string;
}

export interface Continent {
  id: string;
  name: string;
  population: number;
  area: number;
  countries: string[];
  largestCities: string[];
  mountains: string[];
  rivers: string[];
  climate: string;
  wildlife: string[];
  economy: string;
  history: string;
  description: string;
  color: string;
}

export interface Ocean {
  id: string;
  name: string;
  area: number; // km²
  maxDepth: number; // m
  marineLife: string[];
  borderingCountries: string[];
  majorSeas: string[];
  islands: string[];
  facts: string[];
  description: string;
  coordinates: [number, number];
}

export interface PhysicalFeature {
  id: string;
  name: string;
  type: 'river' | 'mountain' | 'lake' | 'desert' | 'sea' | 'island' | 'peninsula';
  length?: number; // km
  area?: number; // km²
  elevation?: number; // m
  location: string;
  countries: string[];
  description: string;
  coordinates: [number, number];
}

export interface CountryNote {
  countryId: string;
  text: string;
  updatedAt: number;
}

export type MapMode = 'political' | 'physical' | 'daynight';
export type Theme = 'light' | 'dark';
export type ExplorerTab =
  | 'countries'
  | 'languages'
  | 'organizations'
  | 'religion'
  | 'continents'
  | 'rankings'
  | 'favorites'
  | 'recents'
  | 'compare';
export type CountryTab =
  | 'overview'
  | 'history'
  | 'geography'
  | 'economy'
  | 'culture'
  | 'travel'
  | 'weather'
  | 'connections';
export type EduMode = 'none' | 'kids' | 'students' | 'travelers' | 'historians';
