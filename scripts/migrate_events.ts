
async function migrate() {
  const sql = `
    CREATE TABLE IF NOT EXISTS oracle_networking_events (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      event_type TEXT,
      event_date TIMESTAMP WITH TIME ZONE,
      start_time TEXT,
      end_time TEXT,
      venue TEXT,
      city TEXT,
      state TEXT,
      format TEXT, -- Virtual, Hybrid, In-Person
      organizer TEXT,
      event_url TEXT,
      registration_url TEXT,
      cost TEXT,
      registration_deadline TIMESTAMP WITH TIME ZONE,
      description TEXT,
      topics JSONB,
      speakers JSONB,
      dhs_participants JSONB,
      sponsors JSONB,
      exhibitors JSONB,
      source TEXT,
      date_discovered TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      last_verified_date TIMESTAMP WITH TIME ZONE,
      networking_score INTEGER,
      opportunity_tier TEXT, -- Tier 1, Tier 2, Tier 3, Watchlist
      score_explanation TEXT,
      why_it_matters TEXT,
      recommended_people JSONB,
      source_evidence JSONB,
      last_changed_at TIMESTAMP WITH TIME ZONE,
      is_past BOOLEAN DEFAULT FALSE
    );
  `;

  console.log("Migration SQL:\n", sql);
  console.log("Please run this SQL in your Supabase SQL editor to create the table.");
}

migrate().catch(console.error);
