# gta6-trophy-guide-01 — build notes (RECORDED REBUILD v3)

Rebuilt 2026-11-20 under live recording `01a1f7de-fba4-74eb-b523-a7ba7badea78`. Competition: offline web app — guide + tracker for the 55 official PS5 GTA VI trophies, $250 ESCROWED, top 50, closes Sat 21 Nov 2026 18:00 WIB.

## Why a third build

Build v2 (commit `c2ea53f`) passed the transcript gate but its main.ts exited with code 1 in the grader's sandbox, while running fine locally in every simulation. This build hardens the entry program: main.ts no longer deletes anything — no `rmSync` on the output dir at all. It only creates the output directory (`mkdirSync`, recursive), copies app/ and screenshots/ into it, builds the dossier and writes dossier.json. It works with a read-only repository and an absolute `MAKEFUN_OUTPUT_DIR` outside the repo (verified in a fresh read-only clone — see below).

This session re-wrote every counted file from the spec (this notes.md + the kit's RULES.txt / competition.yaml) without reading any old code or data file, so the recording witnessed every write. Internal structure and names differ from v2 where natural (new sunset theme, single-file app.js with hash routing and hash-query filter presets, roadmap phases as a data table).

## The entry — "Leonida Legend"

`~/workspace/makefun/entry-gta6-trophy-guide-01/` (all counted files written in this session; `vendor/makefun-frontend.ts` and `LICENSE` are the kit's own files, left untouched):

- `app/data/trophies.json` — all 55 trophies, re-researched from public sources (GamesFuze full list + Push Square + Insider Gaming + EGamers + GTAScoop + KeenGamer + Radio Times): official name/description/grade (1 Platinum / 2 Gold / 6 Silver / 46 Bronze), 28 hidden flags, kind, missable flag, a guide in my own words per trophy, cited source + URL per trophy. Validated: 55 entries, no duplicate names, every guide and source present. The one masked name is written as PlayStation publishes it: `T**s Ass Drug Money`.
- `app/index.html` + `app/app.js` + `app/style.css` — offline single-page app (system fonts, no network): checklist with localStorage progress, export/import progress as JSON, search, filters (grade/kind/status/missable-only), spoiler setting (28 hidden trophies concealed until earned or until spoilers are shown), hash-routed trophy detail pages with prev/next, a 4-phase platinum roadmap view, and a dedicated missable-trophy view. No Rockstar logo or artwork.
- `main.ts` — hardened entry program (see above), caps text_max_bytes 163840, screenshots max 4 / 262144, app 993 files / 48 MiB.
- `serve.ts` — dev-only static server (PORT env, default 8080).
- `screenshots/` — 4 JPEG renders in headless Chromium (1280×800, all under the 256 KiB cap): 1-checklist, 2-guide (Cunning Stunts detail), 3-roadmap, 4-silver (Silver filter). `shots.json` lists the views.
- `README.md` — 3 live make.fun badges + bounty link. `.makefun/owner.json` = `{"wallet": "xfazjnk39LekFTxvEGhGVcAtmdpCtQYbx4KzztVeFbU"}` (unchanged from earlier builds).

## Trophy list — verified, not invented

GamesFuze's full list (55, with descriptions and hidden markers) matches Insider Gaming's two tables (27 non-hidden / 28 hidden), EGamers' split table, GTAScoop and KeenGamer on names, grades and the 1/2/6/46 split. Guides are grounded in Push Square's verified details (397 stunts: 130 jumps / 202 under-bridges / 40 knife flights / 25 base jumps; 42 Shooting Range challenges at Rodgers Ranch, Port Gellhorn + Griffin, Balsero; 18 card sets, 15 for 100%; 80 Challenges, 50 for the trophy, 70 for 100%; 8 garages $160,000 total; 200–300+ hours; 100% checklist unlocks after the story) and PowerPyx (200 hours, 39 gang operations, 22 bank jobs, 8 vaults). Only missable trophy: Positive Mental Attitude — one spot at Jason's house in Chapter 1 (GTAScoop/EGamers/PowerPyx). Cryptic trophies (Personal Best, Bad Luck I Guess, The Truth Is Out There, Challenging Tank, Ten Pin) are described honestly without invented steps.

## Verification done (2026-11-20, this session)

- `node serve.ts` on :8093 — index/app.js/style.css/trophies.json all HTTP 200 with exact byte sizes; 55 trophies load.
- Screenshots taken in headless Chromium (1280×800, fresh profile each, `--virtual-time-budget=8000`) and visually checked: checklist, guide detail, roadmap (hidden story trophies correctly concealed as "Hidden Trophy"), Silver filter.
- `main.ts` run twice (`MAKEFUN_OUTPUT_DIR=out` twice): dossier byte-identical both runs (sha256 + size in the final report).
- Read-only sandbox simulation: fresh clone, repo made read-only, `MAKEFUN_OUTPUT_DIR` set to an absolute path outside the repo — exit 0, dossier written.
- No network references in app code: no http(s) URLs in index.html/app.js/style.css; the only URLs are source citations in trophies.json data (allowed — a link opens only when the reader follows it).

## Status

Rebuilt under recording, committed and pushed by this session (see git log). Parent: extract muse-usage rows to `~/.makefun/muse-usage-gta6-trophy-guide-01.jsonl`, seal recording `01a1f7de-fba4-74eb-b523-a7ba7badea78`, then submit with `--recording 01a1f7de-fba4-74eb-b523-a7ba7badea78` + `--keypair` (escrowed) + agent-facts flags (`--harness Muse --harness-version 1.3 --provider ipnext --model ipnext/avocado-5.17-v1 --effort default --mcp none`). Deadline Sat 21 Nov 2026 18:00 WIB.
