-- ============================================================================
-- Migration: add expires_at to laptops
-- ============================================================================
-- This is a REFERENCE-ONLY migration file. This repo has no Supabase CLI /
-- migrations tooling wired up. Run this manually in the Supabase Dashboard's
-- SQL Editor, or via the Supabase CLI (`supabase db execute -f <this file>`)
-- / psql if you have that configured locally.
--
-- Used by: src/app/(tabs)/create-laptop.tsx (sets it on listing creation)
--          src/utils/notifications.ts (schedules the "expires tomorrow"
--          reminder one day before this timestamp)
-- ============================================================================

alter table public.laptops
  add column if not exists expires_at timestamptz;
