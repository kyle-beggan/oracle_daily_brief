import fs from 'fs';
import path from 'path';
import { supabase } from './supabase';

const logosToDownload = [
  { name: 'Transportation Security Administration (TSA)', url: 'https://en.wikipedia.org/wiki/Special:FilePath/Transportation_Security_Administration_seal.svg', file: 'tsa.svg' },
  { name: 'U.S. Coast Guard (USCG)', url: 'https://en.wikipedia.org/wiki/Special:FilePath/Seal_of_the_United_States_Coast_Guard.svg', file: 'uscg.svg' },
  { name: 'U.S. Citizenship and Immigration Services (USCIS)', url: 'https://en.wikipedia.org/wiki/Special:FilePath/USCIS_logo_English.svg', file: 'uscis.svg' },
  { name: 'U.S. Customs and Border Protection (CBP)', url: 'https://en.wikipedia.org/wiki/Special:FilePath/Seal_of_U.S._Customs_and_Border_Protection.png', file: 'cbp.png' },
  { name: 'U.S. Immigration and Customs Enforcement (ICE)', url: 'https://en.wikipedia.org/wiki/Special:FilePath/Seal_of_the_United_States_Immigration_and_Customs_Enforcement.svg', file: 'ice.svg' },
  { name: 'Cybersecurity and Infrastructure Security Agency (CISA)', url: 'https://en.wikipedia.org/wiki/Special:FilePath/Seal_of_Cybersecurity_and_Infrastructure_Security_Agency.svg', file: 'cisa.svg' }
];

async function main() {
  const logosDir = path.join(process.cwd(), 'public', 'logos');
  if (!fs.existsSync(logosDir)) {
    fs.mkdirSync(logosDir, { recursive: true });
  }

  for (const item of logosToDownload) {
    console.log(`Downloading ${item.file}...`);
    try {
      const response = await fetch(item.url, {
        headers: {
          'User-Agent': 'OracleDailyBrief/1.0 (kylebeggan@oracle.com)'
        }
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const filePath = path.join(logosDir, item.file);
      fs.writeFileSync(filePath, buffer);
      
      console.log(`Updating database for ${item.name}...`);
      const localPath = `/logos/${item.file}`;
      const { error } = await supabase
        .from('oracle_territories')
        .update({ logo: localPath })
        .eq('name', item.name);
        
      if (error) console.error(`Error updating ${item.name}:`, error);
    } catch (e) {
      console.error(`Failed to process ${item.file}:`, e);
    }
  }
  
  console.log('Logos downloaded and database updated!');
}

main().catch(console.error);
