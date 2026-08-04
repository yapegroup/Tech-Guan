-- ==============================================================================
-- TECK GUAN GROUP - SUPABASE DROPDOWN SETTINGS TABLES SETUP SCRIPT
-- Copy and paste this script into your Supabase Project -> SQL Editor -> Run
-- ==============================================================================

-- 1. Create GTINs Table
CREATE TABLE IF NOT EXISTS public.gtins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO public.gtins (name) VALUES 
('Product'), ('Standard'), ('Custom'), ('N/A')
ON CONFLICT (name) DO NOTHING;


-- 2. Create Product Categories Table
CREATE TABLE IF NOT EXISTS public.product_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO public.product_categories (name) VALUES 
('Product'), ('Raw Material'), ('Semi-Finished'), ('Finished Goods'), ('Accessory'), ('Fastener'), ('Purlin'), ('Truss')
ON CONFLICT (name) DO NOTHING;


-- 3. Create Base Units of Measure Table
CREATE TABLE IF NOT EXISTS public.base_units_of_measure (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO public.base_units_of_measure (name) VALUES 
('Box (BOX)'), ('Kilogram (KG)'), ('Length (LN)'), ('Meter (M)'), ('Pack (PAC)'), ('Piece (PC)'), ('Roll (ROL)'), ('Sheet (SHT)'), ('Unit (UNT)'), ('Yards (YD)')
ON CONFLICT (name) DO NOTHING;


-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES (Allows Web App Read/Write Access)
-- ==============================================================================
ALTER TABLE public.gtins ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public full access gtins" ON public.gtins;
CREATE POLICY "Public full access gtins" ON public.gtins FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public full access product_categories" ON public.product_categories;
CREATE POLICY "Public full access product_categories" ON public.product_categories FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.base_units_of_measure ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public full access base_units_of_measure" ON public.base_units_of_measure;
CREATE POLICY "Public full access base_units_of_measure" ON public.base_units_of_measure FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- 4. ADD LAST UPDATED (updated_at) COLUMN TO MASTER PRODUCTS TABLE
-- ==============================================================================
ALTER TABLE public.master_products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
