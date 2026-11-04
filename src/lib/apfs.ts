export interface RawApfsRecord {
  id: number;
  apfs_number?: string;
  organization?: string;
  requirements_office?: string;
  contracting_office?: string;
  requirements_title?: string;
  requirement?: string;
  naics?: string | null;
  dollar_range?: {
    display_name?: string;
    display_order?: number;
  } | string | null;
  contract_type?: string | null;
  estimated_solicitation_release_date?: string | null;
  estimated_release_date?: string | null;
}

export interface AcquisitionForecastItem {
  id: number;
  apfs_number: string;
  requirements_title: string;
  description: string;
  dollar_range: string;
  contract_type: string;
  estimated_solicitation_release_date: string;
  url: string;
  organization?: string;
}

const IT_NAICS_PREFIXES = [
  '54151',  // Computer Systems Design, Custom Programming, Other Computer Related Services (541511, 541512, 541513, 541519)
  '518210', // Data Processing, Hosting, and Related Services (Cloud)
  '511210', // Software Publishers
  '513210', // Software Publishers (2022 NAICS)
  '517',    // Telecommunications
  '33411',  // Computer and Peripheral Equipment Manufacturing
];

const EXCLUDE_NAICS_PREFIXES = [
  '236',    // Construction of Buildings
  '237',    // Heavy and Civil Engineering Construction
  '238',    // Specialty Trade Contractors (HVAC, Plumbing, Electrical)
  '3366',   // Ship and Boat Building / Repairing
  '561210', // Facilities Support Services
  '561611', // Investigation and Personal Background Check Services
  '561612', // Security Guards and Patrol Services
  '562',    // Waste Management and Remediation Services
];

const EXCLUDE_TITLE_PATTERNS = [
  /\b(?:construction|janitorial|grounds\s+maintenance|trash|garbage|waste|elevator|hvac|plumbing|roofing|paving|fencing|laundry|food|meals|ammunition|uniform|tow\s+service|utility\s+cart|forklift|crane|buoy|cutter|drydock|dockside|hull|facilities\s+management|property\s+management|site\s+security|background\s+investigation)\b/i,
];

const TECH_KEYWORDS = [
  /\bcloud\b/i,
  /\bartificial intelligence\b/i,
  /\b(?:gen\s*ai|generative ai|machine learning|llm|ai\/ml)\b/i,
  /\bdata\s+(?:analytics|engineering|management|warehouse|lake|platform|science|modernization|integration|architecture|center|governance|system|service|processing)/i,
  /\bcyber(?:security)?\b/i,
  /\bzero\s*trust\b/i,
  /\bsoftware\b/i,
  /\bsaas\b|\bpaas\b|\biaas\b/i,
  /\binformation technology\b|\bit\s+(?:modernization|services|support|infrastructure|operations|security|system|equipment|solution)/i,
  /\b(?:system|application|it|technology|technical|network|legacy|platform|database|financial\s+systems?|enterprise)\s+modernization\b|\bmoderniz(?:e|ing)\s+(?:it|system|application|data|cloud|network|infrastructure)/i,
  /\bapplication\s+(?:development|modernization|support|maintenance|management|services)/i,
  /\bdigital\s+(?:transformation|modernization|identity|services|engineering|forensics|evidence)/i,
  /\bdevsecops\b|\bdevops\b/i,
  /\bdatabase\b|\boracle\b|\baws\b|\bazure\b|\bservicenow\b|\bsalesforce\b|\bdatabricks\b|\bpalantir\b|\bappian\b|\bmicrosoft\s*365\b|\bsap\b|\bs\/4\s*hana\b|\bgoogle\s+workspace\b/i,
  /\bbiometric/i,
  /\bidentity\s+(?:credential|management|verification|services)|\bicam\b/i,
  /\bnetwork\s+(?:engineering|operations|security|modernization|infrastructure|services)/i,
  /\benterprise\s+(?:architecture|platform|data|it|system|cloud|cyber)/i,
  /\bautomation\b|\brpa\b/i,
  /\banalytics\b/i,
];

export function isTechRelatedApfsRecord(item: RawApfsRecord): boolean {
  if (item.organization === 'USCG/CG-SHORE') return false;
  const naics = (item.naics || '').trim();
  const title = item.requirements_title || '';

  if (EXCLUDE_NAICS_PREFIXES.some((prefix) => naics.startsWith(prefix))) {
    return false;
  }
  if (EXCLUDE_TITLE_PATTERNS.some((rx) => rx.test(title))) {
    return false;
  }
  if (IT_NAICS_PREFIXES.some((prefix) => naics.startsWith(prefix))) {
    return true;
  }

  const text = `${title} ${item.requirement || ''}`;
  return TECH_KEYWORDS.some((rx) => rx.test(text));
}

export function cleanApfsText(text?: string | null): string {
  if (!text) return '';
  return text
    .replace(/\u0002/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

export function parseApfsDate(dateStr?: string | null): Date | null {
  if (!dateStr) return null;
  const parts = dateStr.trim().split('/');
  if (parts.length === 3) {
    const [m, d, y] = parts.map(Number);
    if (!isNaN(m) && !isNaN(d) && !isNaN(y)) {
      return new Date(y, m - 1, d);
    }
  }
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? null : parsed;
}

export function matchesApfsTerritory(item: RawApfsRecord, territoryName: string): boolean {
  const org = (item.organization || '').toUpperCase();
  const office = (item.requirements_office || '').toUpperCase();
  const contracting = (item.contracting_office || '').toUpperCase();
  const title = (item.requirements_title || '').toUpperCase();
  const req = (item.requirement || '').toUpperCase();
  const combined = `${org} ${office} ${contracting} ${title} ${req}`;
  const tName = territoryName.toUpperCase();

  if (tName.includes('(CBP)') || tName.includes('CUSTOMS AND BORDER')) {
    return org.startsWith('CBP');
  }
  if (tName.includes('(FEMA)') || tName.includes('EMERGENCY MANAGEMENT')) {
    return org.startsWith('FEMA');
  }
  if (tName.includes('(USSS)') || tName.includes('SECRET SERVICE')) {
    return org.startsWith('USSS');
  }
  if (tName.includes('(USCIS)') || tName.includes('CITIZENSHIP AND IMMIGRATION')) {
    return org.startsWith('USCIS');
  }
  if (tName.includes('(ICE)') || tName.includes('IMMIGRATION AND CUSTOMS ENFORCEMENT')) {
    return org.startsWith('ICE');
  }
  if (tName.includes('(USCG)') || tName.includes('COAST GUARD')) {
    return org.startsWith('USCG');
  }
  if (tName.includes('(TSA)') || tName.includes('TRANSPORTATION SECURITY')) {
    return org.startsWith('TSA');
  }
  if (tName.includes('(CISA)') || tName.includes('CYBERSECURITY AND INFRASTRUCTURE')) {
    return org.includes('CISA');
  }
  if (tName.includes('HSOAC') || tName.includes('HSSEDI')) {
    return (
      org === 'DHS HQ/S&T' ||
      combined.includes('HSOAC') ||
      combined.includes('HSSEDI') ||
      combined.includes('FFRDC')
    );
  }
  if (tName.includes('(I&A)') || tName.includes('INTELLIGENCE & ANALYSIS')) {
    return (
      org.includes('I&A') ||
      office.includes('INTELLIGENCE') ||
      combined.includes('INTELLIGENCE & ANALYSIS') ||
      combined.includes('HSIN')
    );
  }
  if (tName.includes('HEADQUARTERS') || tName === 'DHS HQ') {
    return (org.startsWith('DHS HQ') && !org.includes('CISA')) || org.startsWith('FLETC');
  }
  return false;
}

export function getForecastForTerritory(
  records: RawApfsRecord[],
  territoryName: string,
  now: Date = new Date()
): AcquisitionForecastItem[] {
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const threeYearsOut = new Date(now.getFullYear() + 3, now.getMonth(), now.getDate(), 23, 59, 59);

  const matched = records.filter((item) => {
    if (!isTechRelatedApfsRecord(item)) return false;
    const releaseStr = item.estimated_solicitation_release_date || item.estimated_release_date;
    const releaseDate = parseApfsDate(releaseStr);
    if (!releaseDate) return false;
    if (releaseDate < startOfToday || releaseDate > threeYearsOut) return false;
    return matchesApfsTerritory(item, territoryName);
  });

  matched.sort((a, b) => {
    const dateA = parseApfsDate(a.estimated_solicitation_release_date || a.estimated_release_date)?.getTime() ?? Infinity;
    const dateB = parseApfsDate(b.estimated_solicitation_release_date || b.estimated_release_date)?.getTime() ?? Infinity;
    return dateA - dateB;
  });

  return matched.map((item) => {
    const dollarRange =
      typeof item.dollar_range === 'string'
        ? item.dollar_range
        : item.dollar_range?.display_name || 'Not Specified';

    return {
      id: item.id,
      apfs_number: item.apfs_number || `APFS-${item.id}`,
      requirements_title: cleanApfsText(item.requirements_title) || 'Untitled Requirement',
      description: cleanApfsText(item.requirement) || 'No description provided.',
      dollar_range: dollarRange,
      contract_type: cleanApfsText(item.contract_type) || 'Not Specified',
      estimated_solicitation_release_date:
        item.estimated_solicitation_release_date || item.estimated_release_date || 'TBD',
      url: `https://apfs-cloud.dhs.gov/record/${item.id}/public-print/`,
      organization: item.organization,
    };
  });
}
