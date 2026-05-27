-- 불안전요소 Push 알림 수신 대상을 workers 테이블 컬럼으로 관리
-- 기존 UNSAFE_PUSH_TARGET_WORKER_NAMES 하드코딩 제거 후 DB 관리로 전환
-- 실행: Supabase Dashboard > SQL Editor

alter table workers
  add column if not exists unsafe_push_target boolean not null default false;

-- 기존 하드코딩 대상자를 초기값으로 설정 (이름 기준 — 실행 전 실제 이름 확인)
update workers set unsafe_push_target = true
  where name in ('허지원', '김준혁', '김경제');

-- 확인
select id, name, unsafe_push_target from workers order by name;
