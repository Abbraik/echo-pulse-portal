
-- Create a table for UI content/text management
CREATE TABLE public.ui_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general',
  page TEXT,
  component TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_ui_content_key ON public.ui_content(key);
CREATE INDEX idx_ui_content_category ON public.ui_content(category);
CREATE INDEX idx_ui_content_page ON public.ui_content(page);

-- Add trigger to update updated_at column
CREATE TRIGGER update_ui_content_updated_at
  BEFORE UPDATE ON public.ui_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.ui_content ENABLE ROW LEVEL SECURITY;

-- Create policies for UI content (readable by all authenticated users, writable by director_general)
CREATE POLICY "UI content is readable by authenticated users"
  ON public.ui_content
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "UI content is writable by director general"
  ON public.ui_content
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'director_general'
    )
  );

-- Insert default UI content values
INSERT INTO public.ui_content (key, value, description, category, page) VALUES
-- Homepage content
('homepage.title', 'POPULATION DYNAMICS SYSTEM', 'Main site title', 'navigation', 'home'),
('homepage.welcome', 'Welcome to Population Dynamics System', 'Welcome message', 'general', 'home'),

-- Navigation items
('nav.home', 'HOME', 'Home navigation item', 'navigation', 'global'),
('nav.think', 'THINK', 'Think navigation item', 'navigation', 'global'),
('nav.act', 'ACT', 'Act navigation item', 'navigation', 'global'),
('nav.monitor', 'MONITOR', 'Monitor navigation item', 'navigation', 'global'),
('nav.learn', 'LEARN', 'Learn navigation item', 'navigation', 'global'),
('nav.innovate', 'INNOVATE', 'Innovate navigation item', 'navigation', 'global'),

-- Dashboard content
('dashboard.strategic_overview', 'Strategic Overview', 'Strategic overview title', 'dashboard', 'home'),
('dashboard.system_health', 'System Health', 'System health section title', 'dashboard', 'home'),
('dashboard.zone_snapshots', 'Zone Snapshots', 'Zone snapshots section title', 'dashboard', 'home'),

-- Zone titles and descriptions
('zones.think.title', 'THINK', 'Think zone title', 'zones', 'think'),
('zones.think.description', 'Strategic Planning & Analysis Hub', 'Think zone description', 'zones', 'think'),
('zones.act.title', 'ACT', 'Act zone title', 'zones', 'act'),
('zones.act.description', 'Implementation & Delivery Hub', 'Act zone description', 'zones', 'act'),
('zones.monitor.title', 'MONITOR', 'Monitor zone title', 'zones', 'monitor'),
('zones.monitor.description', 'Real-time Monitoring & Alerts Hub', 'Monitor zone description', 'zones', 'monitor'),
('zones.learn.title', 'LEARN', 'Learn zone title', 'zones', 'learn'),
('zones.learn.description', 'Knowledge & Insights Hub', 'Learn zone description', 'zones', 'learn'),
('zones.innovate.title', 'INNOVATE', 'Innovate zone title', 'zones', 'innovate'),
('zones.innovate.description', 'Design & R&D Innovation Hub', 'Innovate zone description', 'zones', 'innovate'),

-- Innovate page content
('innovate.zone_title', 'INNOVATE ZONE', 'Innovate zone main title', 'innovate', 'innovate'),
('innovate.system_redesign_hub', 'System Redesign Hub', 'System redesign hub subtitle', 'innovate', 'innovate'),
('innovate.zone_description', 'Advanced innovation and system redesign workspace for breakthrough solutions', 'Innovate zone description', 'innovate', 'innovate'),
('innovate.scenario_fork_button', 'Fork Scenario', 'Scenario fork button text', 'innovate', 'innovate'),
('innovate.scenario_fork_tooltip', 'Create a new scenario branch for experimentation', 'Scenario fork tooltip', 'innovate', 'innovate'),
('innovate.archive_scenario_button', 'Archive', 'Archive scenario button text', 'innovate', 'innovate'),
('innovate.archive_scenario_tooltip', 'Archive this scenario for future reference', 'Archive scenario tooltip', 'innovate', 'innovate'),
('innovate.promote_blueprint_button', 'Promote', 'Promote blueprint button text', 'innovate', 'innovate'),
('innovate.promote_blueprint_tooltip', 'Promote this blueprint to implementation', 'Promote blueprint tooltip', 'innovate', 'innovate'),
('innovate.generate_meta_design_blueprint', 'Generate Meta Design Blueprint', 'Generate meta design blueprint tooltip', 'innovate', 'innovate'),

-- Toolbox content
('toolbox.blocks', 'Blocks', 'Blocks tab title', 'toolbox', 'innovate'),
('toolbox.forks', 'Forks', 'Forks tab title', 'toolbox', 'innovate'),
('toolbox.new_system_redesign', 'New system redesign', 'New system redesign button text', 'toolbox', 'innovate'),

-- Canvas tabs
('canvas.sketch', 'Sketch', 'Sketch tab title', 'canvas', 'innovate'),
('canvas.simulate', 'Simulate', 'Simulate tab title', 'canvas', 'innovate'),
('canvas.simulation', 'Simulation', 'Simulation tab title', 'canvas', 'innovate'),
('canvas.results', 'Results', 'Results tab title', 'canvas', 'innovate'),
('canvas.blueprint', 'Blueprint', 'Blueprint tab title', 'canvas', 'innovate'),
('canvas.compare', 'Compare', 'Compare tab title', 'canvas', 'innovate'),
('canvas.co_create', 'Co-Create', 'Co-Create tab title', 'canvas', 'innovate'),
('canvas.ensemble', 'Ensemble', 'Ensemble tab title', 'canvas', 'innovate'),
('canvas.breakpoints', 'Breakpoints', 'Breakpoints tab title', 'canvas', 'innovate'),
('canvas.pathways', 'Pathways', 'Pathways tab title', 'canvas', 'innovate'),

-- Common UI elements
('common.loading', 'Loading...', 'Loading text', 'common', 'global'),
('common.save', 'Save', 'Save button text', 'common', 'global'),
('common.cancel', 'Cancel', 'Cancel button text', 'common', 'global'),
('common.edit', 'Edit', 'Edit button text', 'common', 'global'),
('common.delete', 'Delete', 'Delete button text', 'common', 'global'),
('common.close', 'Close', 'Close button text', 'common', 'global'),
('common.search', 'Search', 'Search placeholder text', 'common', 'global'),

-- Error messages
('error.not_found', 'Page not found', 'Not found error message', 'errors', 'global'),
('error.loading_failed', 'Failed to load data', 'Loading error message', 'errors', 'global'),
('error.generic', 'Something went wrong', 'Generic error message', 'errors', 'global'),

-- Tab not implemented message
('canvas.tab_not_implemented', 'This tab is not yet implemented', 'Tab not implemented message', 'canvas', 'innovate');
