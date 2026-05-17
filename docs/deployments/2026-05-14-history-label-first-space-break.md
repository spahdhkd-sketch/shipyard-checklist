# History Label First-Space Line Break

Date: 2026-05-14
Status: deployed

## Change Summary

- Apply a first-space line break display rule to inspection history labels.
- Home recent inspection history cards and the history menu cards now use the same display formatter.
- Inspection record detail checklist item names also use the formatter.
- Rule: only the first single space in a label is rendered as a line break. If two or more spaces appear in sequence, only the first space is converted to a line break; remaining spaces are not converted to additional line breaks.

## Local Files Changed

- `assets/js/app.js`
- `tools/browser-smoke.mjs`

## GitHub Record

- Pre-deploy record commit: `1572c67dac82df78cda40b73c967b7ef33d84e54`

## Verification

- `node --check assets\\js\\app.js`: passed
- `node --check tools\\browser-smoke.mjs`: passed
- Focused deployed browser check: passed
  - URL opened: `https://index-html-nu-dun-35.vercel.app/index.html`
  - Recent history cards found: `4`
  - First card title HTML observed: `DEMO<br>체크리스트`

## Deployment

- Vercel deployment id: `dpl_6HDwpojntmNU8kUrVKVuoCKsNuKZ`
- Production URL: `https://index-html-pma6rmgeq-spahdhkd-3161s-projects.vercel.app`
- Alias URL: `https://index-html-nu-dun-35.vercel.app`
- Vercel status: `Ready`
