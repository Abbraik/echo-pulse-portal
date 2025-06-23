
-- Add leverage_points column to bundles table
ALTER TABLE public.bundles ADD COLUMN IF NOT EXISTS leverage_points text[] DEFAULT '{}';

-- Create coherence_scores table
CREATE TABLE IF NOT EXISTS public.coherence_scores (
  bundle_id uuid REFERENCES public.bundles(id) ON DELETE CASCADE,
  objective text NOT NULL,
  leverage_point text NOT NULL,
  score integer CHECK(score BETWEEN 0 AND 100) DEFAULT 50,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY(bundle_id, objective, leverage_point)
);

-- Create RPC function to update bundle leverage points
CREATE OR REPLACE FUNCTION public.update_bundle_leverage(bundle_id uuid, point text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.bundles
  SET leverage_points = CASE 
    WHEN point = ANY(leverage_points) THEN array_remove(leverage_points, point)
    ELSE array_append(leverage_points, point)
  END,
  updated_at = now()
  WHERE id = bundle_id;
END;
$$;

-- Create RPC function to get coherence matrix
CREATE OR REPLACE FUNCTION public.get_coherence_matrix(bundle_id uuid)
RETURNS jsonb LANGUAGE sql SECURITY DEFINER AS $$
SELECT COALESCE(jsonb_agg(jsonb_build_object(
  'objective', objective,
  'leverage_point', leverage_point,
  'score', score
)), '[]'::jsonb)
FROM public.coherence_scores
WHERE bundle_id = $1;
$$;

-- Create RPC function to update coherence score
CREATE OR REPLACE FUNCTION public.update_coherence_score(bundle_id uuid, objective text, leverage_point text, new_score integer)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.coherence_scores (bundle_id, objective, leverage_point, score)
  VALUES (bundle_id, objective, leverage_point, new_score)
  ON CONFLICT (bundle_id, objective, leverage_point)
  DO UPDATE SET score = new_score, updated_at = now();
END;
$$;

-- Add trigger to update updated_at timestamp
CREATE TRIGGER update_coherence_scores_updated_at
  BEFORE UPDATE ON public.coherence_scores
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
