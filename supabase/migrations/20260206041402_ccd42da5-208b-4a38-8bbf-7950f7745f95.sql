-- Fix function search_path for storage_owner_id
CREATE OR REPLACE FUNCTION public.storage_owner_id(name TEXT)
RETURNS UUID
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT (storage.foldername(name))[1]::uuid
$$;