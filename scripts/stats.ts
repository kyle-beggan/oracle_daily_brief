import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local', override: true });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function check() {
  const { data: sources } = await supabase.from('oracle_sources').select('*');
  const { data: articles } = await supabase.from('oracle_articles').select('source_id');
  const { data: intel } = await supabase.from('oracle_intelligence').select('*');

  console.log("Sources:");
  for (const s of sources || []) {
    const count = articles?.filter(a => a.source_id === s.id).length || 0;
    console.log(`- ${s.name} (type: ${s.type}): ${count} articles ingested`);
  }
  
  console.log(`\nTotal Intelligence Items: ${intel?.length || 0}`);
}
check();
