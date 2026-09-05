import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function makeLinkedin(name: string, agency: string) {
  return `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(name + ' ' + agency)}`;
}

function makeMap(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

const territoryData = {
  "Transportation Security Administration (TSA)": {
    prime_contractors: ["Leidos", "Peraton", "General Dynamics"],
    leadership: {
      "Administrator": { name: "David Pekoske", url: makeLinkedin("David Pekoske", "TSA") },
      "Deputy Administrator": { name: "Holly Canevari", url: makeLinkedin("Holly Canevari", "TSA") },
      "CIO": { name: "Yemi Oshinnaiye", url: makeLinkedin("Yemi Oshinnaiye", "TSA") },
      "Deputy CIO": { name: "K.C. Fowler", url: makeLinkedin("K.C. Fowler", "TSA") },
      "Chief Data Officer": { name: "Mike Karas", url: makeLinkedin("Mike Karas", "TSA") }
    },
    locations: [
      { name: "TSA Headquarters", address: "Springfield, VA", map_url: makeMap("TSA Headquarters Springfield, VA") },
      { name: "TSA Arlington", address: "Arlington, VA", map_url: makeMap("TSA Arlington, VA") }
    ]
  },
  "U.S. Coast Guard (USCG)": {
    prime_contractors: ["Lockheed Martin", "Huntington Ingalls", "Boeing"],
    leadership: {
      "Commandant": { name: "Linda L. Fagan", url: makeLinkedin("Linda L. Fagan", "USCG") },
      "Vice Commandant": { name: "Steven D. Poulin", url: makeLinkedin("Steven D. Poulin", "USCG") },
      "CIO": { name: "Rear Admiral Christopher Bartz", url: makeLinkedin("Christopher Bartz", "USCG") },
      "Deputy CIO": { name: "Captain Brian L. M. Kemble", url: makeLinkedin("Brian Kemble", "USCG") }
    },
    locations: [
      { name: "USCG Headquarters", address: "Washington, D.C.", map_url: makeMap("USCG Headquarters Washington, D.C.") }
    ]
  },
  "U.S. Citizenship and Immigration Services (USCIS)": {
    prime_contractors: ["Accenture", "IBM", "GDIT"],
    leadership: {
      "Director": { name: "Ur M. Jaddou", url: makeLinkedin("Ur M. Jaddou", "USCIS") },
      "CIO": { name: "Robert Dorr", url: makeLinkedin("Robert Dorr", "USCIS") },
      "Deputy CIO": { name: "Dave Bottom", url: makeLinkedin("Dave Bottom", "USCIS") },
      "Chief Artificial Intelligence Officer": { name: "Steve Yonkers", url: makeLinkedin("Steve Yonkers", "USCIS") }
    },
    locations: [
      { name: "USCIS Headquarters", address: "Camp Springs, MD", map_url: makeMap("USCIS Headquarters Camp Springs, MD") }
    ]
  },
  "U.S. Customs and Border Protection (CBP)": {
    prime_contractors: ["Palantir", "Anduril", "CACI"],
    leadership: {
      "Acting Commissioner": { name: "Troy A. Miller", url: makeLinkedin("Troy A. Miller", "CBP") },
      "CIO": { name: "Sanjeev Bhagowalia", url: makeLinkedin("Sanjeev Bhagowalia", "CBP") },
      "Deputy CIO": { name: "Edna Conway", url: makeLinkedin("Edna Conway", "CBP") }
    },
    locations: [
      { name: "CBP Headquarters", address: "Washington, D.C.", map_url: makeMap("CBP Headquarters Washington, D.C.") }
    ]
  },
  "U.S. Immigration and Customs Enforcement (ICE)": {
    prime_contractors: ["Palantir", "Geo Group", "CoreCivic"],
    leadership: {
      "Acting Director": { name: "Patrick J. Lechleitner", url: makeLinkedin("Patrick J. Lechleitner", "ICE") },
      "CIO": { name: "Richard Driggers", url: makeLinkedin("Richard Driggers", "ICE") },
      "Deputy CIO": { name: "Susan Corbin", url: makeLinkedin("Susan Corbin", "ICE") },
      "CTO": { name: "Christopher Chilbert", url: makeLinkedin("Christopher Chilbert", "ICE") }
    },
    locations: [
      { name: "ICE Headquarters", address: "Washington, D.C.", map_url: makeMap("ICE Headquarters Washington, D.C.") }
    ]
  },
  "Cybersecurity and Infrastructure Security Agency (CISA)": {
    prime_contractors: ["Booz Allen Hamilton", "CGI Federal", "SAIC"],
    leadership: {
      "Director": { name: "Jen Easterly", url: makeLinkedin("Jen Easterly", "CISA") },
      "Deputy Director": { name: "Nitin Natarajan", url: makeLinkedin("Nitin Natarajan", "CISA") },
      "CIO": { name: "Robert Costello", url: makeLinkedin("Robert Costello", "CISA") },
      "Deputy CIO": { name: "Lytwaive Hutchinson", url: makeLinkedin("Lytwaive Hutchinson", "CISA") },
      "Chief Data Officer": { name: "Steven McAndrews", url: makeLinkedin("Steven McAndrews", "CISA") }
    },
    locations: [
      { name: "CISA Headquarters", address: "Arlington, VA", map_url: makeMap("CISA Headquarters Arlington, VA") }
    ]
  }
};

async function run() {
  console.log('Populating Dan and Michael territory data with CIOs and tech stakeholders...');
  for (const [name, data] of Object.entries(territoryData)) {
    const { error, data: resData } = await supabase
      .from('oracle_territories')
      .update({
        prime_contractors: data.prime_contractors,
        leadership: data.leadership,
        locations: data.locations
      })
      .eq('name', name)
      .select();
    
    if (error) {
      console.error(`Error updating ${name}:`, error);
    } else if (resData.length === 0) {
      console.error(`No rows matched for ${name}`);
    } else {
      console.log(`Successfully updated ${name}`);
    }
  }
}

run();
