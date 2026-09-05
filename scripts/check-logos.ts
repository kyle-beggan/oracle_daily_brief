import { supabase } from './supabase';

async function main() {
  const { data } = await supabase.from('oracle_territories').select('name, logo');
  console.log(data);
}
main();
