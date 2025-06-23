
-- Create a reference table for Meadows leverage points
CREATE TABLE IF NOT EXISTS public.leverage_points_reference (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  current_usage integer DEFAULT 0 CHECK (current_usage >= 0 AND current_usage <= 100),
  recommended boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- Insert the 12 Meadows leverage points
INSERT INTO public.leverage_points_reference (id, name, description, current_usage, recommended) VALUES
('1', 'Constants & Parameters', 'Adjust model constants or system parameters that affect system behavior.', 45, false),
('2', 'Buffer Sizes', 'Change the size of stabilizing stocks to improve system resilience.', 60, true),
('3', 'Stock & Flow Structures', 'Modify stocks, flows, or their structural connections within the system.', 30, false),
('4', 'Delays', 'Manage time lags in processes to optimize system responsiveness.', 20, false),
('5', 'Feedback Loops', 'Strengthen or weaken reinforcing/balancing loops for better control.', 55, true),
('6', 'Information Flows', 'Control who has access to what information when making decisions.', 40, true),
('7', 'Rules of the System', 'Change the formal and informal rules that govern system behavior.', 35, false),
('8', 'Power Distribution', 'Alter who gets to make the rules and how power is distributed.', 25, false),
('9', 'Goals of the System', 'Change the purpose or function that the system serves.', 70, true),
('10', 'Paradigm or Mindset', 'Transform the shared worldview from which the system arises.', 15, true),
('11', 'Power to Transcend', 'Develop capacity to remain unattached to any particular paradigm.', 10, false),
('12', 'Meta-Rules', 'Change the rules about changing rules, the constitution level.', 20, false)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  current_usage = EXCLUDED.current_usage,
  recommended = EXCLUDED.recommended;

-- Create function to get all leverage points
CREATE OR REPLACE FUNCTION public.get_leverage_points()
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT jsonb_agg(jsonb_build_object(
    'id', id,
    'name', name,
    'description', description,
    'currentUsage', current_usage,
    'recommended', recommended
  ) ORDER BY id::integer)
  FROM public.leverage_points_reference;
$$;

-- Update the existing update_bundle_leverage function to handle array of strings
CREATE OR REPLACE FUNCTION public.update_bundle_leverage(bundle_id uuid, points text[])
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.bundles
  SET leverage_points = array_to_json(points)::jsonb,
      updated_at = now()
  WHERE id = bundle_id;
END;
$$;
