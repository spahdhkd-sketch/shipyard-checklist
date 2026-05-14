# 2026-05-14 Tool Management Simplification Deployment

## Deployment

- Date: 2026-05-14
- Target: production
- Status: Ready
- Vercel deployment ID: `dpl_EVasT6pqUM5JGew8pzPvyciH8xmV`
- Production URL: https://index-html-24qgmw440-spahdhkd-3161s-projects.vercel.app
- Alias URL: https://index-html-nu-dun-35.vercel.app
- Inspect URL: https://vercel.com/spahdhkd-3161s-projects/index-html/EVasT6pqUM5JGew8pzPvyciH8xmV

## Included Changes

- Simplified the More screen `공기구/준비물 관리` section.
- Changed the tool/preparation grid to four columns.
- Compact tool cards now show only:
  - tool/preparation name
  - tool nature badge
- Hidden edit inputs from compact cards.
- Added on-demand `+ 공기구 추가` form.
- Added one-card-at-a-time expanded edit mode.
- Expanded edit cards contain:
  - name input
  - nature select
  - save button
  - close button
  - delete button
- Prevented edit inputs and selects from overflowing outside the expanded card layer.

## Verification

- `node --check assets/js/app.js`: passed
- Local browser smoke test: passed
- Deployed browser smoke test: passed
- Deployed checks confirmed:
  - all pages load
  - More screen shows global tool cards
  - tool cards render in four columns
  - compact cards do not expose edit inputs
  - add form is collapsed by default
  - add form opens on demand
  - exactly one tool card expands for editing
  - edit input and select stay inside the expanded card
  - ship sorting controls still render
  - preparation flow still opens and proceeds to checklist

## Notes

This document records the deployed production state after simplifying the tool/preparation management UI. The local working folder used for the deployment was not a git checkout, so this deployment note is recorded through the GitHub contents API.
