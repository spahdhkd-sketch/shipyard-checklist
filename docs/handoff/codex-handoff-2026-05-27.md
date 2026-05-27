# Codex Handoff - GS Safety Checklist - 2026-05-27

이 문서는 다른 데스크탑의 Codex가 바로 이어받기 위한 최신 handoff입니다.

## 기본 정보

- 프로젝트명: `shipyard-checklist`
- GitHub 저장소: `https://github.com/spahdhkd-sketch/shipyard-checklist.git`
- 브랜치: `main`
- 운영 주소: `https://gs-safety-checklist.vercel.app`
- Vercel 프로젝트: `.vercel/project.json`에 연결됨
- Vercel orgId: `team_yM4EKRXjJA9N1XsVvJBkpcB8`
- Vercel projectId: `prj_bzlIKnKQ0LDFnTimzTm1w0xFe9wR`
- 활성 Supabase project ref: `yuuroocvxvzgmsdeeiws`
- 사용자는 한국어로 작업함
- 사용자가 명시하지 않으면 `APP_VERSION`은 올리지 않음
- Supabase anon/service key, 작업자 사번, 비밀번호, 세션 토큰은 문서나 프롬프트에 노출하지 말 것

## 새 데스크탑 시작 절차

```powershell
git clone https://github.com/spahdhkd-sketch/shipyard-checklist.git
cd shipyard-checklist
git status --short --branch
git remote -v
git branch --show-current
git pull origin main
npm.cmd run verify
npm.cmd run harness
```

확인할 것:

- `.vercel/project.json` 연결 상태
- `assets/js/app-v2.js`의 Supabase URL이 `yuuroocvxvzgmsdeeiws`
- 운영 `https://gs-safety-checklist.vercel.app/sw.js`가 최신 SW cache를 사용
- 운영 HTML/JS/CSS가 최신 asset token을 사용

## 현재 운영 기준

- 최신 GitHub 커밋: `31efef6` (`fix: make inspection history insert-only publicly`)
- 운영 Vercel deployment id: `dpl_GoNzvqUT7kspL3GYHqurkhhhyfoJ`
- 운영 deployment URL: `https://index-html-od3htxp63-spahdhkd-3161s-projects.vercel.app`
- 운영 alias: `https://gs-safety-checklist.vercel.app`
- `APP_VERSION`: `0.8-20260527`
- 화면 표시 버전: `version 0.8`
- asset token: `20260527-inspection-insert-only-1`
- SW cache: `gs-safety-20260527-inspection-insert-only-1`
- 버전 태그는 새로 만들지 않음

## 2026-05-27 완료된 주요 작업

- Worker `employee_no`를 브라우저 동기화 모델에서 분리
- `workers_public` read path 적용
- 관리자 mutation을 `admin-mutations` Edge Function 경유로 이동
- replay 가능한 `workerId + employeeNo` 반복 전송 대신 서버 발급 short-lived admin session 사용
- `admin_mutation_sessions`, `admin_mutation_attempts` ledger 추가
- admin session rate limit 추가
- admin catalog/workers direct browser write 차단
- unsafe/material/photo records는 public `SELECT/INSERT`만 유지, admin update/delete는 Edge Function 경유
- category/section cascade delete를 RPC/Edge Function 경유로 이동
- inspection history도 public `SELECT/INSERT` 전용으로 정리
- inspection history reset/delete는 `admin-mutations` 경유로 변경
- Realtime reconnect 및 polling fallback 정리
- `pullRemote`를 `Promise.allSettled` 기반으로 바꿔 일부 테이블 실패 시 나머지 로드 유지
- 로그인 실패/오류 시 버튼 잠김 해제
- 고속모드 운영 교훈을 `memory.md`에 기록

## Supabase 반영 상태

운영 Supabase에 적용된 최신 핵심 migration:

- `worker_public_read_path`
- `revoke_workers_delete`
- `enable_realtime_remote_tables`
- `admin_mutation_boundary`
- `admin_mutation_policy_lint_cleanup`
- `inspection_history_insert_only_boundary`

로컬 migration 파일:

- `supabase/migrations/20260527064035_worker_public_read_path.sql`
- `supabase/migrations/20260527071140_revoke_workers_delete.sql`
- `supabase/migrations/20260527071213_enable_realtime_remote_tables.sql`
- `supabase/migrations/20260527090000_admin_mutation_boundary.sql`
- `supabase/migrations/20260527091500_admin_mutation_policy_lint_cleanup.sql`
- `supabase/migrations/20260527093000_inspection_history_insert_only_boundary.sql`

Edge Functions:

- `worker-push`: version 7, `verify_jwt=true`
- `admin-mutations`: version 2, `verify_jwt=true`

최근 확인 결과:

- `admin-mutations` ping: HTTP 200
- `safety_inspections`, `safety_inspection_items`: anon `SELECT/INSERT=true`, `UPDATE/DELETE=false`
- public probe: inspection insert/upsert 성공, update/delete 차단 확인
- probe 데이터는 cleanup 완료

## 검증 결과

최근 통과한 명령:

```powershell
npm.cmd run verify
npm.cmd run harness
npm.cmd run harness:live
npx.cmd --yes deno check --config supabase/functions/admin-mutations/deno.json supabase/functions/admin-mutations/index.ts
git diff --check
```

결과:

- `npm.cmd run verify`: 통과
- `npm.cmd run harness`: 164 checks, failed 0, warnings 0
- `npm.cmd run harness:live`: 177 checks, failed 0, warnings 0
- 운영 HTML/SW: `20260527-inspection-insert-only-1` 반영
- 운영 화면 버전: `version 0.8`
- `version 0.9` 없음

## 배포 명령

```powershell
npm.cmd run verify
npm.cmd run harness
npx.cmd vercel --prod --yes
npx.cmd vercel alias set <deployment-url> gs-safety-checklist.vercel.app
npm.cmd run harness:live
```

배포 후 반드시 확인:

```powershell
Invoke-WebRequest -UseBasicParsing https://gs-safety-checklist.vercel.app/sw.js
```

## 남은 작업 후보

추천 다음 작업: `work_prep_records` 최소 RLS 정리

예상 시간:

- 최소 RLS 정리: 1.5~2시간
- Edge Function + 작업자 권한 세션까지 강하게 이동: 3~5시간

추천 범위:

- `work_prep_records`의 broad `ALL true` 정책 제거
- public `DELETE/TRUNCATE/REFERENCES/TRIGGER` 차단
- 현장 작업 준비 등록/수정 흐름은 깨지지 않게 `SELECT/INSERT/UPDATE` 정책으로 분리
- 삭제가 필요하면 서버 경유로 옮기는지 먼저 코드 경로 확인

남은 Supabase advisor 주요 경고:

- `work_prep_records` broad `ALL true`
- `app_state` broad insert/update
- `unsafe_issues`, `missing_materials`, `issue_photos` public insert `WITH CHECK true`
- `verify_worker_login`, `worker_push_subscription_status` public executable `SECURITY DEFINER`
- `worker_push_subscriptions` RLS enabled no policy
- 일부 unused index 정보성 경고

## 작업 원칙

- 기존 코드 패턴 우선
- 파일 검색은 `rg` 우선
- 수동 파일 수정은 `apply_patch` 우선
- `app-v2.js`는 큰 파일이므로 대량 치환은 범위를 엄격히 제한한 스크립트 사용 가능
- UI 변경은 먼저 목업/스크린샷으로 확인받는 흐름 선호
- UI 변경 후 실제 브라우저 렌더링 확인
- 배포 전 `npm.cmd run verify` 필수
- 배포 후 운영 `sw.js`, HTML asset token, `harness:live` 확인
- dirty worktree가 있으면 `git status`로 사용자 변경 확인, 임의 되돌리기 금지
