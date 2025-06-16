
-- Phase 1: Fix RLS policies - First drop existing policies, then recreate them

-- Drop existing policies if they exist (using IF EXISTS to avoid errors)
DROP POLICY IF EXISTS "Director General can view all bundles" ON public.bundles;
DROP POLICY IF EXISTS "Director General can manage all bundles" ON public.bundles;
DROP POLICY IF EXISTS "Director General can view all health metrics" ON public.health_metrics;
DROP POLICY IF EXISTS "Director General can manage all health metrics" ON public.health_metrics;
DROP POLICY IF EXISTS "Director General can view all approvals" ON public.approvals;
DROP POLICY IF EXISTS "Director General can manage all approvals" ON public.approvals;
DROP POLICY IF EXISTS "Director General can view all claims" ON public.claims;
DROP POLICY IF EXISTS "Director General can manage all claims" ON public.claims;
DROP POLICY IF EXISTS "Director General can view all kpis" ON public.kpis;
DROP POLICY IF EXISTS "Director General can manage all kpis" ON public.kpis;
DROP POLICY IF EXISTS "Director General can view all scenarios" ON public.scenarios;
DROP POLICY IF EXISTS "Director General can manage all scenarios" ON public.scenarios;
DROP POLICY IF EXISTS "Director General can view all cld nodes" ON public.cld_nodes;
DROP POLICY IF EXISTS "Director General can manage all cld nodes" ON public.cld_nodes;
DROP POLICY IF EXISTS "Director General can view all cld edges" ON public.cld_edges;
DROP POLICY IF EXISTS "Director General can manage all cld edges" ON public.cld_edges;
DROP POLICY IF EXISTS "Director General can view all anomalies" ON public.anomalies;
DROP POLICY IF EXISTS "Director General can manage all anomalies" ON public.anomalies;
DROP POLICY IF EXISTS "Director General can view all lessons" ON public.lessons;
DROP POLICY IF EXISTS "Director General can manage all lessons" ON public.lessons;
DROP POLICY IF EXISTS "Director General can view all file attachments" ON public.file_attachments;
DROP POLICY IF EXISTS "Director General can manage all file attachments" ON public.file_attachments;

-- Now create comprehensive policies for all tables
-- 1. Bundles table policies
CREATE POLICY "Director General can view all bundles" ON public.bundles
  FOR SELECT USING (public.has_role('director_general'));

CREATE POLICY "Director General can insert bundles" ON public.bundles
  FOR INSERT WITH CHECK (public.has_role('director_general'));

CREATE POLICY "Director General can update bundles" ON public.bundles
  FOR UPDATE USING (public.has_role('director_general'));

CREATE POLICY "Director General can delete bundles" ON public.bundles
  FOR DELETE USING (public.has_role('director_general'));

-- 2. Health metrics table policies
CREATE POLICY "Director General can view all health metrics" ON public.health_metrics
  FOR SELECT USING (public.has_role('director_general'));

CREATE POLICY "Director General can insert health metrics" ON public.health_metrics
  FOR INSERT WITH CHECK (public.has_role('director_general'));

CREATE POLICY "Director General can update health metrics" ON public.health_metrics
  FOR UPDATE USING (public.has_role('director_general'));

-- 3. Approvals table policies
CREATE POLICY "Director General can view all approvals" ON public.approvals
  FOR SELECT USING (public.has_role('director_general'));

CREATE POLICY "Director General can insert approvals" ON public.approvals
  FOR INSERT WITH CHECK (public.has_role('director_general'));

CREATE POLICY "Director General can update approvals" ON public.approvals
  FOR UPDATE USING (public.has_role('director_general'));

-- 4. Claims table policies
CREATE POLICY "Director General can view all claims" ON public.claims
  FOR SELECT USING (public.has_role('director_general'));

CREATE POLICY "Director General can insert claims" ON public.claims
  FOR INSERT WITH CHECK (public.has_role('director_general'));

CREATE POLICY "Director General can update claims" ON public.claims
  FOR UPDATE USING (public.has_role('director_general'));

-- 5. KPIs table policies
CREATE POLICY "Director General can view all kpis" ON public.kpis
  FOR SELECT USING (public.has_role('director_general'));

CREATE POLICY "Director General can insert kpis" ON public.kpis
  FOR INSERT WITH CHECK (public.has_role('director_general'));

CREATE POLICY "Director General can update kpis" ON public.kpis
  FOR UPDATE USING (public.has_role('director_general'));

-- 6. Scenarios table policies
CREATE POLICY "Director General can view all scenarios" ON public.scenarios
  FOR SELECT USING (public.has_role('director_general'));

CREATE POLICY "Director General can insert scenarios" ON public.scenarios
  FOR INSERT WITH CHECK (public.has_role('director_general'));

CREATE POLICY "Director General can update scenarios" ON public.scenarios
  FOR UPDATE USING (public.has_role('director_general'));

-- 7. Lessons table policies
CREATE POLICY "Director General can view all lessons" ON public.lessons
  FOR SELECT USING (public.has_role('director_general'));

CREATE POLICY "Director General can insert lessons" ON public.lessons
  FOR INSERT WITH CHECK (public.has_role('director_general'));

CREATE POLICY "Director General can update lessons" ON public.lessons
  FOR UPDATE USING (public.has_role('director_general'));

-- 8. Anomalies table policies
CREATE POLICY "Director General can view all anomalies" ON public.anomalies
  FOR SELECT USING (public.has_role('director_general'));

CREATE POLICY "Director General can insert anomalies" ON public.anomalies
  FOR INSERT WITH CHECK (public.has_role('director_general'));

CREATE POLICY "Director General can update anomalies" ON public.anomalies
  FOR UPDATE USING (public.has_role('director_general'));

-- 9. File attachments table policies
CREATE POLICY "Director General can view all file attachments" ON public.file_attachments
  FOR SELECT USING (public.has_role('director_general'));

CREATE POLICY "Director General can insert file attachments" ON public.file_attachments
  FOR INSERT WITH CHECK (public.has_role('director_general'));

-- 10. CLD tables policies
CREATE POLICY "Director General can view all cld_nodes" ON public.cld_nodes
  FOR SELECT USING (public.has_role('director_general'));

CREATE POLICY "Director General can insert cld_nodes" ON public.cld_nodes
  FOR INSERT WITH CHECK (public.has_role('director_general'));

CREATE POLICY "Director General can update cld_nodes" ON public.cld_nodes
  FOR UPDATE USING (public.has_role('director_general'));

CREATE POLICY "Director General can view all cld_edges" ON public.cld_edges
  FOR SELECT USING (public.has_role('director_general'));

CREATE POLICY "Director General can insert cld_edges" ON public.cld_edges
  FOR INSERT WITH CHECK (public.has_role('director_general'));

CREATE POLICY "Director General can update cld_edges" ON public.cld_edges
  FOR UPDATE USING (public.has_role('director_general'));
