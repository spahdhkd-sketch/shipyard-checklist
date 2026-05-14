# 2026-05-14 Vercel Production Deployment

## Deployment

- Date: 2026-05-14
- Target: production
- Status: Ready
- Vercel deployment ID: `dpl_8TN57NCmoZnrf8bNCr1RxkLfFaeJ`
- Production URL: https://index-html-3hpz2i4o6-spahdhkd-3161s-projects.vercel.app
- Alias URL: https://index-html-nu-dun-35.vercel.app
- Inspect URL: https://vercel.com/spahdhkd-3161s-projects/index-html/8TN57NCmoZnrf8bNCr1RxkLfFaeJ

## Included Changes

- Added ship card sorting in the ship menu.
  - Process stage order
  - Ship number order
  - Earliest L/C date
  - Earliest D/L date
  - Recently added
  - Saved order
- Added admin-only `현재 순서 저장` for persisting the currently displayed ship order.
- Added tool nature based checklist filtering.
  - Tool natures: `선행`, `후행`, `선행/후행`
  - Category-level tool nature defaults
  - Item-level visibility conditions
- Moved tool/preparation management to the top-level More screen.
- Compressed tool/preparation cards to a five-column mobile-friendly layout.
- Applied Supabase schema updates for:
  - `safety_tools.nature`
  - `safety_categories.tool_nature`
  - `safety_items.visibility_condition`
  - nullable `safety_tools.category_id` for global tools

## Verification

- `node --check assets/js/app.js`: passed
- Local browser smoke test: passed
- Deployed browser smoke test: passed
- Deployed checks confirmed:
  - all app pages load
  - More screen shows pictogram picker and global tool cards
  - global tool cards render in five columns
  - ship menu shows sort select
  - ship sort mode persists
  - ship menu shows `현재 순서 저장`
  - preparation flow opens and proceeds to checklist

## Notes

The local working folder used for this deployment was not a git checkout, so this document records the deployed state in GitHub separately from a source commit.
