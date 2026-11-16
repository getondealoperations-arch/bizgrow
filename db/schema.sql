-- MySQL 8 / MariaDB 10.5+ schema. Times are stored in UTC (the app sets the session time_zone).
-- JSON columns are LONGTEXT holding JSON, parsed in lib/db.ts (portable across MySQL and MariaDB).
-- scripts/migrate.mts splits this file on semicolons, so keep them out of comments and strings.

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'employee',
  active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (role IN ('admin','manager','employee'))
) DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS leads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  form_type VARCHAR(20) NOT NULL,
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  phone VARCHAR(50),
  whatsapp VARCHAR(50),
  email VARCHAR(255),
  industry VARCHAR(255),
  location VARCHAR(255),
  website VARCHAR(500),
  business_type VARCHAR(255),
  services LONGTEXT NOT NULL,
  business_stage VARCHAR(255),
  budget VARCHAR(255),
  message TEXT,
  contact_method VARCHAR(100),
  preferred_time VARCHAR(255),
  partnership_type VARCHAR(255),
  source VARCHAR(255) NOT NULL DEFAULT 'website',
  page VARCHAR(500),
  utm LONGTEXT NOT NULL,
  consent_at DATETIME NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'new',
  assigned_to INT NULL,
  follow_up_at DATE NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX leads_status_idx (status),
  INDEX leads_assigned_idx (assigned_to),
  INDEX leads_created_idx (created_at),
  CHECK (form_type IN ('enquiry','consultation','callback','partnership')),
  CHECK (status IN ('new','contacted','qualified','meeting','proposal','negotiation','won','lost')),
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
) DEFAULT CHARSET=utf8mb4;

-- lead history: notes, status changes, assignments, follow-up changes
CREATE TABLE IF NOT EXISTS lead_events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lead_id INT NOT NULL,
  user_id INT NULL,
  kind VARCHAR(20) NOT NULL,
  body TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX lead_events_lead_idx (lead_id, created_at),
  CHECK (kind IN ('created','note','status','assign','follow_up')),
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) DEFAULT CHARSET=utf8mb4;

-- One table for all CMS content. kind: post | testimonial | case_study | faq | banner | seo | setting
CREATE TABLE IF NOT EXISTS cms_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kind VARCHAR(50) NOT NULL,
  slug VARCHAR(191) NOT NULL,
  title VARCHAR(500) NOT NULL,
  body LONGTEXT NOT NULL,
  data LONGTEXT NOT NULL,
  published TINYINT(1) NOT NULL DEFAULT 0,
  publish_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY cms_kind_slug (kind, slug)
) DEFAULT CHARSET=utf8mb4;
