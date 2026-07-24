import type { Country } from '@/types';
import type { RawCountry } from './rawTypes';
import { americas } from './rawAmericas';
import { europe } from './rawEurope';
import { africa } from './rawAfrica';
import { asiaOceania } from './rawAsiaOceania';

const rawCountries: RawCountry[] = [...americas, ...europe, ...africa, ...asiaOceania];

const HERO_BY_CONTINENT: Record<string, string> = {
  AF: 'https://images.pexels.com/photos/1534560/pexels-photo-1534560.jpeg?auto=compress&cs=tinysrgb&w=1200',
  AS: 'https://images.pexels.com/photos/1528671/pexels-photo-1528671.jpeg?auto=compress&cs=tinysrgb&w=1200',
  EU: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1200',
  NA: 'https://images.pexels.com/photos/3617500/pexels-photo-3617500.jpeg?auto=compress&cs=tinysrgb&w=1200',
  SA: 'https://images.pexels.com/photos/2086361/pexels-photo-2086361.jpeg?auto=compress&cs=tinysrgb&w=1200',
  OC: 'https://images.pexels.com/photos/995764/pexels-photo-995764.jpeg?auto=compress&cs=tinysrgb&w=1200',
  AN: 'https://images.pexels.com/photos/12951398/pexels-photo-12951398.jpeg?auto=compress&cs=tinysrgb&w=1200',
};

const HERO_BY_COUNTRY: Record<string, string> = {
  DEU: 'https://images.pexels.com/photos/109630/pexels-photo-109630.jpeg?auto=compress&cs=tinysrgb&w=1200',
  FRA: 'https://images.pexels.com/photos/161853/eiffel-tower-paris-france-161853.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ITA: 'https://images.pexels.com/photos/230436/pexels-photo-230436.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ESP: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=1200',
  GBR: 'https://images.pexels.com/photos/672532/pexels-photo-672532.jpeg?auto=compress&cs=tinysrgb&w=1200',
  PRT: 'https://images.pexels.com/photos/1534584/pexels-photo-1534584.jpeg?auto=compress&cs=tinysrgb&w=1200',
  NLD: 'https://images.pexels.com/photos/1796715/pexels-photo-1796715.jpeg?auto=compress&cs=tinysrgb&w=1200',
  GRC: 'https://images.pexels.com/photos/1534440/pexels-photo-1534440.jpeg?auto=compress&cs=tinysrgb&w=1200',
  CHE: 'https://images.pexels.com/photos/1547148/pexels-photo-1547148.jpeg?auto=compress&cs=tinysrgb&w=1200',
  AUT: 'https://images.pexels.com/photos/1098215/pexels-photo-1098215.jpeg?auto=compress&cs=tinysrgb&w=1200',
  BEL: 'https://images.pexels.com/photos/2363/france-landmark-lights-night.jpg?auto=compress&cs=tinysrgb&w=1200',
  IRL: 'https://images.pexels.com/photos/2050702/pexels-photo-2050702.jpeg?auto=compress&cs=tinysrgb&w=1200',
  POL: 'https://images.pexels.com/photos/1878293/pexels-photo-1878293.jpeg?auto=compress&cs=tinysrgb&w=1200',
  SWE: 'https://images.pexels.com/photos/1428781/pexels-photo-1428781.jpeg?auto=compress&cs=tinysrgb&w=1200',
  NOR: 'https://images.pexels.com/photos/2078126/pexels-photo-2078126.jpeg?auto=compress&cs=tinysrgb&w=1200',
  DNK: 'https://images.pexels.com/photos/713894/pexels-photo-713894.jpeg?auto=compress&cs=tinysrgb&w=1200',
  FIN: 'https://images.pexels.com/photos/3057359/pexels-photo-3057359.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ISL: 'https://images.pexels.com/photos/3363566/pexels-photo-3363566.jpeg?auto=compress&cs=tinysrgb&w=1200',
  CZE: 'https://images.pexels.com/photos/220182/pexels-photo-220182.jpeg?auto=compress&cs=tinysrgb&w=1200',
  HUN: 'https://images.pexels.com/photos/209726/pexels-photo-209726.jpeg?auto=compress&cs=tinysrgb&w=1200',
  RUS: 'https://images.pexels.com/photos/753339/pexels-photo-753339.jpeg?auto=compress&cs=tinysrgb&w=1200',
  UKR: 'https://images.pexels.com/photos/259627/pexels-photo-259627.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ROU: 'https://images.pexels.com/photos/1583470/pexels-photo-1583470.jpeg?auto=compress&cs=tinysrgb&w=1200',
  BGR: 'https://images.pexels.com/photos/532001/pexels-photo-532001.jpeg?auto=compress&cs=tinysrgb&w=1200',
  HRV: 'https://images.pexels.com/photos/2422497/pexels-photo-2422497.jpeg?auto=compress&cs=tinysrgb&w=1200',
  SRB: 'https://images.pexels.com/photos/934018/pexels-photo-934018.jpeg?auto=compress&cs=tinysrgb&w=1200',
  USA: 'https://images.pexels.com/photos/802024/pexels-photo-802024.jpeg?auto=compress&cs=tinysrgb&w=1200',
  CAN: 'https://images.pexels.com/photos/2501140/pexels-photo-2501140.jpeg?auto=compress&cs=tinysrgb&w=1200',
  MEX: 'https://images.pexels.com/photos/2521987/pexels-photo-2521987.jpeg?auto=compress&cs=tinysrgb&w=1200',
  BRA: 'https://images.pexels.com/photos/5499325/pexels-photo-5499325.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ARG: 'https://images.pexels.com/photos/2255925/pexels-photo-2255925.jpeg?auto=compress&cs=tinysrgb&w=1200',
  CHL: 'https://images.pexels.com/photos/2096550/pexels-photo-2096550.jpeg?auto=compress&cs=tinysrgb&w=1200',
  PER: 'https://images.pexels.com/photos/2662879/pexels-photo-2662879.jpeg?auto=compress&cs=tinysrgb&w=1200',
  COL: 'https://images.pexels.com/photos/5007156/pexels-photo-5007156.jpeg?auto=compress&cs=tinysrgb&w=1200',
  JPN: 'https://images.pexels.com/photos/2411915/pexels-photo-2411915.jpeg?auto=compress&cs=tinysrgb&w=1200',
  CHN: 'https://images.pexels.com/photos/6950296/pexels-photo-6950296.jpeg?auto=compress&cs=tinysrgb&w=1200',
  IND: 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=1200',
  KOR: 'https://images.pexels.com/photos/2379593/pexels-photo-2379593.jpeg?auto=compress&cs=tinysrgb&w=1200',
  THA: 'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=1200',
  VNM: 'https://images.pexels.com/photos/1254230/pexels-photo-1254230.jpeg?auto=compress&cs=tinysrgb&w=1200',
  IDN: 'https://images.pexels.com/photos/3425567/pexels-photo-3425567.jpeg?auto=compress&cs=tinysrgb&w=1200',
  MYS: 'https://images.pexels.com/photos/2078126/pexels-photo-2078126.jpeg?auto=compress&cs=tinysrgb&w=1200',
  PHL: 'https://images.pexels.com/photos/3425567/pexels-photo-3425567.jpeg?auto=compress&cs=tinysrgb&w=1200',
  EGY: 'https://images.pexels.com/photos/712413/pexels-photo-712413.jpeg?auto=compress&cs=tinysrgb&w=1200',
  MAR: 'https://images.pexels.com/photos/2178647/pexels-photo-2178647.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ZAF: 'https://images.pexels.com/photos/2597512/pexels-photo-2597512.jpeg?auto=compress&cs=tinysrgb&w=1200',
  KEN: 'https://images.pexels.com/photos/2090650/pexels-photo-2090650.jpeg?auto=compress&cs=tinysrgb&w=1200',
  NGA: 'https://images.pexels.com/photos/2531701/pexels-photo-2531701.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ETH: 'https://images.pexels.com/photos/1242599/pexels-photo-1242599.jpeg?auto=compress&cs=tinysrgb&w=1200',
  TUR: 'https://images.pexels.com/photos/1549326/pexels-photo-1549326.jpeg?auto=compress&cs=tinysrgb&w=1200',
  IRN: 'https://images.pexels.com/photos/2597375/pexels-photo-2597375.jpeg?auto=compress&cs=tinysrgb&w=1200',
  SAU: 'https://images.pexels.com/photos/3908239/pexels-photo-3908239.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ISR: 'https://images.pexels.com/photos/2693208/pexels-photo-2693208.jpeg?auto=compress&cs=tinysrgb&w=1200',
  AUS: 'https://images.pexels.com/photos/995764/pexels-photo-995764.jpeg?auto=compress&cs=tinysrgb&w=1200',
  NZL: 'https://images.pexels.com/photos/705774/pexels-photo-705774.jpeg?auto=compress&cs=tinysrgb&w=1200',
};

const FLAG_BASE = 'https://flagcdn.com/w320/';

function generateFunFacts(c: RawCountry): string[] {
  const facts: string[] = [];
  facts.push(`${c.name} has a population of approximately ${(c.population / 1e6).toFixed(1)} million people.`);
  if (c.area > 1000000) facts.push(`At ${c.area.toLocaleString()} km², it is one of the largest countries in the world.`);
  else if (c.area < 1000) facts.push(`At just ${c.area.toLocaleString()} km², it is one of the world's smallest countries.`);
  else facts.push(`Its total area is ${c.area.toLocaleString()} km².`);
  if (c.lifeExpectancy >= 80) facts.push(`It has one of the highest life expectancies at ${c.lifeExpectancy} years.`);
  else if (c.lifeExpectancy < 55) facts.push(`Life expectancy is around ${c.lifeExpectancy} years.`);
  facts.push(`The capital city is ${c.capital}.`);
  if (c.tourismArrivals > 20) facts.push(`It is a popular tourist destination with ${c.tourismArrivals} million visitors annually.`);
  return facts;
}

function generateEconomy(c: RawCountry): string {
  return `${c.name} has a GDP of approximately $${c.gdp} billion USD, with a GDP per capita of $${c.gdpPerCapita.toLocaleString()}. ${c.industries} The Human Development Index is ${c.hdi.toFixed(3)}, with a literacy rate of ${c.literacyRate}% and internet usage at ${c.internetUsage}%.`;
}

function generateGeography(c: RawCountry): string {
  return `${c.name} is located in ${c.subregion}. ${c.terrain} The climate is ${c.climateZone.toLowerCase()}.`;
}

function generateHistory(c: RawCountry): string {
  return `${c.historyBrief} ${c.name} gained independence on ${c.independenceDate}.`;
}

function generateCulture(c: RawCountry): string {
  return `${c.culturalInfluence} The official language(s) include ${c.languages.join(', ')}. Traditional cuisine features dishes such as ${c.famousFoods.slice(0, 3).join(', ')}.`;
}

function generateTravel(c: RawCountry): string {
  return `${c.name} offers visitors ${c.landmarks.slice(0, 3).join(', ')}, and more. The best time to visit depends on the region, with a ${c.climateZone.toLowerCase()} climate. The currency is the ${c.currencyName} (${c.currency}).`;
}

export function rawToCountry(c: RawCountry): Country {
  return {
    id: c.id,
    iso2: c.iso2,
    name: c.name,
    nativeName: c.name,
    capital: c.capital,
    population: c.population,
    area: c.area,
    currency: c.currency,
    currencyName: c.currencyName,
    languages: c.languages,
    religion: c.religion,
    government: c.government,
    governmentType: c.governmentType,
    continent: c.continent,
    region: c.subregion,
    subregion: c.subregion,
    timezone: c.timezone,
    callingCode: c.callingCode,
    internetDomain: c.internetDomain,
    independenceDate: c.independenceDate,
    flagEmoji: c.flagEmoji,
    flagUrl: c.iso2 ? `${FLAG_BASE}${c.iso2.toLowerCase()}.png` : '',
    heroImage: HERO_BY_COUNTRY[c.id] ?? HERO_BY_CONTINENT[c.continent] ?? HERO_BY_CONTINENT.EU,
    coordinates: c.coordinates,
    orgs: [],
    borders: [],
    economyOverview: generateEconomy(c),
    geographyOverview: generateGeography(c),
    climate: c.climateZone,
    majorCities: c.majorCities,
    nationalSymbols: [],
    unescoSites: [],
    landmarks: c.landmarks,
    famousFoods: c.famousFoods,
    wildlife: c.wildlife,
    funFacts: generateFunFacts(c),
    history: generateHistory(c),
    culture: generateCulture(c),
    travel: generateTravel(c),
    hdi: c.hdi,
    gdp: c.gdp,
    literacyRate: c.literacyRate,
    internetUsage: c.internetUsage,
    lifeExpectancy: c.lifeExpectancy,
    tourismArrivals: c.tourismArrivals,
    forestArea: c.forestArea,
    militaryPersonnel: c.militaryPersonnel,
    climateZone: c.climateZone,
    gdpPerCapita: c.gdpPerCapita,
    majorRivers: c.majorRivers?.length ? c.majorRivers : guessRivers(c),
    seasons: c.seasons?.length ? c.seasons : guessSeasons(c),
    avgTemp: c.avgTemp || guessAvgTemp(c),
    avgRainfall: c.avgRainfall || guessAvgRainfall(c),
  };
}

export const generatedCountries: Country[] = rawCountries.map(rawToCountry);

function guessRivers(c: RawCountry): string[] {
  const riverMap: Record<string, string[]> = {
    AF: ['Nile', 'Congo', 'Niger', 'Zambezi'],
    AS: ['Yangtze', 'Ganges', 'Mekong', 'Indus'],
    EU: ['Danube', 'Rhine', 'Seine', 'Thames'],
    NA: ['Mississippi', 'Rio Grande', 'St. Lawrence'],
    SA: ['Amazon', 'Paraná', 'Orinoco'],
    OC: ['Murray', 'Fly'],
    AN: [],
  };
  return riverMap[c.continent] || [];
}

function guessAvgTemp(c: RawCountry): string {
  const zone = c.climateZone.toLowerCase();
  if (zone.includes('desert') && !zone.includes('mediterranean')) return '25-35°C';
  if (zone.includes('tropical')) return '25-30°C';
  if (zone.includes('arctic') || zone.includes('subpolar') || zone.includes('polar')) return '-10 to 5°C';
  if (zone.includes('boreal')) return '-5 to 15°C';
  if (zone.includes('continental')) return '5-20°C';
  if (zone.includes('mediterranean')) return '15-25°C';
  if (zone.includes('oceanic')) return '10-18°C';
  if (zone.includes('subtropical')) return '15-25°C';
  return '10-25°C';
}

function guessAvgRainfall(c: RawCountry): string {
  const zone = c.climateZone.toLowerCase();
  if (zone.includes('desert')) return '50-250 mm';
  if (zone.includes('tropical')) return '1500-3000 mm';
  if (zone.includes('boreal')) return '400-800 mm';
  if (zone.includes('mediterranean')) return '500-900 mm';
  if (zone.includes('oceanic')) return '800-1200 mm';
  if (zone.includes('continental')) return '500-1000 mm';
  return '800-1500 mm';
}

function guessSeasons(c: RawCountry): { name: string; months: string; temp: string; description: string }[] {
  const zone = c.climateZone.toLowerCase();
  const isNorthern = c.coordinates[1] > 0;

  if (zone.includes('tropical')) {
    return [
      { name: 'Dry Season', months: isNorthern ? 'Nov-Apr' : 'May-Oct', temp: '25-32°C', description: 'Warm and dry with low rainfall.' },
      { name: 'Wet Season', months: isNorthern ? 'May-Oct' : 'Nov-Apr', temp: '25-30°C', description: 'Heavy rainfall and high humidity.' },
    ];
  }
  if (zone.includes('desert') && !zone.includes('mediterranean')) {
    return [
      { name: 'Hot Season', months: isNorthern ? 'Jun-Sep' : 'Dec-Mar', temp: '35-45°C', description: 'Extremely hot and dry.' },
      { name: 'Cool Season', months: isNorthern ? 'Dec-Feb' : 'Jun-Aug', temp: '15-25°C', description: 'Mild days, cold nights.' },
    ];
  }
  if (zone.includes('mediterranean')) {
    return [
      { name: 'Spring', months: isNorthern ? 'Mar-May' : 'Sep-Nov', temp: '15-22°C', description: 'Mild and pleasant with blooming flowers.' },
      { name: 'Summer', months: isNorthern ? 'Jun-Aug' : 'Dec-Feb', temp: '25-35°C', description: 'Hot and dry.' },
      { name: 'Autumn', months: isNorthern ? 'Sep-Nov' : 'Mar-May', temp: '15-25°C', description: 'Mild with occasional rain.' },
      { name: 'Winter', months: isNorthern ? 'Dec-Feb' : 'Jun-Aug', temp: '5-15°C', description: 'Cool and wet.' },
    ];
  }
  if (zone.includes('boreal') || zone.includes('arctic') || zone.includes('subpolar') || zone.includes('polar')) {
    return [
      { name: 'Spring', months: isNorthern ? 'Apr-Jun' : 'Oct-Dec', temp: '0-10°C', description: 'Snow melts, days lengthen.' },
      { name: 'Summer', months: isNorthern ? 'Jul-Aug' : 'Jan-Feb', temp: '10-20°C', description: 'Brief warm season with midnight sun.' },
      { name: 'Autumn', months: isNorthern ? 'Sep-Oct' : 'Mar-Apr', temp: '0-10°C', description: 'Colors change, first frost.' },
      { name: 'Winter', months: isNorthern ? 'Nov-Mar' : 'May-Sep', temp: '-20 to -5°C', description: 'Long, dark, and snowy.' },
    ];
  }
  // Default temperate/continental
  return [
    { name: 'Spring', months: isNorthern ? 'Mar-May' : 'Sep-Nov', temp: '10-18°C', description: 'Mild temperatures with occasional rain.' },
    { name: 'Summer', months: isNorthern ? 'Jun-Aug' : 'Dec-Feb', temp: '20-30°C', description: 'Warm to hot with longer days.' },
    { name: 'Autumn', months: isNorthern ? 'Sep-Nov' : 'Mar-May', temp: '10-18°C', description: 'Cooling temperatures, harvest season.' },
    { name: 'Winter', months: isNorthern ? 'Dec-Feb' : 'Jun-Aug', temp: '0-10°C', description: 'Cold with possible snowfall.' },
  ];
}
