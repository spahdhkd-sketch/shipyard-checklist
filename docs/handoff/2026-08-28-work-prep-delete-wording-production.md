# 2026-08-28 work-order delete wording production checkpoint

## Release

- Branch: `feat/claude-batch`
- Application commit: `6cecb51cd0d52d37d811bac000946676c9d7ee82`
- Application version: `1.13.2-20260828-v1`
- Asset token: `20260828-v1-1`
- Production URL: `https://gs-safety-checklist.vercel.app`
- Preview deployment: `dpl_6AjTFnmhZUvhvxsK2Mc7SNBUPaWJ`
- Production deployment: `dpl_EgG33De81KBMr7qfiqUAwvyHmug9`

## Shipped behavior

- Registered work-order controls, accessibility labels, confirmation copy, permission errors, and completion feedback now use `삭제`.
- The canonical authenticated action and server behavior remain soft-delete so the correction does not weaken the existing data-safety boundary.
- The delete confirmation explains that the record disappears from the active list without exposing implementation wording to field users.

## Verification evidence

- `npm.cmd run build:assets`
- `npm.cmd run verify`
- `node tools/quality-harness.mjs --skip-verify --allow-non-main` — passed
- `npm.cmd run e2e` — 78 browser checks passed, including delete acceptance, local removal, tombstone storage, and card disappearance
- `npm.cmd run e2e:design-tokens` — 48 surfaces at 1366, 430, 390, and 360 px
- `npm.cmd run e2e:pwa`
- `git diff --check`
- Preview metadata reported exact Git SHA `6cecb51cd0d52d37d811bac000946676c9d7ee82` and `READY`.
- Production `VERSION.md`, `sw.js`, `check.html`, and `assets/dist/js/app-v2.min.js` matched the release markers and committed minified asset hash.
- A 390 px production browser displayed `삭제`, exposed the accessibility name `작업지시서 삭제`, and opened a `삭제할까요?` confirmation without `보관` or `soft-delete` wording.
- The production confirmation was dismissed, so no production work-order mutation was sent.

## Preserved boundaries

- No pull request was created or merged.
- No Supabase migration, Edge Function deployment, or production data mutation was performed.
- No live push notification was sent.
- Existing untracked patch inputs, project documents, and the standalone visual plan were not committed or deployed.
