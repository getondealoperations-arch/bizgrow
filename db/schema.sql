CREATE TABLE IF NOT EXISTS users (
  id serial PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  role text NOT NULL DEFAULT 'employee' CHECK (role IN ('admin','manager','employee')),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS leads (
  id serial PRIMARY KEY,
  form_type text NOT NULL CHECK (form_type IN ('enquiry','consultation','callback','partnership')),
  name text NOT NULL,
  company text,
  phone text,
  whatsapp text,
  email text,
  industry text,
  location text,
  website text,
  business_type text,
  services text[] NOT NULL DEFAULT '{}',
  business_stage text,
  budget text,
  message text,
  contact_method text,
  preferred_time text,
  partnership_type text,
  source text NOT NULL DEFAULT 'website',
  page text,
  utm jsonb NOT NULL DEFAULT '{}',
  consent_at timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','qualified','meeting','proposal','negotiation','won','lost')),
  assigned_to int REFERENCES users(id) ON DELETE SET NULL,
  follow_up_at date,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS leads_status_idx ON leads(status);
CREATE INDEX IF NOT EXISTS leads_assigned_idx ON leads(assigned_to);
CREATE INDEX IF NOT EXISTS leads_created_idx ON leads(created_at DESC);

-- lead history: notes, status changes, assignments, follow-up changes
CREATE TABLE IF NOT EXISTS lead_events (
  id serial PRIMARY KEY,
  lead_id int NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  user_id int REFERENCES users(id) ON DELETE SET NULL,
  kind text NOT NULL CHECK (kind IN ('created','note','status','assign','follow_up')),
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS lead_events_lead_idx ON lead_events(lead_id, created_at);

-- One table for all CMS content. kind: post | testimonial | case_study | faq | banner | seo | setting
CREATE TABLE IF NOT EXISTS cms_items (
  id serial PRIMARY KEY,
  kind text NOT NULL,
  slug text NOT NULL,
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  data jsonb NOT NULL DEFAULT '{}',
  published boolean NOT NULL DEFAULT false,
  publish_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (kind, slug)
);
