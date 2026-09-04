-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- oracle_users
CREATE TABLE oracle_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    home_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- oracle_sources
CREATE TABLE oracle_sources (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    tier INTEGER NOT NULL,
    type TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- oracle_articles
CREATE TABLE oracle_articles (
    id TEXT PRIMARY KEY,
    source_id TEXT REFERENCES oracle_sources(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    ingested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- oracle_territories
CREATE TABLE oracle_territories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES oracle_users(id) ON DELETE CASCADE,
    name TEXT NOT NULL UNIQUE,
    logo TEXT NOT NULL,
    mission TEXT,
    html TEXT,
    tech_priorities JSONB,
    prime_contractors JSONB,
    leadership JSONB,
    locations JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- oracle_intelligence
CREATE TABLE oracle_intelligence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id TEXT REFERENCES oracle_articles(id) ON DELETE CASCADE,
    territory_id UUID REFERENCES oracle_territories(id) ON DELETE CASCADE,
    relevance_score INTEGER NOT NULL,
    category JSONB,
    summary TEXT,
    stakeholders JSONB,
    commercial_signal TEXT,
    recommendations JSONB,
    analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- oracle_daily_briefs
CREATE TABLE oracle_daily_briefs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES oracle_users(id) ON DELETE CASCADE,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    weather TEXT,
    commute TEXT,
    podcast_script TEXT,
    territories JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set Row Level Security (RLS) policies
ALTER TABLE oracle_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON oracle_users FOR SELECT USING (true);
ALTER TABLE oracle_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON oracle_sources FOR SELECT USING (true);

ALTER TABLE oracle_articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON oracle_articles FOR SELECT USING (true);

ALTER TABLE oracle_territories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON oracle_territories FOR SELECT USING (true);

ALTER TABLE oracle_intelligence ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON oracle_intelligence FOR SELECT USING (true);

ALTER TABLE oracle_daily_briefs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON oracle_daily_briefs FOR SELECT USING (true);
