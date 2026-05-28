# Claude Prompt - GS Safety Checklist Demo Deck

You are helping me prepare a Korean presentation for a live demo tomorrow.

Project:
- Name: GS Safety Checklist / Shipyard Checklist
- Live URL: https://gs-safety-checklist.vercel.app
- Repository: https://github.com/spahdhkd-sketch/shipyard-checklist
- Latest maintenance commit: d2c2526, "refactor: split helpers, styles, and view shells"

Context:
We finished a maintenance/refactor batch that split a large static shipyard safety checklist app into clearer CSS and JS boundaries without changing the user-facing workflow. The goal of the presentation is not to over-explain code internals. The goal is to show that the system is now more maintainable, safer to change, and still verified live after deployment.

Please create Korean presentation material for a 7-10 minute demo.

Audience:
- Non-engineering stakeholders who care about safety workflow reliability
- Engineering reviewers who care about maintainability and regression risk

Tone:
- Practical and confident
- Avoid marketing exaggeration
- Explain technical changes in operational terms
- Use Korean by default
- Include short English labels only where useful for code or deployment terms

Core story:
1. This app supports shipyard safety checklist workflows: checklist entry, unsafe item registration, material/issue handling, history, management views, and analytics.
2. The previous frontend worked, but the CSS and JS were too concentrated in large files, making changes risky.
3. We split stable helper logic, view-rendering shells, and feature/component CSS slices into separate files.
4. We added focused tests for helper/view modules and expanded static/visual/live verification.
5. We committed, deployed to production, and verified the live URL after deployment.

Important evidence to include:
- Production URL: https://gs-safety-checklist.vercel.app
- Commit: d2c2526
- Verification passed:
  - npm.cmd run verify: PASS
  - node tests/visual-check.js: PASS
  - npm.cmd run harness: PASS, 231 checks, failed 0
  - npm.cmd run harness:live: PASS, 246 checks, failed 0, warnings 0
  - live smoke: index, CSS, app JS, dashboard-view.js, pictogram-helpers.js, ship-helpers.js, worker-helpers.js, monthly-worker CSS, and sw.js all returned 200

Refactor highlights:
- New JS modules:
  - assets/js/dashboard-view.js
  - assets/js/pictogram-helpers.js
  - assets/js/ship-helpers.js
  - assets/js/worker-helpers.js
- New CSS slices:
  - assets/css/20-component-disabled-reason.css
  - assets/css/20-component-table.css
  - assets/css/30-feature-monthly-worker.css
  - assets/css/30-feature-not-found.css
  - assets/css/30-feature-push-management.css
  - assets/css/30-feature-signature.css
- New tests:
  - tests/dashboard-view.test.js
  - tests/pictogram-helpers.test.js
  - tests/ship-helpers.test.js
  - tests/worker-helpers.test.js

Please produce:
1. A slide-by-slide outline for 8 slides.
2. Speaker notes for each slide, written in natural Korean.
3. A 60-second executive summary.
4. A 3-minute technical reviewer summary.
5. A live demo script with exact checkpoints:
   - Open production URL
   - Show main workflow/screens
   - Explain that UI behavior stayed stable while internals were split
   - Mention verification gates
   - Close with next maintenance slice
6. A simple Q&A prep section with likely questions and concise answers.

Recommended slide structure:
1. Title: GS Safety Checklist - live maintenance update
2. Why this work mattered
3. What changed at a high level
4. CSS split: safer feature ownership
5. JS split: helper and view boundaries
6. Verification evidence
7. Live demo flow
8. Next steps

Next steps to mention:
- Continue event dispatch/action routing helper extraction
- Then separate command handlers and persistence/Supabase boundaries
- Keep each slice small, tested, and live-smoke verified

Constraints:
- Do not claim new product features were added.
- Do not expose secrets, Supabase keys, worker IDs, passwords, or tokens.
- Do not invent metrics beyond the verification data above.
- Keep slides readable, not text-heavy.
- Make it suitable to paste into Claude and then convert into a deck.
