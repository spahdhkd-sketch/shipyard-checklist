# History Label First-Space Line Break

Date: 2026-05-14
Status: recorded before deployment

## Change Summary

- Apply a first-space line break display rule to inspection history labels.
- Home recent inspection history cards and the history menu cards now use the same display formatter.
- Inspection record detail checklist item names also use the formatter.
- Rule: only the first single space in a label is rendered as a line break. If two or more spaces appear in sequence, only the first space is converted to a line break; remaining spaces are not converted to additional line breaks.

## Local Files Changed

- `assets/js/app.js`
- `tools/browser-smoke.mjs`

## Verification Before Deploy

- `node --check assets\\js\\app.js`: passed
- `node --check tools\\browser-smoke.mjs`: passed
- Full browser smoke currently has an unrelated submit-smoke fixture readiness issue in the test harness, so this deployment should be checked with focused browser verification after deploy.

## Deployment

Deployment should occur after this GitHub record, per the requested workflow.
