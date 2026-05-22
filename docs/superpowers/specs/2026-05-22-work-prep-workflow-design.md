# 작업 전 점검 / 작업 준비 등록 워크플로우 설계

## 목표

승인된 새 작업 전 점검 흐름을 구현하기 위한 실무 설계 문서다. 기존 "명일" 표현은 제거하고, 화면과 데이터 모델 전반에서 `작업 준비`, `오늘`, `다음 작업일` 용어를 사용한다.

이 문서는 구현 범위와 순서를 정리하는 목적이며, production source 파일은 수정하지 않는다.

## 핵심 결정

- 관리/총무/admin은 작업 전 `작업지시`를 만든다.
- 작업지시 생성 필수값은 `작업일`, `팀/소속`, `호선`, `작업 유형`이다.
- `조장`은 생성 시 선택값이며, 같은 팀 조장은 미배정 작업지시를 claim할 수 있다.
- 관리/총무/admin은 모든 작업지시를 시작하거나 편집할 수 있다.
- 상태 흐름은 `작업지시 -> 준비중 -> 확정 -> 사용됨`이며, 별도 종료 상태로 `취소`를 둔다.
- `준비 시작`은 명시적인 사용자 액션이다.
- `확정`에는 조장 1명과 공기구/준비물 1개 이상이 필요하다.
- 같이 작업자는 선택값이다. 조장은 항상 작업자 목록에 포함되며 제거할 수 없다.
- `확정`, `사용됨` 상태도 편집 가능하다.
- 작업 전 점검 제출 시점에는 작업 준비 데이터를 snapshot으로 저장한다.
- `취소` 작업은 화면에는 보이지만 점검 시작과 제출은 불가하다.
- 일반 작업자는 본인에게 배정된 `준비중`, `확정`, `사용됨` 카드를 볼 수 있다.
- 작업 준비가 없을 때는 기존 작업 유형 카드 기반 직접 점검 흐름을 유지한다.
- 작업지시/작업준비 생성, 편집, 상태 변경은 online-only다.
- 모든 작업 전 점검 제출은 online-only이며, 제출 전 2초 이내의 lightweight Supabase 연결 확인을 수행한다.
- 작업자 역할 구분은 별도 작업에서 `workers.position`으로 처리하므로 이 설계에서는 해당 필드 구현을 다루지 않는다.

## 데이터 모델 제안

### `work_orders`

작업 전 관리자가 만드는 작업지시의 최소 단위다.

| column | type | required | notes |
| --- | --- | --- | --- |
| `id` | uuid | yes | primary key |
| `work_date` | date | yes | 작업일 |
| `team_id` | uuid/text | yes | 기존 팀/소속 식별 방식에 맞춤 |
| `ship_id` | uuid/text | yes | 호선. 현재 앱의 호선 저장 방식에 맞춤 |
| `work_type_id` | uuid/text | yes | 작업 유형 |
| `leader_worker_id` | uuid/text | no | 조장. 생성 시 선택값 |
| `status` | text | yes | `ordered`, `preparing`, `confirmed`, `used`, `cancelled` |
| `created_by` | uuid/text | yes | 작업지시 생성 사용자 |
| `updated_by` | uuid/text | no | 마지막 편집 사용자 |
| `created_at` | timestamptz | yes | default now |
| `updated_at` | timestamptz | yes | trigger 또는 앱에서 갱신 |
| `cancelled_at` | timestamptz | no | 취소 시각 |
| `cancelled_by` | uuid/text | no | 취소 사용자 |
| `cancel_reason` | text | no | 선택 입력 |

권장 제약:

- `status in ('ordered', 'preparing', 'confirmed', 'used', 'cancelled')`
- `work_date`, `team_id`, `ship_id`, `work_type_id` not null
- `leader_worker_id`는 같은 팀 작업자 또는 admin 예외 정책을 앱/RLS에서 검증

### `work_preps`

작업지시에 연결되는 준비 상세다. 작업지시 1건당 현재 준비 상세 1건을 기본으로 둔다.

| column | type | required | notes |
| --- | --- | --- | --- |
| `id` | uuid | yes | primary key |
| `work_order_id` | uuid | yes | references `work_orders(id)` |
| `leader_worker_id` | uuid/text | yes after confirm | 준비중 저장까지는 null 허용 가능 |
| `status` | text | yes | 작업지시와 같은 상태를 캐시하거나 view로 대체 가능 |
| `started_at` | timestamptz | no | 준비 시작 시각 |
| `started_by` | uuid/text | no | 준비 시작 사용자 |
| `confirmed_at` | timestamptz | no | 확정 시각 |
| `confirmed_by` | uuid/text | no | 확정 사용자 |
| `used_at` | timestamptz | no | 점검 제출로 사용됨 처리된 시각 |
| `used_by` | uuid/text | no | 점검 제출 사용자 |
| `created_at` | timestamptz | yes | default now |
| `updated_at` | timestamptz | yes | trigger 또는 앱에서 갱신 |

권장:

- `work_order_id` unique로 두어 현재 버전은 1:1을 유지한다.
- 상태 단일 원천은 `work_orders.status`로 두고, `work_preps.status`는 제거하거나 DB view에서 조합하는 편이 덜 위험하다. 단, 정적 SPA에서 조회 단순성이 중요하면 캐시 컬럼을 허용하고 update RPC/transaction으로 동기화한다.

### `work_prep_workers`

같이 작업자 목록이다. 조장도 항상 포함한다.

| column | type | required | notes |
| --- | --- | --- | --- |
| `id` | uuid | yes | primary key |
| `work_prep_id` | uuid | yes | references `work_preps(id)` |
| `worker_id` | uuid/text | yes | 작업자 |
| `role` | text | yes | `leader` 또는 `member` |
| `created_at` | timestamptz | yes | default now |

권장 제약:

- unique(`work_prep_id`, `worker_id`)
- `role in ('leader', 'member')`
- app/RLS/RPC에서 leader row 삭제 방지

### `work_prep_items`

공기구/준비물 선택 목록이다.

| column | type | required | notes |
| --- | --- | --- | --- |
| `id` | uuid | yes | primary key |
| `work_prep_id` | uuid | yes | references `work_preps(id)` |
| `item_type` | text | yes | `tool`, `material`, `custom` |
| `item_id` | uuid/text | no | 기존 공기구/준비물 마스터가 있으면 참조 |
| `label` | text | yes | snapshot 표시용 이름 |
| `quantity` | numeric | no | 필요하면 추후 사용 |
| `created_at` | timestamptz | yes | default now |

확정 검증:

- `work_prep_items`가 1개 이상이어야 `confirmed`로 전환 가능하다.

### `inspection_submissions` 확장 또는 연결 테이블

점검 제출 시 작업 준비 정보를 snapshot으로 저장한다. 기존 제출 테이블명이 다르면 해당 테이블에 맞춰 적용한다.

| column | type | required | notes |
| --- | --- | --- | --- |
| `work_order_id` | uuid | no | 준비 기반 제출이면 저장 |
| `work_prep_id` | uuid | no | 준비 기반 제출이면 저장 |
| `work_prep_snapshot` | jsonb | no | 제출 당시 작업일, 팀, 호선, 작업 유형, 조장, 같이 작업자, 공기구/준비물, 상태 |
| `online_checked_at` | timestamptz | yes | 제출 직전 Supabase lightweight check 통과 시각 |

snapshot 최소 구조:

```json
{
  "workDate": "2026-05-22",
  "teamId": "team-id",
  "shipId": "ship-id",
  "workTypeId": "work-type-id",
  "leaderWorkerId": "worker-id",
  "workerIds": ["leader-id", "member-id"],
  "items": [{"type": "tool", "id": "tool-id", "label": "용접기"}],
  "statusAtSubmit": "confirmed"
}
```

## UI 진입점

### 작업 전 점검 첫 화면

조장/관리/총무/admin:

- 화면 상단에 `작업 준비 등록` 버튼을 노출한다.
- 그 아래에 `오늘 작업 준비` 섹션을 표시한다.
- 다음으로 `다음 작업일 작업 준비` 섹션을 표시한다.
- 마지막에 `작업 준비 없이 점검` 섹션으로 기존 작업 유형 카드들을 표시한다.

일반 작업자:

- 본인이 같이 작업자로 배정된 `준비중`, `확정`, `사용됨` 작업 준비 카드를 표시한다.
- 작업 준비가 없거나 직접 점검이 필요한 경우 기존 작업 유형 카드 흐름을 사용할 수 있다.

### 작업 준비 등록/편집 화면

입력 순서:

1. 작업일
2. 팀/소속
3. 호선
4. 작업 유형
5. 조장
6. 같이 작업자
7. 공기구/준비물
8. `상태 저장` 또는 `확정`

동작:

- `상태 저장`은 `작업지시` 또는 `준비중` 상태 저장에 사용한다.
- `준비 시작` 액션은 작업지시 카드 또는 상세 화면에서 명시적으로 수행한다.
- `확정`은 조장과 공기구/준비물 1개 이상이 있을 때만 가능하다.
- 조장 선택 시 같이 작업자 목록에 자동 포함하고 제거 버튼을 비활성화한다.
- `확정`, `사용됨` 상태에서도 편집 가능하되, 이미 제출된 점검의 snapshot은 변경하지 않는다.

### 작업 준비 카드

Collapsed:

- 호선
- 작업 유형
- 조장 이름
- 상태

Collapsed 카드 클릭:

- 취소 상태가 아니면 해당 준비를 기반으로 점검 시작 후보로 선택한다.
- 점검 화면에서 준비 기반 시작임을 highlight한다.

Expanded:

- 같이 작업자
- 공기구/준비물
- 우하단 `점검 시작` 버튼
- `취소` 상태에서는 `점검 시작` 버튼을 비활성화하거나 숨기고 취소 표시를 유지한다.

### 관리 화면

필터:

- 날짜
- 상태
- 팀/소속
- 작업 유형
- 조장
- 내 작업만 보기

검색:

- 호선 검색

정렬:

- 날짜
- 상태
- 팀/소속
- 호선
- 작업 유형
- 조장

## 권한 매트릭스

| 기능 | 일반 작업자 | 조장 | 관리 | 총무 | admin |
| --- | --- | --- | --- | --- | --- |
| 작업 준비 등록 버튼 보기 | no | yes | yes | yes | yes |
| 작업지시 생성 | no | no | yes | yes | yes |
| 같은 팀 미배정 작업지시 claim | no | yes | yes | yes | yes |
| 준비 시작 | assigned only | same-team assigned/claimed | any | any | any |
| 준비 상세 편집 | assigned limited | same-team assigned/claimed | any | any | any |
| 확정 | no | same-team assigned/claimed | any | any | any |
| 취소 | no | own/same-team policy 결정 필요 | any | any | any |
| 취소 작업 점검 시작 | no | no | no | no | no |
| 준비 기반 점검 제출 | assigned visible card | assigned/claimed | any | any | any |
| 준비 없이 기존 직접 점검 | yes | yes | yes | yes | yes |
| 관리 필터/정렬 화면 | no | limited own/team optional | yes | yes | yes |

정책 미결정 지점:

- 조장이 본인이 claim한 작업만 취소 가능한지, 같은 팀 전체 작업을 취소 가능한지 결정이 필요하다. 기본 권장은 조장 취소를 본인 claim/assigned 작업으로 제한하는 것이다.

## 상태 전환

| from | action | to | actor | validation |
| --- | --- | --- | --- | --- |
| none | 작업지시 생성 | `작업지시` | 관리/총무/admin | 작업일, 팀, 호선, 작업 유형 필수 |
| `작업지시` | claim | `작업지시` | 같은 팀 조장, 관리/총무/admin | 조장 미배정 또는 권한자 재배정 |
| `작업지시` | 준비 시작 | `준비중` | 조장/관리/총무/admin | 취소 아님, 조장 배정 권장 |
| `준비중` | 상태 저장 | `준비중` | 권한자 | 온라인 저장 성공 |
| `준비중` | 확정 | `확정` | 권한자 | 조장 있음, 공기구/준비물 1개 이상 |
| `확정` | 편집 저장 | `확정` | 권한자 | snapshot 변경 없음 |
| `확정` | 점검 제출 | `사용됨` | 제출 권한자 | 2초 Supabase check 성공, 제출 성공 |
| `사용됨` | 편집 저장 | `사용됨` | 권한자 | 기존 제출 snapshot 변경 없음 |
| any active | 취소 | `취소` | 권한자 | 취소 사유 선택 입력 가능 |
| `취소` | 점검 시작/제출 | blocked | all | 불가 |

상태 표시명:

- `ordered` -> `작업지시`
- `preparing` -> `준비중`
- `confirmed` -> `확정`
- `used` -> `사용됨`
- `cancelled` -> `취소`

## 구현 슬라이스

1. DB 마이그레이션 설계
   - `work_orders`, `work_preps`, `work_prep_workers`, `work_prep_items` 추가.
   - 제출 테이블에 `work_order_id`, `work_prep_id`, `work_prep_snapshot`, `online_checked_at` 추가.
   - RLS 또는 RPC 정책으로 role/team 기반 접근을 제한한다.

2. Supabase 접근 계층
   - 작업지시 목록 조회: 오늘, 다음 작업일, 관리 필터.
   - 작업지시 생성/편집/status transition 함수.
   - 준비 상세 저장 함수.
   - 제출 직전 lightweight check 함수. 예: `select 1` 또는 작은 settings row 조회를 2초 timeout으로 수행.

3. 작업 전 점검 첫 화면 재구성
   - 조장/관리/총무/admin 상단 `작업 준비 등록`.
   - `오늘 작업 준비`, `다음 작업일 작업 준비`, `작업 준비 없이 점검` 순서.
   - 일반 작업자에게 assigned 준비 카드 노출.

4. 작업 준비 등록/편집 화면
   - 입력 순서 고정.
   - 조장 자동 포함/삭제 불가 처리.
   - 저장, 준비 시작, 확정, 취소 액션 분리.
   - online-only 실패 메시지 명확화.

5. 카드 interaction
   - collapsed/expanded 상태 구현.
   - collapsed 클릭 시 준비 기반 점검 시작 후보 선택과 highlight.
   - expanded 우하단 `점검 시작` 버튼.
   - 취소 상태는 시작/제출 차단.

6. 점검 제출 연동
   - 준비 기반 점검이면 snapshot 생성 후 제출 payload에 포함.
   - 제출 성공 후 해당 준비를 `사용됨`으로 전환.
   - 제출 실패 시 `사용됨` 전환도 rollback되도록 transaction/RPC 권장.

7. 관리 화면
   - 날짜/상태/팀/작업 유형/조장/내 작업만 필터.
   - 호선 검색.
   - 날짜/상태/팀/호선/작업 유형/조장 정렬.

8. 문구 정리
   - `명일` 제거.
   - `작업 준비`, `오늘`, `다음 작업일`로 통일.

## 테스트/검증 체크리스트

### 단위/정적 테스트

- `명일` 문구가 신규 흐름에 남지 않는다.
- role별 첫 화면 섹션 노출이 맞다.
- 작업지시 생성 필수값 검증이 동작한다.
- 조장 선택 시 같이 작업자에 자동 포함된다.
- 조장 row 삭제가 차단된다.
- 공기구/준비물 0개 상태에서는 확정이 차단된다.
- 취소 상태는 점검 시작/제출이 차단된다.
- `확정`, `사용됨` 편집이 가능하다.
- 제출 snapshot은 이후 준비 편집에도 변하지 않는다.
- 준비 없이 점검 기존 흐름이 유지된다.

### 통합 테스트

- 관리자가 작업지시 생성: `작업지시` 카드 표시.
- 같은 팀 조장이 미배정 작업 claim.
- 준비 시작 후 `준비중` 전환.
- 조장과 공기구/준비물 입력 후 `확정` 전환.
- 일반 작업자가 배정된 준비 카드를 볼 수 있다.
- 준비 기반 점검 제출 성공 후 `사용됨` 전환.
- Supabase lightweight check 실패 시 제출이 중단되고 상태가 변경되지 않는다.
- 취소 작업은 카드에 보이지만 시작/제출할 수 없다.

### 화면 검증

- 조장/관리/총무/admin 첫 화면 순서:
  - `작업 준비 등록`
  - `오늘 작업 준비`
  - `다음 작업일 작업 준비`
  - `작업 준비 없이 점검`
- 카드 collapsed 정보: 호선, 작업 유형, 조장 이름, 상태.
- 카드 expanded 정보: 같이 작업자, 공기구/준비물, 우하단 점검 시작.
- 모바일에서 카드와 버튼이 겹치지 않는다.
- 관리 필터/검색/정렬 조합이 화면 밀림 없이 동작한다.

### 회귀 확인

- 기존 작업 유형 카드 직접 점검이 유지된다.
- 기존 안전 점검 제출/이력 화면이 깨지지 않는다.
- service worker cache/version token은 별도 배포 지시 전까지 변경하지 않는다.
- worker list/worker position 변경과 충돌하지 않는다.

## 배포 주의사항

- production source 구현 전 DB 마이그레이션과 RLS/RPC 설계를 먼저 확정한다.
- 정적 SPA이므로 DB schema가 배포보다 먼저 적용되지 않으면 신규 화면 저장/조회가 실패할 수 있다.
- 작업지시/준비 저장과 점검 제출은 offline queue에 넣지 않는다. 실패 시 사용자에게 온라인 연결 필요 메시지를 보여준다.
- 제출과 `사용됨` 전환은 가능한 한 하나의 RPC/transaction으로 묶는다.
- `확정`, `사용됨` 편집은 허용하되 제출 snapshot은 절대 갱신하지 않는다.
- 기존 캐시 토큰과 버전은 이번 설계 문서 작업에서 변경하지 않는다.
- `STATUS_FINAL.md`는 수정하지 않는다.
- `assets/js/app-v2.js`의 worker list/worker position 관련 영역과 관련 테스트는 다른 agent 작업 범위이므로 구현 시 충돌을 피한다.
## 추가 결정: 같이 작업자에 조장 포함

- `leader_worker_id`는 해당 작업 준비의 대표 조장 1명을 뜻한다.
- `work_prep_workers`의 같이 작업자 목록에는 일반 작업자뿐 아니라 다른 조장도 포함할 수 있다.
- 대표 조장은 같이 작업자 목록에 자동 포함되고 제거할 수 없다.
- 다른 조장은 필요 시 같이 작업자로 추가할 수 있으며, 이 경우 대표 조장 권한을 갖는 것이 아니라 해당 작업의 참여 작업자로 취급한다.
