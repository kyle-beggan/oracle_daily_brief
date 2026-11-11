import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import {
  fetchUpdatedPrimeContractsMap,
  getPrimeContractsForTerritory,
  PrimeContractItem
} from '../src/lib/primeContracts';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function makeSalesNav(name: string, agency: string) {
  return `https://www.linkedin.com/sales/search/people?query=(keywords%3A${encodeURIComponent(name + ' ' + agency)})`;
}

function makeMap(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

const territoryData: Record<
  string,
  {
    prime_contractors?: string[];
    leadership: Record<string, { name: string; url: string }>;
    locations?: { name: string; address: string; map_url: string }[];
  }
> = {
  "U.S. Department of Homeland Security Headquarters": {
    leadership: {
      "Secretary of Homeland Security": { name: "Markwayne Mullin", url: makeSalesNav("Markwayne Mullin", "Department of Homeland Security") },
      "Deputy Secretary": { name: "Troy Edgar", url: makeSalesNav("Troy Edgar", "Department of Homeland Security") },
      "Acting CIO & Chief AI Officer": { name: "Kyle Schutt", url: makeSalesNav("Kyle Schutt", "Department of Homeland Security") },
      "Deputy CIO": { name: "Rear Admiral Christopher Bartz", url: makeSalesNav("Christopher Bartz", "Department of Homeland Security") },
      "Chief Data Officer": { name: "Mike Horton", url: makeSalesNav("Mike Horton", "Department of Homeland Security") },
      "CISO": { name: "Paul Boscacci", url: makeSalesNav("Paul Boscacci", "Department of Homeland Security") }
    }
  },
  "Federal Emergency Management Agency (FEMA)": {
    leadership: {
      "Acting Administrator": { name: "Cameron Hamilton", url: makeSalesNav("Cameron Hamilton", "FEMA") },
      "CIO": { name: "Steven McAndrews", url: makeSalesNav("Steven McAndrews", "FEMA") },
      "Deputy CIO": { name: "Zeke Maldonado", url: makeSalesNav("Zeke Maldonado", "FEMA") },
      "Chief Technology Officer": { name: "Bobby McCandlish", url: makeSalesNav("Bobby McCandlish", "FEMA") },
      "CISO": { name: "Matthew McCarty", url: makeSalesNav("Matthew McCarty", "FEMA") }
    }
  },
  "Homeland Security Operational Analysis Center (HSOAC) & Homeland Security Systems Engineering and Development Institute (HSSEDI)": {
    leadership: {
      "HSOAC Director (RAND)": { name: "Eric Landree", url: makeSalesNav("Eric Landree", "RAND HSOAC") },
      "HSSEDI Director (MITRE)": { name: "Kerry Buckley", url: makeSalesNav("Kerry Buckley", "MITRE HSSEDI") },
      "DHS S&T Senior Official": { name: "Julie Brewer", url: makeSalesNav("Julie Brewer", "DHS Science and Technology") },
      "DHS S&T CIO": { name: "Nabajyoti Barkakati", url: makeSalesNav("Nabajyoti Barkakati", "Department of Homeland Security") }
    }
  },
  "U.S. Secret Service (USSS)": {
    leadership: {
      "Director": { name: "Sean M. Curran", url: makeSalesNav("Sean Curran", "Secret Service") },
      "Deputy Director": { name: "Matthew Quinn", url: makeSalesNav("Matthew Quinn", "Secret Service") },
      "CIO": { name: "Chris Kraft", url: makeSalesNav("Chris Kraft", "Secret Service") },
      "Deputy CIO": { name: "Susan Palmer", url: makeSalesNav("Susan Palmer", "Secret Service") }
    }
  },
  "DHS Office of Intelligence & Analysis (I&A)": {
    leadership: {
      "Under Secretary for Intelligence & Analysis": { name: "Matthew Kozma", url: makeSalesNav("Matthew Kozma", "Department of Homeland Security") },
      "CIO": { name: "Ken Massey", url: makeSalesNav("Ken Massey", "Department of Homeland Security") },
      "Deputy CIO": { name: "Jennifer Jones", url: makeSalesNav("Jennifer Jones", "Department of Homeland Security") },
      "Chief Data Officer": { name: "Robert Wood", url: makeSalesNav("Robert Wood", "Department of Homeland Security") }
    }
  },
  "Transportation Security Administration (TSA)": {
    prime_contractors: ["Leidos", "Peraton", "General Dynamics"],
    leadership: {
      "Acting Administrator": { name: "Ha Nguyen McNeill", url: makeSalesNav("Ha Nguyen McNeill", "TSA") },
      "CIO": { name: "Balaji V. Subramaniam", url: makeSalesNav("Balaji Subramaniam", "TSA") },
      "Deputy CIO": { name: "David Earle", url: makeSalesNav("David Earle", "TSA") },
      "Chief Data Officer": { name: "Mike Karas", url: makeSalesNav("Mike Karas", "TSA") }
    },
    locations: [
      { name: "TSA Headquarters", address: "Springfield, VA", map_url: makeMap("TSA Headquarters Springfield, VA") },
      { name: "TSA Arlington", address: "Arlington, VA", map_url: makeMap("TSA Arlington, VA") }
    ]
  },
  "U.S. Coast Guard (USCG)": {
    prime_contractors: ["Lockheed Martin", "Huntington Ingalls", "Boeing"],
    leadership: {
      "Commandant": { name: "Admiral Kevin E. Lunday", url: makeSalesNav("Kevin Lunday", "Coast Guard") },
      "Vice Commandant": { name: "Vice Admiral Thomas G. Allan Jr.", url: makeSalesNav("Thomas Allan", "Coast Guard") },
      "Assistant Commandant for C5I & CIO": { name: "Scott St. Pierre", url: makeSalesNav("Scott St. Pierre", "Coast Guard") },
      "Deputy Commandant for Systems": { name: "Rear Admiral Jon P. Hickey", url: makeSalesNav("Jon Hickey", "Coast Guard") }
    },
    locations: [
      { name: "USCG Headquarters", address: "Washington, D.C.", map_url: makeMap("USCG Headquarters Washington, D.C.") }
    ]
  },
  "U.S. Citizenship and Immigration Services (USCIS)": {
    prime_contractors: ["Accenture", "IBM", "GDIT"],
    leadership: {
      "Director": { name: "Joseph B. Edlow", url: makeSalesNav("Joseph Edlow", "USCIS") },
      "CIO": { name: "Andrew Vanjani", url: makeSalesNav("Andrew Vanjani", "USCIS") },
      "Deputy CIO": { name: "Dave Bottom", url: makeSalesNav("Dave Bottom", "USCIS") },
      "Chief Data & AI Officer": { name: "Steve Yonkers", url: makeSalesNav("Steve Yonkers", "USCIS") }
    },
    locations: [
      { name: "USCIS Headquarters", address: "Camp Springs, MD", map_url: makeMap("USCIS Headquarters Camp Springs, MD") }
    ]
  },
  "U.S. Customs and Border Protection (CBP)": {
    prime_contractors: ["Palantir", "Anduril", "CACI"],
    leadership: {
      "Commissioner": { name: "Rodney S. Scott", url: makeSalesNav("Rodney Scott", "Customs and Border Protection") },
      "Deputy Commissioner": { name: "Pete Flores", url: makeSalesNav("Pete Flores", "Customs and Border Protection") },
      "CIO & Assistant Commissioner (OIT)": { name: "Sanjeev \"Sonny\" Bhagowalia", url: makeSalesNav("Sanjeev Bhagowalia", "Customs and Border Protection") },
      "Deputy CIO": { name: "Jay Alalasundaram", url: makeSalesNav("Jay Alalasundaram", "Customs and Border Protection") },
      "CTO": { name: "Sunil Madhugiri", url: makeSalesNav("Sunil Madhugiri", "Customs and Border Protection") }
    },
    locations: [
      { name: "CBP Headquarters", address: "Washington, D.C.", map_url: makeMap("CBP Headquarters Washington, D.C.") }
    ]
  },
  "U.S. Immigration and Customs Enforcement (ICE)": {
    prime_contractors: ["Palantir", "Geo Group", "CoreCivic"],
    leadership: {
      "Acting Director": { name: "Todd M. Lyons", url: makeSalesNav("Todd Lyons", "Immigration and Customs Enforcement") },
      "CIO": { name: "Dustin Goetz", url: makeSalesNav("Dustin Goetz", "Immigration and Customs Enforcement") },
      "Deputy CIO": { name: "Rob Thorne", url: makeSalesNav("Rob Thorne", "Immigration and Customs Enforcement") },
      "CTO": { name: "Christopher Chilbert", url: makeSalesNav("Christopher Chilbert", "Immigration and Customs Enforcement") }
    },
    locations: [
      { name: "ICE Headquarters", address: "Washington, D.C.", map_url: makeMap("ICE Headquarters Washington, D.C.") }
    ]
  },
  "Cybersecurity and Infrastructure Security Agency (CISA)": {
    prime_contractors: ["Booz Allen Hamilton", "CGI Federal", "SAIC"],
    leadership: {
      "Acting Director": { name: "Nick Andersen", url: makeSalesNav("Nick Andersen", "CISA") },
      "Deputy Director": { name: "Madhu Gottumukkala", url: makeSalesNav("Madhu Gottumukkala", "CISA") },
      "Acting CIO": { name: "Preston Werntz", url: makeSalesNav("Preston Werntz", "CISA") },
      "Deputy CIO": { name: "Lytwaive Hutchinson", url: makeSalesNav("Lytwaive Hutchinson", "CISA") },
      "Acting EAD for Cybersecurity": { name: "Chris Butera", url: makeSalesNav("Chris Butera", "CISA") }
    },
    locations: [
      { name: "CISA Headquarters", address: "Arlington, VA", map_url: makeMap("CISA Headquarters Arlington, VA") }
    ]
  }
};

async function run() {
  console.log('Updating all DHS territory leadership records with current leadership & Sales Navigator URLs...');
  for (const [name, data] of Object.entries(territoryData)) {
    const updatePayload: Record<string, unknown> = {
      leadership: data.leadership
    };
    if (data.prime_contractors) updatePayload.prime_contractors = data.prime_contractors;
    if (data.locations) updatePayload.locations = data.locations;

    const { error, data: resData } = await supabase
      .from('oracle_territories')
      .update(updatePayload)
      .eq('name', name)
      .select();

    if (error) {
      console.error(`Error updating ${name}:`, error);
    } else if (!resData || resData.length === 0) {
      console.error(`No rows matched for ${name}`);
    } else {
      console.log(`Successfully updated oracle_territories for: ${name}`);
    }
  }

  console.log('Fetching and caching DHS prime contracts to public/data/prime_contracts.json...');
  const primeContractsMap = await fetchUpdatedPrimeContractsMap();
  const publicDataDir = path.join(process.cwd(), 'public', 'data');
  await fs.mkdir(publicDataDir, { recursive: true });
  await fs.writeFile(
    path.join(publicDataDir, 'prime_contracts.json'),
    JSON.stringify(primeContractsMap, null, 2)
  );
  console.log('Saved public/data/prime_contracts.json');

  console.log('Syncing updated leadership and prime_contracts into recent oracle_daily_briefs...');
  const { data: briefs, error: briefsErr } = await supabase
    .from('oracle_daily_briefs')
    .select('id, user_id, date, territories')
    .order('date', { ascending: false })
    .limit(30);

  if (briefsErr) {
    console.error('Error fetching oracle_daily_briefs:', briefsErr);
    return;
  }

  for (const brief of briefs || []) {
    if (!Array.isArray(brief.territories)) continue;
    let changed = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedTerritories = brief.territories.map((t: any) => {
      const match = territoryData[t.name];
      const primesList: string[] = Array.isArray(t.prime_contractors)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? t.prime_contractors.map((p: any) => (typeof p === 'string' ? p : p?.value || ''))
        : [];
      const territoryPrimeContracts: Record<string, PrimeContractItem[]> = {};
      for (const primeName of primesList) {
        if (!primeName) continue;
        territoryPrimeContracts[primeName] = getPrimeContractsForTerritory(
          t.name,
          primeName,
          undefined,
          primeContractsMap
        );
      }

      changed = true;
      return {
        ...t,
        leadership: match ? match.leadership : t.leadership,
        prime_contracts: territoryPrimeContracts
      };
    });

    if (changed) {
      const { error: updateErr } = await supabase
        .from('oracle_daily_briefs')
        .update({ territories: updatedTerritories })
        .eq('id', brief.id);
      if (updateErr) {
        console.error(`Error updating brief ${brief.id}:`, updateErr);
      } else {
        console.log(`Updated leadership in brief ${brief.id} (${brief.date})`);
      }
    }
  }
}

run();
