-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS oracle_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Add foreign keys to existing tables
ALTER TABLE oracle_territories 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES oracle_users(id) ON DELETE CASCADE;

-- Note: we'll drop the unique constraint on name if we want multiple users to track the same territory name, 
-- but since each is assigned to a specific user, we'll keep name unique or unique per user. 
-- For now, unique per name is fine since no territories overlap here.

ALTER TABLE oracle_daily_briefs 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES oracle_users(id) ON DELETE CASCADE;

-- 3. Enable RLS on users table
ALTER TABLE oracle_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON oracle_users FOR SELECT USING (true);
