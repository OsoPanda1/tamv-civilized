-- ============================================================
-- TAMV MD-X4 COMPLETE ECOSYSTEM MIGRATION
-- Storage Buckets, User Roles, KAOS Audio, DreamSpaces Enhanced
-- ============================================================

-- 1. CREATE APP ROLE ENUM
CREATE TYPE public.app_role AS ENUM ('user', 'citizen', 'builder', 'governor', 'admin', 'dao_admin', 'kaos_admin', 'isabella_admin');

-- 2. CREATE USER ROLES TABLE (Critical for security - never store roles in profiles)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    granted_at TIMESTAMPTZ DEFAULT now(),
    granted_by UUID REFERENCES auth.users(id),
    UNIQUE (user_id, role)
);

CREATE INDEX user_roles_user_idx ON public.user_roles(user_id);
CREATE INDEX user_roles_role_idx ON public.user_roles(role);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. SECURITY DEFINER FUNCTIONS FOR ROLE CHECKING
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_dao_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'dao_admin'
  )
$$;

CREATE OR REPLACE FUNCTION public.is_kaos_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'kaos_admin'
  )
$$;

CREATE OR REPLACE FUNCTION public.is_isabella_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'isabella_admin'
  )
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role IN ('admin', 'dao_admin')
  )
$$;

-- Helper to get owner from storage path
CREATE OR REPLACE FUNCTION public.storage_owner_id(name TEXT)
RETURNS UUID
LANGUAGE sql
STABLE
AS $$
  SELECT (storage.foldername(name))[1]::uuid
$$;

-- 4. RLS POLICIES FOR USER_ROLES
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (public.is_admin());

CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
USING (public.is_admin());

-- 5. CREATE KAOS TRACKS TABLE
CREATE TABLE public.kaos_tracks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artist_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    genre TEXT,
    bpm INTEGER,
    key_signature TEXT,
    duration_seconds INTEGER,
    bucket_path TEXT NOT NULL,
    cover_url TEXT,
    waveform_data JSONB DEFAULT '[]'::jsonb,
    emotional_tags TEXT[] DEFAULT '{}',
    is_public BOOLEAN DEFAULT false,
    plays_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    msr_event_id UUID REFERENCES public.msr_events(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX kaos_tracks_artist_idx ON public.kaos_tracks(artist_id);
CREATE INDEX kaos_tracks_public_idx ON public.kaos_tracks(is_public) WHERE is_public = true;

ALTER TABLE public.kaos_tracks ENABLE ROW LEVEL SECURITY;

-- RLS for KAOS tracks
CREATE POLICY "Public tracks visible to all"
ON public.kaos_tracks
FOR SELECT
USING (is_public = true OR artist_id = auth.uid() OR public.is_kaos_admin() OR public.is_dao_admin());

CREATE POLICY "Artists can manage own tracks"
ON public.kaos_tracks
FOR ALL
USING (artist_id = auth.uid());

CREATE POLICY "KAOS admins can manage all tracks"
ON public.kaos_tracks
FOR ALL
USING (public.is_kaos_admin() OR public.is_dao_admin());

-- 6. DREAMSPACE INSTANCES TABLE (for session tracking)
CREATE TABLE public.dreamspace_instances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dreamspace_id UUID NOT NULL REFERENCES public.dreamspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    node TEXT,
    cell TEXT,
    started_at TIMESTAMPTZ DEFAULT now(),
    ended_at TIMESTAMPTZ,
    msr_session_id TEXT,
    emotion_start TEXT DEFAULT 'serenidad',
    emotion_end TEXT,
    experience_points INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX dreamspace_instances_user_idx ON public.dreamspace_instances(user_id);
CREATE INDEX dreamspace_instances_space_idx ON public.dreamspace_instances(dreamspace_id);

ALTER TABLE public.dreamspace_instances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own instances"
ON public.dreamspace_instances
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own instances"
ON public.dreamspace_instances
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own instances"
ON public.dreamspace_instances
FOR UPDATE
USING (auth.uid() = user_id);

-- 7. ISABELLA EXPORTS TABLE (for tracking generated reports)
CREATE TABLE public.isabella_exports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    conversation_id UUID REFERENCES public.isabella_conversations(id) ON DELETE SET NULL,
    export_type TEXT NOT NULL DEFAULT 'emotional_report',
    bucket_path TEXT NOT NULL,
    title TEXT,
    emotional_summary JSONB,
    encrypted BOOLEAN DEFAULT true,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX isabella_exports_user_idx ON public.isabella_exports(user_id);

ALTER TABLE public.isabella_exports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own exports"
ON public.isabella_exports
FOR SELECT
USING (auth.uid() = user_id OR public.is_isabella_admin());

CREATE POLICY "Only Isabella service can create exports"
ON public.isabella_exports
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 8. CREATE STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public) VALUES
('avatars', 'avatars', true),
('dreamspaces-media', 'dreamspaces-media', true),
('marketplace-assets', 'marketplace-assets', true),
('kaos-music', 'kaos-music', false),
('docs-public', 'docs-public', true),
('user-uploads', 'user-uploads', false),
('isabella-exports', 'isabella-exports', false)
ON CONFLICT (id) DO NOTHING;

-- 9. STORAGE RLS POLICIES

-- AVATARS (public bucket, but controlled writes)
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'avatars' 
    AND (auth.uid()::text = (storage.foldername(name))[1] OR public.is_dao_admin())
);

-- DREAMSPACES-MEDIA (public bucket)
CREATE POLICY "DreamSpaces media publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'dreamspaces-media');

CREATE POLICY "Space owners can upload media"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'dreamspaces-media'
    AND EXISTS (
        SELECT 1 FROM public.dreamspaces d
        WHERE d.id::text = (storage.foldername(name))[2]
        AND d.owner_id = auth.uid()
    )
);

-- USER-UPLOADS (private, per-user)
CREATE POLICY "Users can upload own files"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'user-uploads'
    AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view own uploads"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'user-uploads'
    AND (auth.uid()::text = (storage.foldername(name))[1] OR public.is_dao_admin())
);

CREATE POLICY "Users can delete own uploads"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'user-uploads'
    AND (auth.uid()::text = (storage.foldername(name))[1] OR public.is_dao_admin())
);

-- KAOS-MUSIC (private, artist-controlled)
CREATE POLICY "KAOS artists and admins can view music"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'kaos-music'
    AND (
        EXISTS (
            SELECT 1 FROM public.kaos_tracks t
            WHERE t.bucket_path = name
            AND (t.artist_id = auth.uid() OR t.is_public = true)
        )
        OR public.is_kaos_admin()
        OR public.is_dao_admin()
    )
);

CREATE POLICY "KAOS artists can upload music"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'kaos-music'
    AND (auth.uid()::text = (storage.foldername(name))[1] OR public.is_kaos_admin())
);

CREATE POLICY "KAOS artists can manage own music"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'kaos-music'
    AND (auth.uid()::text = (storage.foldername(name))[1] OR public.is_kaos_admin() OR public.is_dao_admin())
);

-- ISABELLA-EXPORTS (maximum privacy)
CREATE POLICY "Users can view own Isabella exports"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'isabella-exports'
    AND (auth.uid()::text = (storage.foldername(name))[1] OR public.is_isabella_admin())
);

CREATE POLICY "Isabella service can create exports"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'isabella-exports'
    AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Only Isabella admin can delete exports"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'isabella-exports'
    AND public.is_isabella_admin()
);

-- 10. AUTO-ASSIGN USER ROLE ON SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_role
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user_role();

-- 11. UPDATE DREAMSPACES TABLE WITH ADDITIONAL FIELDS
ALTER TABLE public.dreamspaces 
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS role_civilizatorio TEXT DEFAULT 'general',
ADD COLUMN IF NOT EXISTS phase TEXT DEFAULT 'alpha',
ADD COLUMN IF NOT EXISTS min_level TEXT DEFAULT 'user',
ADD COLUMN IF NOT EXISTS cover_image_url TEXT,
ADD COLUMN IF NOT EXISTS economic_loop JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS ethical_limits JSONB DEFAULT '{}'::jsonb;

-- 12. SEED 8 DREAMSPACES FROM DOCUMENTATION
INSERT INTO public.dreamspaces (
    id, title, slug, description, scene_type, role_civilizatorio, phase, 
    is_public, economic_loop, ethical_limits, owner_id
) VALUES 
(
    gen_random_uuid(),
    'Neo-Tokio 2099',
    'neo-tokio-2099',
    'Hub Comercial Cyberpunk con subastas de publicidad y terrenos virtuales',
    'metropolis',
    'Hub Comercial',
    'live',
    true,
    '{"type": "advertising_auctions", "terrain_sales": true}'::jsonb,
    '{"anti_spam": true, "fair_advertising": true}'::jsonb,
    (SELECT id FROM auth.users LIMIT 1)
),
(
    gen_random_uuid(),
    'Abismo de Marte',
    'abismo-marte',
    'Zona de minería de recursos con licencias y sistema de energía',
    'dream-realm',
    'Minería de Recursos',
    'beta',
    true,
    '{"type": "resource_mining", "licenses": true, "energy_system": true}'::jsonb,
    '{"anti_grind": true, "fatigue_limit": 240}'::jsonb,
    (SELECT id FROM auth.users LIMIT 1)
),
(
    gen_random_uuid(),
    'Sector Zero',
    'sector-zero',
    'Supervivencia Co-op con suministros y sistema anti-griefing',
    'quantum-nexus',
    'Supervivencia Co-op',
    'alpha',
    true,
    '{"type": "survival_coop", "supplies": true}'::jsonb,
    '{"anti_griefing": true, "respawn_rules": true}'::jsonb,
    (SELECT id FROM auth.users LIMIT 1)
),
(
    gen_random_uuid(),
    'Santuario',
    'santuario',
    'Espacio de bienestar y arte con semillas NFT y zonas VIP',
    'sanctuary',
    'Bienestar y Arte',
    'live',
    true,
    '{"type": "wellness_art", "nft_seeds": true, "vip_zones": true}'::jsonb,
    '{"no_anxiety_gamification": true, "healing_only": true}'::jsonb,
    (SELECT id FROM auth.users LIMIT 1)
),
(
    gen_random_uuid(),
    'Estación Orbital',
    'estacion-orbital',
    'Meta-comercio con Fuel-Coin, hangares y naves espaciales',
    'metropolis',
    'Meta-Comercio',
    'beta',
    true,
    '{"type": "meta_commerce", "fuel_coin": true, "hangars": true}'::jsonb,
    '{"probability_transparency": true}'::jsonb,
    (SELECT id FROM auth.users LIMIT 1)
),
(
    gen_random_uuid(),
    'Trono de Obsidiana',
    'trono-obsidiana',
    'Centro de Gobernanza con mociones y asientos VIP',
    'quantum-nexus',
    'Gobernanza',
    'live',
    true,
    '{"type": "governance", "motion_cost": true, "vip_seats": true}'::jsonb,
    '{"inalienable_vote": true, "no_vote_buying": true}'::jsonb,
    (SELECT id FROM auth.users LIMIT 1)
),
(
    gen_random_uuid(),
    'Auditorio 4D',
    'auditorio-4d',
    'Centro cultural con tickets coleccionables y merchandising',
    'concert-hall',
    'Cultura',
    'live',
    true,
    '{"type": "culture", "collectible_tickets": true, "merchandise": true}'::jsonb,
    '{"compulsive_spending_limit": true}'::jsonb,
    (SELECT id FROM auth.users LIMIT 1)
),
(
    gen_random_uuid(),
    'Neo-Coliseo',
    'neo-coliseo',
    'Arena de honor y ranking con skins, patrocinios y apuestas',
    'academy',
    'Honor y Ranking',
    'beta',
    true,
    '{"type": "competition", "skins": true, "sponsorships": true, "betting": true}'::jsonb,
    '{"anti_cheat_hardcoded": true, "fair_play": true}'::jsonb,
    (SELECT id FROM auth.users LIMIT 1)
)
ON CONFLICT (slug) DO NOTHING;