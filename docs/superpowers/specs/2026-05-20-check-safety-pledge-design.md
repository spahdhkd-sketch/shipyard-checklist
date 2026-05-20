# Check Safety Pledge Design

## Goal

Add an inline `안전 서약` step to the checklist writing page after `호선 번호` and before `안전다짐`.

Workers should confirm the current pledge template, sign it, then continue the existing section-based safety checklist. The existing final checklist behavior must remain unchanged.

## Current Flow

```text
작업 유형 선택
-> 공기구/준비물 선택
-> 점검 작성 페이지
   - 담당자명
   - 호선 번호
   - 안전다짐
   - 섹션별 점검 항목
   - 제출
```

## Target Flow

```text
작업 유형 선택
-> 공기구/준비물 선택
-> 점검 작성 페이지
   - 담당자명
   - 호선 번호
   - 안전 서약 체크박스
   - 서명란
   - 안전다짐
   - 섹션별 점검 항목
   - 제출
```

## Screen Layout

```text
┌──────────────────────────────┐
│ 탑재 작업 점검표              │
│ 진행률 0%                     │
├──────────────────────────────┤
│ 담당자명                      │
│ [ 홍길동                    ] │
│                              │
│ 호선 번호                     │
│ [ 1234 ▼                   ] │
│                              │
│ 안전 서약        0 / 4        │
│ ☐ 지정된 보호구를 반드시 착용합니다. │
│ ☐ 작업 전 체크리스트를 성실히 이행합니다. │
│ ☐ 위험 요소 발견 시 즉시 보고합니다. │
│ ☐ 작업 중 안전 수칙을 준수합니다. │
│                              │
│ 서명란                        │
│ ┌──────────────────────────┐ │
│ │ 손가락 또는 마우스로 서명 │ │
│ └──────────────────────────┘ │
│                              │
│ 안전다짐                      │
│ [ 오늘 작업 전 안전수칙을... ] │
│                              │
├──────────────────────────────┤
│ 섹션별 점검 항목              │
│ ☐ 와이어 손상 여부 확인       │
│ ☐ 샤클 체결 상태 확인         │
│                              │
│ [제출하기]                    │
└──────────────────────────────┘
```

## Functional Requirements

1. The inline pledge section uses the current pledge template returned by `pledgeRules()`.
2. If an admin edits the pledge template in the `서약` menu, the checklist writing page reflects the new template.
3. The pledge is rendered as a checklist, not a document preview.
4. Every pledge checkbox must be checked before submission.
5. A signature is required before submission.
6. Pledge checkbox state resets for each new inspection.
7. Signature state is reused only when the date and worker name are the same.
8. If the worker name changes, the signature is cleared even on the same date.
9. The existing `안전다짐` field remains after the new `안전 서약` section.
10. Existing section-based checklist item filtering and submission behavior remains unchanged.

## Data Behavior

The existing draft fields should remain the source of truth:

- `state.draft.pledgeChecks`: per-rule checkbox state.
- `state.draft.pledgeSignature`: current signature value.
- `state.draft.safetyPledge`: existing safety pledge / safety commitment text field.

Add a persisted signature reuse cache keyed by local date and worker name:

```text
pledgeSignatureCache[YYYY-MM-DD][workerName] = signatureData
```

The cache should be local-device only. It should not change Supabase schema.

On render:

1. If `state.draft.pledgeSignature` is empty,
2. and `state.draft.worker` is not empty,
3. and a cached signature exists for `today()` and that worker name,
4. preload that signature into the draft.

On signature save:

1. Save the signature to `state.draft.pledgeSignature`.
2. If worker name exists, also save it in the same-day worker signature cache.

On new inspection draft:

1. Reset `pledgeChecks` to `{}`.
2. Keep `pledgeSignature` empty initially.
3. Let render-time preload restore the signature only if date + worker name match.

## Submission Behavior

Submission remains blocked unless all of these are true:

- 담당자명 exists.
- 호선 번호 exists.
- Every `pledgeRules()` item is checked.
- Signature exists.
- There are checklist items.
- Required high-risk items are checked.

The saved `safetyPledge` text should continue to include the checked pledge rules and signature label:

```text
[확인] 지정된 보호구를 반드시 착용합니다.
[확인] 작업 전 체크리스트를 성실히 이행합니다.
[확인] 위험 요소 발견 시 즉시 보고합니다.
[확인] 작업 중 안전 수칙을 준수합니다.
서명: 홍길동
```

## UI Details

- Place the pledge section inside the existing `pledge-flow-grid`.
- Order:
  1. `renderPledgeWorkerSelect()`
  2. `renderPledgeShipSelect(selectableShips)`
  3. inline pledge checklist + signature
  4. existing `안전다짐` field
- The inline pledge section should use the existing visual language from `.pledge-flow-card`, `.pledge-rule-row`, and signature pad styles.
- Mobile layout must remain single-column and avoid horizontal overflow.
- The submit disabled tooltip/reason should continue to mention missing pledge checks and missing signature.

## Non-Goals

- Do not change the `서약` menu dashboard.
- Do not change the pledge template editing workflow.
- Do not add a Supabase table or schema migration.
- Do not remove the existing `안전다짐` field.
- Do not change the section checklist item filtering rules.

## Testing

Update `npm.cmd run verify` coverage where feasible:

- Static test verifies the inline pledge renderer is present.
- Static test verifies signature cache helper is present.
- Existing syntax checks continue to pass.
- Existing checklist and issue/material rule tests continue to pass.

Manual mobile verification:

- Start a new inspection.
- Enter 담당자명 and 호선.
- Confirm pledge rules appear between 호선 and 안전다짐.
- Confirm submit is blocked until every rule is checked.
- Confirm submit is blocked until signature is entered.
- Submit once with a signature.
- Start another inspection on the same date with the same 담당자명.
- Confirm signature is restored.
- Change 담당자명.
- Confirm signature is not reused.

## Implementation Handoff

After this spec is approved, create an implementation plan with Superpowers `writing-plans`.
