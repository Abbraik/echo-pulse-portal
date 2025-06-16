
-- Create enums for various status types
CREATE TYPE public.approval_type AS ENUM ('strategy', 'bundle', 'redesign', 'externalDirective');
CREATE TYPE public.approval_status AS ENUM ('pending', 'approved', 'rejected', 'revisionRequested');
CREATE TYPE public.zone_name AS ENUM ('THINK', 'ACT', 'LEARN', 'INNOVATE', 'MONITOR');
CREATE TYPE public.claim_status AS ENUM ('open', 'assigned', 'closed');
CREATE TYPE public.bundle_status AS ENUM ('draft', 'active', 'pilot', 'completed');
CREATE TYPE public.severity_level AS ENUM ('low', 'medium', 'high');

-- Approvals table
CREATE TABLE public.approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type approval_type NOT NULL,
  title TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  assigned_to UUID[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  due_at TIMESTAMP WITH TIME ZONE,
  status approval_status NOT NULL DEFAULT 'pending',
  context_snapshot JSONB DEFAULT '{}',
  revision_notes TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Health metrics table
CREATE TABLE public.health_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  zone zone_name NOT NULL,
  value NUMERIC NOT NULL,
  target NUMERIC,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Claims table for workflow coordination
CREATE TABLE public.claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone zone_name NOT NULL,
  task_id UUID NOT NULL,
  status claim_status NOT NULL DEFAULT 'open',
  claimed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  opened_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  closed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bundles table (ACT zone)
CREATE TABLE public.bundles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  summary TEXT,
  status bundle_status NOT NULL DEFAULT 'draft',
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  leverage_points JSONB DEFAULT '[]',
  tags TEXT[] DEFAULT '{}',
  objectives TEXT[] DEFAULT '{}',
  pillars TEXT[] DEFAULT '{}',
  geography TEXT[] DEFAULT '{}',
  coherence INTEGER DEFAULT 50,
  ndi_impact NUMERIC DEFAULT 0,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- KPIs table
CREATE TABLE public.kpis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_id UUID REFERENCES public.bundles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  current_value NUMERIC NOT NULL DEFAULT 0,
  target_value NUMERIC NOT NULL,
  unit TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scenarios table (THINK zone)
CREATE TABLE public.scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  parameters JSONB DEFAULT '{}',
  results JSONB DEFAULT '{}',
  is_baseline BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CLD Nodes table (THINK zone)
CREATE TABLE public.cld_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id UUID REFERENCES public.scenarios(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  position_x NUMERIC NOT NULL DEFAULT 0,
  position_y NUMERIC NOT NULL DEFAULT 0,
  node_type TEXT DEFAULT 'variable',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CLD Edges table (THINK zone)
CREATE TABLE public.cld_edges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id UUID REFERENCES public.scenarios(id) ON DELETE CASCADE,
  source_id UUID REFERENCES public.cld_nodes(id) ON DELETE CASCADE,
  target_id UUID REFERENCES public.cld_nodes(id) ON DELETE CASCADE,
  polarity INTEGER NOT NULL CHECK (polarity IN (-1, 1)),
  strength NUMERIC DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Anomalies table (MONITOR zone)
CREATE TABLE public.anomalies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_id UUID REFERENCES public.health_metrics(id) ON DELETE CASCADE,
  severity severity_level NOT NULL DEFAULT 'medium',
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  details TEXT,
  acknowledged BOOLEAN DEFAULT FALSE,
  acknowledged_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Lessons table (LEARN zone)
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source_bundle_id UUID REFERENCES public.bundles(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  archived_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- File attachments table
CREATE TABLE public.file_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_key TEXT NOT NULL UNIQUE,
  original_name TEXT NOT NULL,
  file_size INTEGER,
  content_type TEXT,
  url TEXT,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  entity_type TEXT, -- 'bundle', 'scenario', 'lesson', etc.
  entity_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_approvals_assigned_to ON public.approvals USING GIN(assigned_to);
CREATE INDEX idx_approvals_status ON public.approvals(status);
CREATE INDEX idx_health_metrics_zone ON public.health_metrics(zone);
CREATE INDEX idx_health_metrics_timestamp ON public.health_metrics(timestamp DESC);
CREATE INDEX idx_claims_zone_status ON public.claims(zone, status);
CREATE INDEX idx_bundles_status ON public.bundles(status);
CREATE INDEX idx_bundles_created_by ON public.bundles(created_by);
CREATE INDEX idx_kpis_bundle_id ON public.kpis(bundle_id);
CREATE INDEX idx_scenarios_created_by ON public.scenarios(created_by);
CREATE INDEX idx_cld_nodes_scenario ON public.cld_nodes(scenario_id);
CREATE INDEX idx_cld_edges_scenario ON public.cld_edges(scenario_id);
CREATE INDEX idx_anomalies_severity ON public.anomalies(severity);
CREATE INDEX idx_lessons_tags ON public.lessons USING GIN(tags);

-- Enable RLS on all tables
ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cld_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cld_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anomalies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_attachments ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Director General can access everything
CREATE POLICY "Director General can view all approvals" ON public.approvals
  FOR SELECT USING (public.has_role('director_general'));

CREATE POLICY "Director General can manage all approvals" ON public.approvals
  FOR ALL USING (public.has_role('director_general'));

CREATE POLICY "Director General can view all health metrics" ON public.health_metrics
  FOR SELECT USING (public.has_role('director_general'));

CREATE POLICY "Director General can manage all health metrics" ON public.health_metrics
  FOR ALL USING (public.has_role('director_general'));

CREATE POLICY "Director General can view all claims" ON public.claims
  FOR SELECT USING (public.has_role('director_general'));

CREATE POLICY "Director General can manage all claims" ON public.claims
  FOR ALL USING (public.has_role('director_general'));

CREATE POLICY "Director General can view all bundles" ON public.bundles
  FOR SELECT USING (public.has_role('director_general'));

CREATE POLICY "Director General can manage all bundles" ON public.bundles
  FOR ALL USING (public.has_role('director_general'));

CREATE POLICY "Director General can view all kpis" ON public.kpis
  FOR SELECT USING (public.has_role('director_general'));

CREATE POLICY "Director General can manage all kpis" ON public.kpis
  FOR ALL USING (public.has_role('director_general'));

CREATE POLICY "Director General can view all scenarios" ON public.scenarios
  FOR SELECT USING (public.has_role('director_general'));

CREATE POLICY "Director General can manage all scenarios" ON public.scenarios
  FOR ALL USING (public.has_role('director_general'));

CREATE POLICY "Director General can view all cld nodes" ON public.cld_nodes
  FOR SELECT USING (public.has_role('director_general'));

CREATE POLICY "Director General can manage all cld nodes" ON public.cld_nodes
  FOR ALL USING (public.has_role('director_general'));

CREATE POLICY "Director General can view all cld edges" ON public.cld_edges
  FOR SELECT USING (public.has_role('director_general'));

CREATE POLICY "Director General can manage all cld edges" ON public.cld_edges
  FOR ALL USING (public.has_role('director_general'));

CREATE POLICY "Director General can view all anomalies" ON public.anomalies
  FOR SELECT USING (public.has_role('director_general'));

CREATE POLICY "Director General can manage all anomalies" ON public.anomalies
  FOR ALL USING (public.has_role('director_general'));

CREATE POLICY "Director General can view all lessons" ON public.lessons
  FOR SELECT USING (public.has_role('director_general'));

CREATE POLICY "Director General can manage all lessons" ON public.lessons
  FOR ALL USING (public.has_role('director_general'));

CREATE POLICY "Director General can view all file attachments" ON public.file_attachments
  FOR SELECT USING (public.has_role('director_general'));

CREATE POLICY "Director General can manage all file attachments" ON public.file_attachments
  FOR ALL USING (public.has_role('director_general'));

-- Functions for data manipulation
CREATE OR REPLACE FUNCTION public.update_bundle_coherence()
RETURNS TRIGGER AS $$
BEGIN
  -- Simple coherence calculation based on number of objectives and pillars
  NEW.coherence = LEAST(100, GREATEST(0, 
    (array_length(NEW.objectives, 1) * 10) + 
    (array_length(NEW.pillars, 1) * 15) +
    (array_length(NEW.tags, 1) * 5)
  ));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_bundle_coherence_trigger
  BEFORE INSERT OR UPDATE ON public.bundles
  FOR EACH ROW EXECUTE FUNCTION public.update_bundle_coherence();

-- Function to automatically create claims for new bundles
CREATE OR REPLACE FUNCTION public.create_bundle_claim()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.claims (zone, task_id, status, metadata)
  VALUES ('ACT', NEW.id, 'open', jsonb_build_object('bundle_name', NEW.name, 'type', 'bundle_review'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_bundle_claim_trigger
  AFTER INSERT ON public.bundles
  FOR EACH ROW EXECUTE FUNCTION public.create_bundle_claim();
