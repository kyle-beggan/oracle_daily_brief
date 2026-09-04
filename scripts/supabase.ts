import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local'), override: true });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';

if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseServiceKey === 'placeholder') {
  console.warn('Supabase URL or Service Role Key is missing. Check .env.local or CI environment.');
}

// Service role client for backend scripts
export const supabase = createClient(supabaseUrl, supabaseServiceKey);
