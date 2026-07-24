export interface ReligionGroup {
  name: string;
  sects: { name: string; countries: string[] }[];
  total: number;
}

function normalizeReligion(religion: string): { major: string; sect: string } {
  const r = religion.toLowerCase();

  if (r.includes('islam')) {
    let sect = 'Other Muslim';
    if (r.includes('sunni') && r.includes('shia')) sect = 'Sunni & Shia';
    else if (r.includes('sunni')) sect = 'Sunni';
    else if (r.includes('shia')) sect = 'Shia';
    else if (r.includes('ibadi')) sect = 'Ibadi';
    else if (r.includes('sufi')) sect = 'Sufi';
    else if (r.includes('secular')) sect = 'Secular Muslim';
    if (r.includes('christian') || r.includes('orthodox') || r.includes('catholic') || r.includes('protestant')) {
      return { major: 'Islam & Christianity', sect: 'Mixed' };
    }
    return { major: 'Islam', sect };
  }

  if (r.includes('catholic')) {
    let sect = 'Roman Catholic';
    if (r.includes('protestant')) return { major: 'Christianity', sect: 'Catholic & Protestant' };
    if (r.includes('syncretic') || r.includes('vodou') || r.includes('vodun')) sect = 'Catholic (Syncretic)';
    return { major: 'Christianity', sect };
  }

  if (r.includes('orthodox')) {
    let sect = 'Orthodox';
    if (r.includes('greek')) sect = 'Greek Orthodox';
    else if (r.includes('russian')) sect = 'Russian Orthodox';
    else if (r.includes('georgian')) sect = 'Georgian Orthodox';
    else if (r.includes('armenian')) sect = 'Armenian Apostolic';
    return { major: 'Christianity', sect };
  }

  if (r.includes('protestant') || r.includes('lutheran') || r.includes('baptist') || r.includes('anglican') || r.includes('presbyterian')) {
    let sect = 'Protestant';
    if (r.includes('lutheran')) sect = 'Lutheran';
    else if (r.includes('baptist')) sect = 'Baptist';
    else if (r.includes('anglican')) sect = 'Anglican';
    else if (r.includes('presbyterian')) sect = 'Presbyterian';
    if (r.includes('catholic')) return { major: 'Christianity', sect: 'Catholic & Protestant' };
    return { major: 'Christianity', sect };
  }

  if (r.includes('anglicanism') || r.includes('anglican')) {
    return { major: 'Christianity', sect: 'Anglican' };
  }

  if (r.includes('christian')) {
    let sect = 'General Christian';
    if (r.includes('pluralistic')) sect = 'Pluralistic';
    else if (r.includes('secular')) sect = 'Secular Christian';
    return { major: 'Christianity', sect };
  }

  if (r.includes('buddhism') || r.includes('buddhist')) {
    let sect = 'General Buddhist';
    if (r.includes('theravada')) sect = 'Theravada';
    else if (r.includes('tibetan') || r.includes('vajrayana')) sect = 'Vajrayana';
    if (r.includes('hindu') || r.includes('tao') || r.includes('islam') || r.includes('christian')) {
      return { major: 'Buddhism & Other', sect: 'Mixed' };
    }
    return { major: 'Buddhism', sect };
  }

  if (r.includes('hindu')) {
    return { major: 'Hinduism', sect: 'General' };
  }

  if (r.includes('judaism') || r.includes('jewish')) {
    return { major: 'Judaism', sect: 'General' };
  }

  if (r.includes('shinto')) {
    return { major: 'Shintoism', sect: 'General' };
  }

  if (r.includes('irreligion') || r.includes('none') || r.includes('juche')) {
    return { major: 'Non-religious', sect: 'Secular' };
  }

  if (r.includes('indigenous') || r.includes('traditional') || r.includes('folk')) {
    return { major: 'Indigenous / Folk', sect: 'General' };
  }

  return { major: religion, sect: 'General' };
}

export function groupReligions(countries: { id: string; religion: string }[]): ReligionGroup[] {
  const groups: Record<string, Record<string, string[]>> = {};
  for (const c of countries) {
    const { major, sect } = normalizeReligion(c.religion || 'Unknown');
    if (!groups[major]) groups[major] = {};
    if (!groups[major][sect]) groups[major][sect] = [];
    groups[major][sect].push(c.id);
  }

  return Object.entries(groups)
    .map(([major, sects]) => ({
      name: major,
      sects: Object.entries(sects)
        .map(([sect, ids]) => ({ name: sect, countries: ids }))
        .sort((a, b) => b.countries.length - a.countries.length),
      total: Object.values(sects).reduce((sum, arr) => sum + arr.length, 0),
    }))
    .sort((a, b) => b.total - a.total);
}

export function sameMajorReligion(a: string, b: string): boolean {
  return normalizeReligion(a).major === normalizeReligion(b).major;
}

export function getMajorReligion(religion: string): string {
  return normalizeReligion(religion).major;
}
