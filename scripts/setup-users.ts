import { supabase } from './supabase';

async function main() {
  console.log('Setting up multi-user data...');

  // 1. Create Users
  const usersToCreate = [
    { name: 'Kyle Beggan', home_address: 'Fredericksburg, VA' },
    { name: 'Dan Ungerleider', home_address: 'Washington, DC' }, // Placeholder
    { name: 'Michael Scott', home_address: 'Arlington, VA' } // Placeholder
  ];

  for (const u of usersToCreate) {
    await supabase.from('oracle_users').upsert(u, { onConflict: 'name' });
  }

  // Fetch created users to get their UUIDs
  const { data: users, error: userError } = await supabase.from('oracle_users').select('*');
  if (userError || !users) {
    throw new Error('Failed to fetch users');
  }

  const kyle = users.find(u => u.name === 'Kyle Beggan');
  const dan = users.find(u => u.name === 'Dan Ungerleider');
  const michael = users.find(u => u.name === 'Michael Scott');

  if (!kyle || !dan || !michael) throw new Error('Failed to find users');

  // 2. Assign existing territories to Kyle
  // We'll update all territories that currently have a null user_id to belong to Kyle
  const { error: kyleErr } = await supabase.from('oracle_territories')
    .update({ user_id: kyle.id })
    .is('user_id', null);
  
  if (kyleErr) console.error('Error assigning territories to Kyle:', kyleErr);

  // 3. Create Dan's Territories
  const danTerritories = [
    {
      user_id: dan.id,
      name: 'Transportation Security Administration (TSA)',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Transportation_Security_Administration_seal.svg',
      mission: 'Protect the nation\'s transportation systems to ensure freedom of movement for people and commerce.',
      html: '',
      tech_priorities: ['Biometrics', 'Checkpoint Security Tech', 'Data Analytics'],
      prime_contractors: [],
      leadership: [],
      locations: []
    },
    {
      user_id: dan.id,
      name: 'U.S. Coast Guard (USCG)',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Seal_of_the_United_States_Coast_Guard.svg',
      mission: 'Ensure the nation\'s maritime safety, security and stewardship.',
      html: '',
      tech_priorities: ['C5ISR', 'Unmanned Systems', 'Cybersecurity'],
      prime_contractors: [],
      leadership: [],
      locations: []
    },
    {
      user_id: dan.id,
      name: 'U.S. Citizenship and Immigration Services (USCIS)',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/US-CitizenshipAndImmigrationServices-Seal.svg',
      mission: 'Administer the nation\'s lawful immigration system, safeguarding its integrity and promise by efficiently and fairly adjudicating requests for immigration benefits.',
      html: '',
      tech_priorities: ['Digital Identity', 'Case Management Modernization', 'Cloud Migration'],
      prime_contractors: [],
      leadership: [],
      locations: []
    }
  ];

  // 4. Create Michael's Territories
  const michaelTerritories = [
    {
      user_id: michael.id,
      name: 'U.S. Customs and Border Protection (CBP)',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Seal_of_the_United_States_Customs_and_Border_Protection.svg',
      mission: 'Safeguard America\'s borders thereby protecting the public from dangerous people and materials while enhancing the Nation\'s global economic competitiveness by enabling legitimate trade and travel.',
      html: '',
      tech_priorities: ['Border Surveillance Tech', 'Biometric Entry-Exit', 'Trade Facilitation Systems'],
      prime_contractors: [],
      leadership: [],
      locations: []
    },
    {
      user_id: michael.id,
      name: 'U.S. Immigration and Customs Enforcement (ICE)',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Seal_of_the_United_States_Immigration_and_Customs_Enforcement.svg',
      mission: 'Protect America from the cross-border crime and illegal immigration that threaten national security and public safety.',
      html: '',
      tech_priorities: ['Law Enforcement Tech', 'Data Analytics', 'Case Management'],
      prime_contractors: [],
      leadership: [],
      locations: []
    },
    {
      user_id: michael.id,
      name: 'Cybersecurity and Infrastructure Security Agency (CISA)',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Seal_of_the_Cybersecurity_and_Infrastructure_Security_Agency.svg',
      mission: 'Lead the national effort to understand, manage, and reduce risk to our cyber and physical infrastructure.',
      html: '',
      tech_priorities: ['Threat Intelligence', 'Zero Trust Architecture', 'Cloud Security'],
      prime_contractors: [],
      leadership: [],
      locations: []
    }
  ];

  // Upsert new territories
  for (const t of [...danTerritories, ...michaelTerritories]) {
    await supabase.from('oracle_territories').upsert(t, { onConflict: 'name' });
  }

  // 5. Update existing briefs to belong to Kyle
  await supabase.from('oracle_daily_briefs').update({ user_id: kyle.id }).is('user_id', null);

  console.log('Setup complete!');
}

main().catch(console.error);
