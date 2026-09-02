# GitHub 저장소 분석 보고서

- 분석 일시: `2026-08-27` (Asia/Seoul)
- 대상 저장소: [`spahdhkd-sketch/shipyard-checklist`](https://github.com/spahdhkd-sketch/shipyard-checklist)
- 분석 기준 원격 브랜치: `feat/claude-batch`
- 분석 기준 SHA: `35af8430ae756d0b7e42791ecb7a2cff8586aefd`

## 1. 결론

GS Safety Checklist는 조선소 현장의 작업 전 안전 점검, 안전서약, 불안전 사항·자재 누락 신고, 관리자 운영, 통계, 알림을 하나의 한국어 PWA로 제공하는 정적 멀티페이지 애플리케이션이다. 프런트엔드는 프레임워크 없이 HTML·CSS·JavaScript로 구성되고, Supabase가 데이터·인증·Realtime·Storage·Edge Function을, Vercel이 정적 호스팅과 PWA 배포를 담당한다.

현재 가장 큰 저장소 운영 위험은 코드 자체보다 기준 브랜치와 문서의 불일치다.

- GitHub 기본 브랜치 `main`은 실제 작업 브랜치보다 31커밋 뒤에 있다.
- `feat/claude-batch`는 `main`보다 31커밋 앞서고 뒤처진 커밋은 없지만, 아직 병합되지 않았다.
- 두 브랜치 비교에는 169개 변경 파일이 포함된다.
- 원격 README는 여전히 과거 v1.0 브랜치와 2026-05-28 handoff를 현재 진입점으로 안내한다.
- 원격 작업 브랜치에는 저장소 운영 지침인 `AGENTS.md`와 영구 프로젝트 문서인 `docs/project/PROJECT_BRIEF.md`가 없다.
- 로컬에는 프로젝트 브리프를 복원했지만 아직 GitHub에 커밋하거나 푸시하지 않았다.

따라서 `main`, 작업 브랜치, Vercel Preview, 프로덕션 별칭을 같은 상태로 간주하면 안 된다. 후속 변경과 릴리스는 반드시 정확한 SHA를 기준으로 분리해 검증해야 한다.

## 2. 확인된 GitHub 원격 상태

| 항목 | 확인 결과 | 근거 유형 |
|---|---|---|
| 저장소 | `spahdhkd-sketch/shipyard-checklist` | GitHub 연결 조회 |
| 공개 범위 | Public, archived 아님 | GitHub 저장소 메타데이터 |
| 기본 브랜치 | `main` | GitHub 저장소 메타데이터 |
| `main` HEAD | `1cce2260eec05c29c2a4c4faf96fe639cd41ad66` | GitHub ref 조회 |
| 작업 브랜치 | `feat/claude-batch` | GitHub branch 조회 |
| 작업 브랜치 HEAD | `35af8430ae756d0b7e42791ecb7a2cff8586aefd` | GitHub ref 조회 |
| 브랜치 관계 | 작업 브랜치가 31커밋 앞섬, 0커밋 뒤처짐 | GitHub compare 조회 |
| 비교 파일 수 | 169개 | GitHub compare 조회 |
| PR #5 | Open Draft, 병합되지 않음 | GitHub PR 조회 |
| PR #5 제목 | `recovery: restore Vercel runtime and protect section edits` | GitHub PR 조회 |
| PR #5 URL | <https://github.com/spahdhkd-sketch/shipyard-checklist/pull/5> | GitHub PR 조회 |

로컬 체크아웃 HEAD도 `35af8430ae756d0b7e42791ecb7a2cff8586aefd`로 원격 작업 브랜치와 일치했다. 따라서 변경되지 않은 로컬 추적 파일의 구조 분석은 해당 원격 SHA의 구조 분석으로 사용할 수 있다. 단, 로컬 작업 트리에는 미커밋 변경과 미추적 파일이 있으므로 현재 로컬 디렉터리 전체가 원격 SHA와 동일한 것은 아니다.

## 3. 제품과 사용자 흐름

주요 사용자는 현장 작업자와 반장·관리자다.

- 작업자는 로그인 후 작업지시를 확인하고 작업 전 점검, 도구 확인, 체크리스트, 서명, 불안전 사항·자재 누락 신고, 안전서약을 수행한다.
- 반장과 관리자는 선박, 작업자, 작업종류, 도구, 체크리스트, 작업지시, 신고, 알림, 안전 설정, 보존 정책, 운영 통계를 관리한다.
- 현장 조건상 360–430 px 모바일 화면, 설치형 PWA, 간헐적 연결, 오프라인 재전송, 빠른 작업 완료가 핵심 제약이다.

추적된 핵심 애플리케이션 셸은 10개다.

| 셸 | 역할 |
|---|---|
| `index.html` | 오늘의 안전 운영과 주요 진입점 |
| `check.html` | 작업 선택, 점검, 서명, 제출 |
| `ships.html` | 선박·공정 운영 |
| `history.html` | 점검 이력 검색과 상세 |
| `items.html` | 퀵 메뉴와 작업종류 관리 |
| `pledge.html` | 안전서약 대상·알림·완료 추적 |
| `analytics.html` | 안전 신호와 작업자 통계 |
| `manage.html` | 작업자·작업지시·신고·푸시·설정·보존 관리 |
| `unsafe.html` | 불안전 사항 목록·상세·타임라인 |
| `materials.html` | 자재 누락 목록·상세·타임라인 |

`404.html`은 오류 셸이고 `redesign-v2.html`은 핵심 운영 경로 수에서 제외했다.

## 4. 기술 구조

### 프런트엔드

- 프레임워크 없는 정적 HTML·CSS·JavaScript 구조다.
- `assets/js/app-v2.js`가 공통 상태, 라우팅, 동기화, 작업자 세션, 화면 전환을 조정한다.
- `assets/js/admin-v2.js`는 필요할 때 동적으로 불러오는 관리자 런타임이다.
- `assets/js/screen-views.js`와 `assets/js/dashboard-view.js`가 공통 화면 렌더링을 담당한다.
- 분석, 점검, 신고/자재, 탐색, 알림, 보존, 안전 설정, 작업자, 작업 준비 등을 별도의 model/helper/rules 모듈로 분리한다.
- 현재 최상위 JavaScript 소스 파일은 34개, CSS 소스 파일은 15개다.
- 소스는 `assets/js/`와 `assets/css/`에 있고, `tools/build-assets.mjs`가 `assets/dist/`의 커밋된 배포 산출물을 생성한다.

### 데이터와 동기화

- Supabase가 데이터베이스, 세션, Realtime, Storage, RPC, Edge Function을 제공한다.
- 클라이언트는 로컬 상태와 오프라인 대기열을 유지하고 원격 행을 직접 조정한다.
- Realtime이 실패하면 커서 기반 폴링으로 보완한다.
- 로그인 전에는 로그인과 체크리스트 준비에 필요한 공개 마스터 데이터만 가져오도록 제한하는 변경이 작업 브랜치에 포함돼 있다.
- 오프라인 기록은 앱 업데이트 후에도 유지되고 생성한 작업자에게 귀속돼야 한다.

### Supabase 서버 경계

| 구성 | 확인 수량/이름 |
|---|---|
| 마이그레이션 | 41개 |
| 수동 cutover | 2개 |
| Edge Function | 4개 |
| Edge Function 이름 | `admin-mutations`, `pictogram-image`, `record-retention`, `worker-push` |

일반 마이그레이션과 수동 승인 cutover는 별도 경계다. 브라우저의 UI 제한이나 anon 수준 읽기는 서버 권한 검증을 대체하지 않는다.

### 호스팅과 PWA

- Vercel이 정적 파일, 라우트 rewrite, redirect, cache header, CSP를 관리한다.
- `manifest.json`이 설치형 앱을 정의한다.
- `sw.js`가 앱 버전, asset token, 셸 캐시, 업데이트 확인, 제어 중인 탭의 reload를 조정한다.
- 분석 시점의 서비스워커 표시는 앱 버전 `1.13.0-20260826-v4`, asset token `20260826-v4-1`이다.
- `VERSION.md`는 v1.13.0 responsive operations 릴리스와 동일한 asset token을 기록한다.

## 5. 테스트와 품질 게이트

원격 작업 브랜치의 `package.json`은 다음 검증 표면을 제공한다.

- `npm run verify`: JavaScript 구문 검사와 명시적인 Node 회귀 테스트 체인
- `npm run build:assets`: 소스에서 커밋 대상 `assets/dist/` 재생성
- `npm run e2e`: live Supabase 요청을 차단한 hermetic 브라우저 흐름
- `npm run e2e:design-tokens`: 반응형 디자인 토큰과 시각 표면 검증
- `npm run e2e:icons`: 아이콘 선택 흐름
- `npm run e2e:realtime`: Realtime 전용 흐름
- `npm run e2e:pwa`: 서비스워커·업데이트 흐름
- `tools/quality-harness.mjs`: 릴리스, HTML, 보안, 동기화, PWA, 배포 불변조건

로컬의 정확한 원격 HEAD 구조에는 59개 `tests/*.test.js` 파일이 있다. 현재 handoff는 릴리스 시점의 82개 테스트 통과와 브라우저·PWA·반응형 게이트 통과를 기록하지만, 이는 handoff에 기록된 과거 증거다. 이번 분석에서는 테스트를 다시 실행하지 않았으며 현재 미커밋 코드의 통과 상태로 재해석하지 않았다.

## 6. 문서와 저장소 운영 진단

### 높음: 기본 브랜치가 실제 제품 상태를 대표하지 않음

`main`은 작업 브랜치보다 31커밋 뒤에 있고 169개 파일 차이가 난다. 새 참여자, 자동화, 배포 연동이 기본 브랜치를 기준으로 동작하면 오래된 제품 상태를 읽거나 배포할 위험이 있다.

### 높음: README가 현재 상태와 충돌함

원격 작업 브랜치의 README도 `codex/safety-pictograms-handoff-20260528`, 태그 `v1.0-20260529`, `codex-handoff-2026-05-28.md`를 현재 진입점으로 안내한다. 실제 작업 브랜치와 v1.13.0 문서 상태를 반영하지 못한다.

### 중간: 저장소 내부 운영 문서가 원격에 없음

원격 `feat/claude-batch`에서 `AGENTS.md`와 `docs/project/PROJECT_BRIEF.md`는 404다. 로컬에서는 `docs/project/PROJECT_BRIEF.md`를 복원했지만 아직 원격 저장소의 일부가 아니다. 현재 handoff의 원격 버전도 브리프가 누락됐다고 기록한다.

### 중간: 릴리스와 후속 변경의 검증 표면이 분리돼 있음

현재 handoff에 따르면 프로덕션은 릴리스 커밋 `804f51e37038703e74623173730051f7e21404b3`에 대응하고, 이후 로그인 전 원격 pull 제한 변경은 Preview나 프로덕션에 배포되지 않았다. 이 관계는 handoff에서 읽은 주장으로, 이번 분석에서 Vercel 별칭이나 프로덕션 자산을 다시 조회해 검증하지 않았다.

### 중간: 남은 live 검증 경계

현재 handoff는 다음 항목을 미검증 또는 미확정으로 남긴다.

- 실제 기기의 push notification 수신
- 로그인 전 요청 감소 변경의 Preview 브라우저 측정
- 일부 작업 준비 Step 2·3 재검증
- 관찰 환경 밖에서의 Supabase Realtime WebSocket 실패 재현 여부

## 7. 권장 실행 순서

1. `README.md`, `AGENTS.md`, `docs/project/PROJECT_BRIEF.md`, `docs/handoff/CURRENT.md`를 하나의 문서 정합성 변경으로 검토한다.
2. 미커밋 코드·생성물·테스트·E2E 도구 변경과 문서 변경을 분리해 각 변경의 소유권과 목적을 확인한다.
3. `feat/claude-batch`를 기준으로 Preview에서 로그인 전 네트워크 요청, 작업 준비 Step 2·3, Realtime fallback을 다시 검증한다.
4. 병합 또는 릴리스 전 `npm run verify`, `npm run build:assets`, 비-main quality harness, 관련 E2E, `git diff --check`를 현재 SHA에서 실행한다.
5. `main`을 실제 기준 브랜치로 갱신할지, 다른 브랜치를 기본 브랜치로 지정할지 저장소 운영 결정을 내린다.
6. 프로덕션 작업이 승인될 때만 배포 SHA, Vercel deployment, production alias, HTML·`sw.js`·대표 자산을 함께 대조한다.
7. 승인된 테스트 수신자가 있을 때만 실제 push receipt를 검증한다.

커밋, 푸시, PR 상태 변경, Vercel 배포·별칭 변경, Supabase 변경은 이 분석 범위에 포함하지 않았다.

## 8. 증거 경계

| 구분 | 이번 분석에서 실제 확인한 내용 |
|---|---|
| GitHub 관찰 | 저장소 메타데이터, 두 branch ref, compare 결과, PR #5 상태, 원격 README·package.json·CURRENT.md, 원격 문서 부재 |
| 로컬 관찰 | 원격 작업 브랜치와 동일한 HEAD, 파일·테스트·마이그레이션·함수 수, 소스 구조, 서비스워커 버전 표식, 미커밋 작업 트리 |
| 문서에서 인용한 상태 | 프로덕션 릴리스 SHA, 과거 테스트 통과, 미배포 후속 변경, 남은 live 검증 경계 |
| 이번에 확인하지 않은 내용 | Vercel production alias의 현재 SHA, 실제 프로덕션 브라우저 동작, Supabase 배포 상태, 실제 push 수신 |

이 구분을 유지해야 코드 추론, 기록된 과거 상태, 현재 GitHub 상태, 실제 프로덕션 상태를 혼동하지 않는다.
