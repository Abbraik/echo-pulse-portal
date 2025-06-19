
-- ============================================================================
-- PDS PORTAL DATABASE SCHEMA IMPLEMENTATION (FIXED SEED DATA)
-- Schema Design & Modularity (Best Practice #1)
-- ============================================================================

-- 1. CREATE SEPARATE POSTGRES SCHEMAS
-- ============================================================================

-- Drop existing schemas if they exist (for clean setup)
DROP SCHEMA IF EXISTS core CASCADE;
DROP SCHEMA IF EXISTS think CASCADE;
DROP SCHEMA IF EXISTS act CASCADE;
DROP SCHEMA IF EXISTS monitor CASCADE;
DROP SCHEMA IF EXISTS learn CASCADE;
DROP SCHEMA IF EXISTS innovate CASCADE;

-- Create modular schemas
CREATE SCHEMA core;       -- Shared tables (users, profiles, scenarios, runs, approvals)
CREATE SCHEMA think;      -- CLD nodes/edges, simulations, foresight settings
CREATE SCHEMA act;        -- Bundles, KPIs, strategy tasks
CREATE SCHEMA monitor;    -- Health metrics, claims, alerts
CREATE SCHEMA learn;      -- Lessons, insights, audit logs
CREATE SCHEMA innovate;   -- Experiments, prototypes, blueprints

-- ============================================================================
-- 2. CORE MODELS (in `core` schema)
-- ============================================================================

-- Core Users (extends Supabase auth.users)
CREATE TABLE core.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- User Profiles
CREATE TABLE core.profiles (
  id uuid PRIMARY KEY REFERENCES core.users(id) ON DELETE CASCADE,
  full_name text,
  role text NOT NULL CHECK (role IN ('admin','director_general','zone_lead','analyst')),
  language text DEFAULT 'en' CHECK (language IN ('en', 'ar')),
  theme text DEFAULT 'dark' CHECK (theme IN ('light', 'dark')),
  avatar_url text,
  department text,
  zone text,
  preferences jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Scenarios
CREATE TABLE core.scenarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_by uuid REFERENCES core.users(id) ON DELETE SET NULL,
  parameters jsonb NOT NULL DEFAULT '{}',
  results jsonb DEFAULT '{}',
  version integer DEFAULT 1,
  is_baseline boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Simulation Runs
CREATE TABLE core.runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id uuid REFERENCES core.scenarios(id) ON DELETE CASCADE,
  name text,
  status text NOT NULL CHECK (status IN ('queued','running','completed','failed')) DEFAULT 'queued',
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  started_at timestamptz,
  completed_at timestamptz,
  error_message text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Approvals System
CREATE TABLE core.approvals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('strategy','bundle','redesign','external_directive')),
  title text NOT NULL,
  description text,
  created_by uuid REFERENCES core.users(id) ON DELETE SET NULL,
  assigned_to uuid[] NOT NULL DEFAULT '{}',
  status text NOT NULL CHECK (status IN ('pending','approved','rejected','revision_requested')) DEFAULT 'pending',
  context_snapshot jsonb DEFAULT '{}',
  revision_notes text,
  priority text DEFAULT 'medium' CHECK (priority IN ('low','medium','high','urgent')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  due_at timestamptz
);

-- ============================================================================
-- 3. THINK SCHEMA - Cognitive modeling and foresight
-- ============================================================================

-- Causal Loop Diagram Nodes
CREATE TABLE think.cld_nodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id uuid REFERENCES core.scenarios(id) ON DELETE CASCADE,
  label text NOT NULL,
  node_type text DEFAULT 'variable' CHECK (node_type IN ('variable','stock','flow','cloud','connector')),
  position jsonb NOT NULL DEFAULT '{"x": 0, "y": 0}',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Causal Loop Diagram Edges
CREATE TABLE think.cld_edges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id uuid REFERENCES core.scenarios(id) ON DELETE CASCADE,
  source_node uuid REFERENCES think.cld_nodes(id) ON DELETE CASCADE,
  target_node uuid REFERENCES think.cld_nodes(id) ON DELETE CASCADE,
  polarity integer NOT NULL CHECK (polarity IN (1, -1)),
  strength numeric DEFAULT 1.0 CHECK (strength >= 0 AND strength <= 1),
  delay integer DEFAULT 0,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  UNIQUE(source_node, target_node)
);

-- Simulation Configurations
CREATE TABLE think.simulation_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id uuid REFERENCES core.scenarios(id) ON DELETE CASCADE,
  name text NOT NULL,
  time_horizon integer DEFAULT 120,
  time_step numeric DEFAULT 0.25,
  integration_method text DEFAULT 'euler' CHECK (integration_method IN ('euler','rk4')),
  parameters jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Foresight Analysis Settings
CREATE TABLE think.foresight_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES core.users(id) ON DELETE CASCADE,
  scenario_id uuid REFERENCES core.scenarios(id) ON DELETE CASCADE,
  analysis_type text NOT NULL CHECK (analysis_type IN ('sensitivity','monte_carlo','scenario_comparison')),
  settings jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- ============================================================================
-- 4. ACT SCHEMA - Strategy execution and bundles
-- ============================================================================

-- Strategy Bundles
CREATE TABLE act.bundles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  summary text,
  created_by uuid REFERENCES core.users(id) ON DELETE SET NULL,
  leverage_points jsonb DEFAULT '[]',
  objectives text[] DEFAULT '{}',
  pillars text[] DEFAULT '{}',
  geography text[] DEFAULT '{}',
  tags text[] DEFAULT '{}',
  status text NOT NULL CHECK (status IN ('draft','active','pilot','completed')) DEFAULT 'draft',
  coherence integer DEFAULT 50 CHECK (coherence >= 0 AND coherence <= 100),
  ndi_impact numeric DEFAULT 0,
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Key Performance Indicators
CREATE TABLE act.kpis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_id uuid REFERENCES act.bundles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  current_value numeric NOT NULL DEFAULT 0,
  target_value numeric NOT NULL,
  unit text,
  measurement_frequency text DEFAULT 'monthly' CHECK (measurement_frequency IN ('daily','weekly','monthly','quarterly')),
  data_source text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Strategy Tasks
CREATE TABLE act.strategy_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_id uuid REFERENCES act.bundles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  assigned_to uuid REFERENCES core.users(id) ON DELETE SET NULL,
  status text NOT NULL CHECK (status IN ('todo','in_progress','review','completed')) DEFAULT 'todo',
  priority text DEFAULT 'medium' CHECK (priority IN ('low','medium','high')),
  due_date timestamptz,
  dependencies uuid[],
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- 5. MONITOR SCHEMA - System health and performance tracking
-- ============================================================================

-- Health Metrics
CREATE TABLE monitor.health_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid REFERENCES core.runs(id) ON DELETE SET NULL,
  zone text NOT NULL CHECK (zone IN ('THINK','ACT','LEARN','INNOVATE','MONITOR')),
  indicator text NOT NULL,
  name text NOT NULL,
  value numeric NOT NULL,
  target numeric,
  unit text,
  measurement_type text DEFAULT 'point' CHECK (measurement_type IN ('point','cumulative','average')),
  timestamp timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Claims System
CREATE TABLE monitor.claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  zone text NOT NULL CHECK (zone IN ('THINK','ACT','LEARN','INNOVATE','MONITOR')),
  task_id uuid NOT NULL,
  task_type text,
  status text NOT NULL CHECK (status IN ('open','assigned','closed')) DEFAULT 'open',
  claimed_by uuid REFERENCES core.users(id) ON DELETE SET NULL,
  opened_at timestamptz DEFAULT now(),
  closed_at timestamptz,
  resolution_notes text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Anomaly Detection
CREATE TABLE monitor.anomalies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_id uuid REFERENCES monitor.health_metrics(id) ON DELETE SET NULL,
  severity text NOT NULL CHECK (severity IN ('low','medium','high')) DEFAULT 'medium',
  detected_at timestamptz DEFAULT now(),
  details text,
  threshold_value numeric,
  actual_value numeric,
  acknowledged boolean DEFAULT false,
  acknowledged_by uuid REFERENCES core.users(id) ON DELETE SET NULL,
  acknowledged_at timestamptz,
  resolved boolean DEFAULT false,
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- ============================================================================
-- 6. LEARN SCHEMA - Knowledge management and insights
-- ============================================================================

-- Lessons Learned
CREATE TABLE learn.lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  source_bundle_id uuid REFERENCES act.bundles(id) ON DELETE SET NULL,
  source_type text DEFAULT 'bundle' CHECK (source_type IN ('bundle','experiment','analysis','external')),
  tags text[] DEFAULT '{}',
  category text,
  confidence_level integer DEFAULT 5 CHECK (confidence_level >= 1 AND confidence_level <= 10),
  impact_score integer DEFAULT 5 CHECK (impact_score >= 1 AND impact_score <= 10),
  created_by uuid REFERENCES core.users(id) ON DELETE SET NULL,
  archived_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Knowledge Insights
CREATE TABLE learn.insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  insight_type text NOT NULL CHECK (insight_type IN ('pattern','correlation','trend','anomaly','prediction')),
  data_sources text[],
  confidence numeric DEFAULT 0.5 CHECK (confidence >= 0 AND confidence <= 1),
  relevance_score integer DEFAULT 5 CHECK (relevance_score >= 1 AND relevance_score <= 10),
  metadata jsonb DEFAULT '{}',
  created_by uuid REFERENCES core.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Audit Logs
CREATE TABLE learn.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES core.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- ============================================================================
-- 7. INNOVATE SCHEMA - Experimentation and prototyping
-- ============================================================================

-- Experiments
CREATE TABLE innovate.experiments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  hypothesis text,
  created_by uuid REFERENCES core.users(id) ON DELETE SET NULL,
  experiment_type text DEFAULT 'prototype' CHECK (experiment_type IN ('prototype','simulation','pilot','analysis')),
  parameters jsonb DEFAULT '{}',
  status text NOT NULL CHECK (status IN ('design','running','analysis','completed','cancelled')) DEFAULT 'design',
  start_date timestamptz,
  end_date timestamptz,
  results jsonb DEFAULT '{}',
  conclusions text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Prototypes
CREATE TABLE innovate.prototypes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id uuid REFERENCES innovate.experiments(id) ON DELETE CASCADE,
  name text NOT NULL,
  version text DEFAULT '1.0',
  configuration jsonb DEFAULT '{}',
  performance_metrics jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Innovation Blueprints
CREATE TABLE innovate.blueprints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text,
  design_patterns jsonb DEFAULT '{}',
  implementation_notes text,
  created_by uuid REFERENCES core.users(id) ON DELETE SET NULL,
  status text DEFAULT 'draft' CHECK (status IN ('draft','review','approved','archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- 8. VERSIONING & AUDIT TABLES
-- ============================================================================

-- Scenario Versions
CREATE TABLE core.scenarios_versions (
  version_id bigserial PRIMARY KEY,
  scenario_id uuid NOT NULL,
  version_number integer NOT NULL,
  updated_by uuid REFERENCES core.users(id) ON DELETE SET NULL,
  updated_at timestamptz DEFAULT now(),
  changes_description text,
  old_data jsonb NOT NULL
);

-- Bundle Versions
CREATE TABLE act.bundles_versions (
  version_id bigserial PRIMARY KEY,
  bundle_id uuid NOT NULL,
  version_number integer NOT NULL,
  updated_by uuid REFERENCES core.users(id) ON DELETE SET NULL,
  updated_at timestamptz DEFAULT now(),
  changes_description text,
  old_data jsonb NOT NULL
);

-- ============================================================================
-- 9. JSONB INDEXES FOR PERFORMANCE
-- ============================================================================

-- Core schema indexes
CREATE INDEX idx_scenarios_parameters ON core.scenarios USING gin (parameters);
CREATE INDEX idx_scenarios_results ON core.scenarios USING gin (results);
CREATE INDEX idx_approvals_context ON core.approvals USING gin (context_snapshot);

-- Think schema indexes
CREATE INDEX idx_cld_nodes_metadata ON think.cld_nodes USING gin (metadata);
CREATE INDEX idx_cld_nodes_position ON think.cld_nodes USING gin (position);
CREATE INDEX idx_simulation_configs_params ON think.simulation_configs USING gin (parameters);

-- Act schema indexes
CREATE INDEX idx_bundles_leverage_points ON act.bundles USING gin (leverage_points);
CREATE INDEX idx_strategy_tasks_metadata ON act.strategy_tasks USING gin (metadata);

-- Monitor schema indexes
CREATE INDEX idx_health_metrics_metadata ON monitor.health_metrics USING gin (metadata);
CREATE INDEX idx_claims_metadata ON monitor.claims USING gin (metadata);

-- Learn schema indexes
CREATE INDEX idx_insights_metadata ON learn.insights USING gin (metadata);
CREATE INDEX idx_audit_logs_old_values ON learn.audit_logs USING gin (old_values);
CREATE INDEX idx_audit_logs_new_values ON learn.audit_logs USING gin (new_values);

-- Innovate schema indexes
CREATE INDEX idx_experiments_parameters ON innovate.experiments USING gin (parameters);
CREATE INDEX idx_experiments_results ON innovate.experiments USING gin (results);
CREATE INDEX idx_blueprints_design_patterns ON innovate.blueprints USING gin (design_patterns);

-- ============================================================================
-- 10. ADDITIONAL PERFORMANCE INDEXES
-- ============================================================================

-- Frequently queried columns
CREATE INDEX idx_profiles_role ON core.profiles(role);
CREATE INDEX idx_profiles_zone ON core.profiles(zone);
CREATE INDEX idx_scenarios_created_by ON core.scenarios(created_by);
CREATE INDEX idx_runs_scenario_id ON core.runs(scenario_id);
CREATE INDEX idx_runs_status ON core.runs(status);
CREATE INDEX idx_bundles_status ON act.bundles(status);
CREATE INDEX idx_bundles_created_by ON act.bundles(created_by);
CREATE INDEX idx_health_metrics_zone ON monitor.health_metrics(zone);
CREATE INDEX idx_health_metrics_timestamp ON monitor.health_metrics(timestamp);
CREATE INDEX idx_claims_zone_status ON monitor.claims(zone, status);
CREATE INDEX idx_lessons_tags ON learn.lessons USING gin (tags);
CREATE INDEX idx_audit_logs_user_action ON learn.audit_logs(user_id, action);

-- ============================================================================
-- 11. MATERIALIZED VIEWS FOR DASHBOARD PERFORMANCE
-- ============================================================================

-- DEI Summary View
CREATE MATERIALIZED VIEW monitor.dei_summary AS
SELECT 
  run_id,
  zone,
  avg(value) as avg_score,
  max(value) as max_score,
  min(value) as min_score,
  count(*) as metric_count,
  max(timestamp) as last_updated
FROM monitor.health_metrics 
WHERE indicator LIKE '%DEI%' OR indicator LIKE '%Development%'
GROUP BY run_id, zone;

CREATE INDEX idx_dei_summary_run_zone ON monitor.dei_summary(run_id, zone);

-- Bundle Performance Summary
CREATE MATERIALIZED VIEW act.bundle_performance AS
SELECT 
  b.id as bundle_id,
  b.name,
  b.status,
  count(k.id) as kpi_count,
  avg(k.current_value / NULLIF(k.target_value, 0) * 100) as avg_performance_pct,
  count(t.id) as task_count,
  count(CASE WHEN t.status = 'completed' THEN 1 END) as completed_tasks
FROM act.bundles b
LEFT JOIN act.kpis k ON b.id = k.bundle_id
LEFT JOIN act.strategy_tasks t ON b.id = t.bundle_id
GROUP BY b.id, b.name, b.status;

-- Zone Activity Summary
CREATE MATERIALIZED VIEW monitor.zone_activity AS
SELECT 
  zone,
  count(*) as total_metrics,
  avg(value) as avg_value,
  max(timestamp) as last_activity,
  count(CASE WHEN timestamp > now() - interval '24 hours' THEN 1 END) as recent_activity
FROM monitor.health_metrics
GROUP BY zone;

-- ============================================================================
-- 12. UPDATED_AT TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON core.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_scenarios_updated_at BEFORE UPDATE ON core.scenarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_approvals_updated_at BEFORE UPDATE ON core.approvals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cld_nodes_updated_at BEFORE UPDATE ON think.cld_nodes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bundles_updated_at BEFORE UPDATE ON act.bundles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_kpis_updated_at BEFORE UPDATE ON act.kpis FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_strategy_tasks_updated_at BEFORE UPDATE ON act.strategy_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON learn.lessons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_experiments_updated_at BEFORE UPDATE ON innovate.experiments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blueprints_updated_at BEFORE UPDATE ON innovate.blueprints FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 13. HELPER FUNCTIONS FOR RLS POLICIES
-- ============================================================================

-- Security definer function to get current user role
CREATE OR REPLACE FUNCTION core.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM core.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Security definer function to check if user has specific role
CREATE OR REPLACE FUNCTION core.has_role(_role TEXT)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM core.profiles 
    WHERE id = auth.uid() AND role = _role
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- ============================================================================
-- 14. ROW LEVEL SECURITY (RLS) SETUP
-- ============================================================================

-- Enable RLS on all user-facing tables
ALTER TABLE core.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE think.cld_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE think.cld_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE think.simulation_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE think.foresight_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE act.bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE act.kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE act.strategy_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitor.health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitor.claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitor.anomalies ENABLE ROW LEVEL SECURITY;
ALTER TABLE learn.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE learn.insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE learn.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE innovate.experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE innovate.prototypes ENABLE ROW LEVEL SECURITY;
ALTER TABLE innovate.blueprints ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (users can see their own data)
-- Core policies
CREATE POLICY "Users can view own profile" ON core.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON core.profiles FOR UPDATE USING (auth.uid() = id);

-- Scenarios - creators and collaborators can access (FIXED: using helper function)
CREATE POLICY "Users can view scenarios" ON core.scenarios FOR SELECT USING (
  auth.uid() = created_by OR 
  core.has_role('admin') OR 
  core.has_role('director_general')
);

CREATE POLICY "Users can create scenarios" ON core.scenarios FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Runs - users can see runs for scenarios they can access
CREATE POLICY "Users can view runs" ON core.runs FOR SELECT USING (
  scenario_id IN (
    SELECT id FROM core.scenarios WHERE 
    created_by = auth.uid() OR 
    core.has_role('admin') OR 
    core.has_role('director_general')
  )
);

-- Health metrics - all authenticated users can view for dashboard
CREATE POLICY "Users can view health metrics" ON monitor.health_metrics FOR SELECT TO authenticated USING (true);

-- Claims - users can see claims in their zone or if they're admin/director
CREATE POLICY "Users can view claims" ON monitor.claims FOR SELECT USING (
  core.has_role('admin') OR 
  core.has_role('director_general')
);

-- Basic policies for other tables (can be expanded based on business rules)
CREATE POLICY "Users can view bundles" ON act.bundles FOR SELECT USING (
  auth.uid() = created_by OR 
  core.has_role('admin') OR 
  core.has_role('director_general')
);

CREATE POLICY "Users can view lessons" ON learn.lessons FOR SELECT USING (
  auth.uid() = created_by OR 
  core.has_role('admin') OR 
  core.has_role('director_general')
);

-- ============================================================================
-- 15. SEED DATA FOR INITIAL SETUP (REMOVED - WILL BE POPULATED BY REAL USERS)
-- ============================================================================

-- Initial health metrics for testing (using NULL for created_by since no users exist yet)
INSERT INTO monitor.health_metrics (zone, indicator, name, value, target, unit)
VALUES 
  ('THINK', 'DEI_OVERALL', 'Development Equilibrium Index', 74, 80, 'index'),
  ('ACT', 'BUNDLE_COMPLETION', 'Bundle Completion Rate', 68, 85, 'percentage'),
  ('MONITOR', 'SYSTEM_HEALTH', 'System Health Score', 92, 95, 'percentage'),
  ('LEARN', 'KNOWLEDGE_CAPTURE', 'Knowledge Capture Rate', 76, 80, 'percentage'),
  ('INNOVATE', 'EXPERIMENT_SUCCESS', 'Experiment Success Rate', 45, 60, 'percentage');

-- ============================================================================
-- SCHEMA IMPLEMENTATION COMPLETE (FIXED - NO USER DEPENDENCIES)
-- ============================================================================
