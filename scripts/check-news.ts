import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local'), override: true });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkNews() {
  const { data: users } = await supabase.from('oracle_users').select('id, name');
  const userMap = new Map((users || []).map(u => [u.id, u.name]));

  const { data: briefs, error } = await supabase
    .from('oracle_daily_briefs')
    .select('id, user_id, date, territories')
    .order('date', { ascending: false })
    .limit(10);
    
  if (error) {
    console.error('Error fetching briefs:', error);
    return;
  }

  console.log(`Found ${briefs.length} recent briefs:`);
  const seenUsers = new Set<string>();
  for (const b of briefs) {
    if (seenUsers.has(b.user_id)) continue;
    seenUsers.add(b.user_id);
    const userName = userMap.get(b.user_id) || b.user_id;

    console.log(`\n======================================================`);
    console.log(`User: ${userName} (Brief Date: ${b.date})`);
    console.log(`======================================================`);
    for (const t of b.territories || []) {
      const newsItems = t.news || [];
      console.log(`\n  Territory: ${t.name}`);
      console.log(`  News Count: ${newsItems.length}`);
      if (newsItems.length > 0) {
        for (const n of newsItems.slice(0, 3)) {
          const val = typeof n === 'object' && n.value ? n.value : n;
          console.log(`    - ${val}`);
        }
      } else {
        console.log(`    (No news articles attached)`);
      }
    }
  }
}

checkNews().catch(console.error);
