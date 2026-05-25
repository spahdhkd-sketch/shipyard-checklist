# Codex Handoff Prompt - GS Safety Checklist - 2026-05-26

아래 내용을 새 데스크탑의 Codex 첫 메시지로 그대로 전달하세요.

```text
GS 안전 체크리스트 프로젝트를 이어서 작업합니다.

기본 정보:
- 프로젝트명: shipyard-checklist
- GitHub 저장소: https://github.com/spahdhkd-sketch/shipyard-checklist.git
- 브랜치: main
- 운영 주소: https://gs-safety-checklist.vercel.app
- Vercel 프로젝트는 .vercel/project.json에 연결되어 있습니다.
- orgId: team_yM4EKRXjJA9N1XsVvJBkpcB8
- projectId: prj_bzlIKnKQ0LDFnTimzTm1w0xFe9wR
- 활성 Supabase project ref: yuuroocvxvzgmsdeeiws
- 사용자는 한국어로 작업합니다.
- UI 변경은 가능하면 목업/스크린샷으로 먼저 확인받는 흐름을 선호합니다.
- 사용자가 명시하지 않으면 APP_VERSION은 버전업하지 않습니다.

새 데스크탑에서 먼저 할 일:
1. 저장소가 없으면 clone:
   git clone https://github.com/spahdhkd-sketch/shipyard-checklist.git
2. 저장소가 있으면 반드시 최신화:
   git status
   git remote -v
   git branch --show-current
   git pull origin main
3. npm.cmd run verify 실행 가능 여부 확인
4. .vercel/project.json 연결 상태 확인
5. assets/js/app-v2.js의 Supabase URL이 yuuroocvxvzgmsdeeiws인지 확인
6. 운영 주소 https://gs-safety-checklist.vercel.app의 HTML/JS/CSS가 최신 자산 토큰을 쓰는지 확인

최근 완료된 핵심 작업:
- Supabase Realtime을 원격 주요 테이블에 연결했습니다.
- Realtime이 SUBSCRIBED 상태가 되면 기존 15초 polling fallback은 중지됩니다.
- Realtime 장애, timeout, closed 상태에서는 fallback polling을 다시 시작합니다.
- 15초 polling 자체는 fallback 용도로 남아 있지만, 전체 브라우저 reload는 아닙니다.
- polling 또는 Realtime 동기화 render가 들어와도 로그인/사번/비밀번호 입력값, 포커스, 커서 위치가 유지되도록 수정했습니다.
- 관리자 > 작업 유형 관리 > 공기구 지정 저장 화면에서 저장 전 체크한 공기구가 동기화 render 때문에 풀리는 문제를 수정했습니다.
- 저장 전 공기구 체크값은 categoryToolDrafts에 임시 보관되고, 공기구 지정 저장을 누르면 실제 작업 유형 toolIds로 저장됩니다.
- 정적 자산 캐시 토큰을 20260526-input-preserve-1로 갱신했습니다.
- service worker 캐시명은 gs-safety-v15-20260526-input-preserve입니다.
- APP_VERSION은 0.5-20260525 그대로 유지했습니다.
- production 배포 후 gs-safety-checklist.vercel.app alias 연결을 확인했습니다.

최근 production 배포:
- 배포 URL: https://index-html-9vgqn8v74-spahdhkd-3161s-projects.vercel.app
- 운영 alias: https://gs-safety-checklist.vercel.app
- 운영 확인 내용:
  - index.html 200
  - sw.js 200
  - app-v2.js 200
  - styles-v2.css 200
  - app-v2.js?v=20260526-input-preserve-1 반영
  - styles-v2.css?v=20260526-input-preserve-1 반영
  - JS에 captureFocusedFieldState / restoreFocusedFieldState 반영
  - JS에 categoryToolDrafts / updateCategoryToolDraft 반영
  - JS에 Realtime SUBSCRIBED 시 stopRemotePolling 반영

배포 명령:
- npx.cmd vercel --prod --yes
- npx.cmd vercel alias set <deployment-url> gs-safety-checklist.vercel.app
- 배포 후 Invoke-WebRequest 또는 브라우저로 HTML/JS/CSS/SW 반영 여부를 확인하세요.

Supabase 주의:
- anon key 전체를 프롬프트나 문서에 새로 노출하지 마세요.
- 활성 Supabase URL은 assets/js/app-v2.js에 있습니다.
- 주요 테이블:
  safety_categories, safety_sections, safety_items, safety_tools, safety_pictograms,
  safety_ships, safety_workers, workers, safety_inspections, safety_inspection_items,
  unsafe_issues, missing_materials, issue_photos, work_prep_records
- 사진 Storage bucket: issue-photos
- 작업자 로그인 RPC: verify_worker_login

작업 원칙:
- 기존 코드 패턴을 우선 따릅니다.
- 파일 검색은 rg를 우선 사용합니다.
- 수동 파일 수정은 apply_patch를 사용합니다.
- UI 작업 후에는 브라우저로 실제 렌더링을 확인합니다.
- 배포 전에는 npm.cmd run verify를 실행합니다.
- Supabase 관련 작업은 DB 테이블/Storage/RPC 영향 범위를 먼저 확인합니다.
- 배포 후에는 gs-safety-checklist.vercel.app에서 실제 반영 여부를 확인합니다.
- dirty worktree가 있으면 먼저 git status로 사용자의 미커밋 변경을 확인하고 임의로 되돌리지 마세요.

다음에 확인하면 좋은 것:
- 모바일/현장 작업자 화면에서 15초 이상 입력 중에도 값이 유지되는지 실제 단말로 재확인
- 관리자 > 작업 유형 관리 > 공기구 지정 저장 화면에서 여러 공기구 체크 후 15초 이상 기다려도 체크가 유지되는지 재확인
- Supabase Realtime 연결이 정상일 때 polling fallback이 중지되는지 브라우저 console/네트워크에서 재확인
```

