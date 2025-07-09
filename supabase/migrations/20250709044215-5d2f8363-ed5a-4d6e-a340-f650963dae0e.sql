-- Extend claims table with origin tracking
ALTER TABLE public.claims 
  ADD COLUMN origin_zone TEXT NOT NULL DEFAULT 'MONITOR',
  ADD COLUMN origin_entity_id UUID NOT NULL DEFAULT gen_random_uuid();

-- Create indices for performance
CREATE INDEX idx_claims_origin ON public.claims(origin_zone, origin_entity_id);
CREATE INDEX idx_claims_status_zone ON public.claims(status, zone);

-- Add resolution fields
ALTER TABLE public.claims 
  ADD COLUMN resolution_notes TEXT,
  ADD COLUMN resolved_by UUID REFERENCES auth.users(id),
  ADD COLUMN resolved_at TIMESTAMP WITH TIME ZONE;

-- Create RLS policies for claimants
CREATE POLICY "Claimants can view assigned claims" 
ON public.claims 
FOR SELECT 
USING (claimed_by = auth.uid() OR status = 'open');

CREATE POLICY "Claimants can update their claims" 
ON public.claims 
FOR UPDATE 
USING (claimed_by = auth.uid());

-- Create claim management functions
CREATE OR REPLACE FUNCTION public.claim_task(claim_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.claims 
  SET 
    status = 'assigned',
    claimed_by = auth.uid(),
    metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object('claimed_at', now())
  WHERE id = claim_id AND (status = 'open' OR claimed_by IS NULL);
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Claim not available or already assigned';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.release_task(claim_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.claims 
  SET 
    status = 'open',
    claimed_by = NULL,
    metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object('released_at', now())
  WHERE id = claim_id AND claimed_by = auth.uid();
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Cannot release claim - not assigned to you';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.resolve_task(claim_id UUID, notes TEXT DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.claims 
  SET 
    status = 'closed',
    closed_at = now(),
    resolved_by = auth.uid(),
    resolution_notes = notes,
    metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object('resolved_at', now())
  WHERE id = claim_id AND claimed_by = auth.uid();
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Cannot resolve claim - not assigned to you';
  END IF;
END;
$$;