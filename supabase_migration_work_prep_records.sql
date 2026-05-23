-- ============================================================
-- Migration: work_prep_records + safety_inspections 컬럼 추가
-- Supabase 대시보드 > SQL Editor 에서 실행하세요
-- ============================================================

-- 1. work_prep_records 테이블 생성
CREATE TABLE IF NOT EXISTS work_prep_records (
  id                    TEXT PRIMARY KEY,
  work_date             TEXT NOT NULL DEFAULT '',
  appearance_time       TEXT DEFAULT '',
  team                  TEXT DEFAULT '',
  ship_no               TEXT DEFAULT '',
  category_id           TEXT DEFAULT '',
  leader_worker_id      TEXT DEFAULT '',
  worker_ids            JSONB DEFAULT '[]',
  other_team_worker_ids JSONB DEFAULT '[]',
  tool_ids              JSONB DEFAULT '[]',
  status                TEXT DEFAULT 'preparing',
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE work_prep_records ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'work_prep_records'
      AND policyname = 'allow_all_work_prep_records'
  ) THEN
    EXECUTE 'CREATE POLICY allow_all_work_prep_records ON work_prep_records FOR ALL USING (true) WITH CHECK (true)';
  END IF;
END $$;

-- 2. safety_inspections 에 work_prep_record_id / work_prep_worker_id 컬럼 추가
ALTER TABLE safety_inspections
  ADD COLUMN IF NOT EXISTS work_prep_record_id TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS work_prep_worker_id TEXT DEFAULT '';
