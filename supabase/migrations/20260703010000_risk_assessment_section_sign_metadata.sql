-- 위험성평가 이식: 섹션(위험요인)에 안전표지 코드와 위험도 메타 추가 (2026-07-03, MCP로 원격 적용됨)
alter table public.safety_sections
  add column if not exists sign_code text not null default '',
  add column if not exists frequency smallint,
  add column if not exists severity smallint,
  add column if not exists total_score smallint;

comment on column public.safety_sections.sign_code is '안전표지 코드 (P/M/S/W-nn). 프런트 정적 자산 assets/pictograms/signs/{code}.png 매핑.';
comment on column public.safety_sections.frequency is '위험성평가 빈도(1-5)';
comment on column public.safety_sections.severity is '위험성평가 강도(1-5)';
comment on column public.safety_sections.total_score is '위험성평가 종합점수(빈도x강도)';
