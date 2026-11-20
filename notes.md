# gta6-trophy-guide-01 — build notes (RECORDED REBUILD)

Rebuilt 2026-11-20 under live recording `01a1f78b-df8f-77af-a163-beaa08780bfa` (started before this session). Competition: offline web app — guide + tracker for the 55 official PS5 GTA VI trophies, $250 ESCROWED, top 50, closes Sat 21 Nov 2026 18:00 WIB.

## Why a rebuild

The first build (commit `a49fbc2`) was complete and verified but ran BEFORE any recording. This competition uses STRICT transcripts (`submission_rule.strict_transcripts`, authorship 12): no transcript upload; transcripts come only from a sealed `makefun record` recording that starts before the build session. This session re-wrote every counted file from the spec (notes.md of the first build + the kit's RULES.txt / competition.yaml) without reading any old code or data file, so the recording witnessed every write.

## The entry — "Leonida Legend"

`~/workspace/makefun/entry-gta6-trophy-guide-01/` (all counted files written in this session; `vendor/makefun-frontend.ts` and `LICENSE` are the kit's own files, hashes match the kit: vendor `4c8da1c8…`, LICENSE `babfa6d8…`):

- `app/data/trophies.json` — all 55 trophies, re-researched from public sources (GamesFuze full list + Push Square + PowerPyx + Insider Gaming + EGamers + GTAScoop + KeenGamer + WeHunt): official name/description/grade (1 Platinum / 2 Gold / 6 Silver / 46 Bronze), 28 hidden flags, category, missable flag, a guide in my own words per trophy, cited source + URL per trophy. Validated: 55 entries, no duplicate names, every guide and source present.
- `app/index.html` + `app/app.js` + `app/style.css` — offline single-page app (system fonts, no network): checklist with localStorage progress, export/import progress as JSON, search, filters (grade/category/status/missable-only), spoiler setting (28 hidden trophies concealed until earned or until spoilers are shown), hash-routed trophy detail pages with prev/next, a 4-phase platinum roadmap view, and a dedicated missable-trophy view. No Rockstar logo or artwork. Grade colour lives only on the small badges (a full-card paint bug was caught and fixed in the first build's notes; this build scopes it from the start).
- `main.ts` — written in-session: copies app/ + screenshots/ to the output dir (`MAKEFUN_OUTPUT_DIR`, default `/output`) and writes dossier.json via the vendored library, caps text_max_bytes 163840, screenshots max 4 / 262144, app 993 files / 48 MiB.
- `serve.ts` — dev-only static server (PORT env, default 8080).
- `screenshots/` — 4 JPEG renders in headless Chromium (1280×800, 85–99 KiB each, all under the 256 KiB cap): 1-checklist, 2-guide (Cunning Stunts detail), 3-roadmap, 4-silver (Silver filter). `shots.json` lists the views.
- `README.md` — 3 live make.fun badges + bounty link. `.makefun/owner.json` = `{"wallet": "xfazjnk39LekFTxvEGhGVcAtmdpCtQYbx4KzztVeFbU"}` (from the first build, unchanged).

## Trophy list — verified, not invented

GamesFuze's full list (55, with descriptions and hidden markers) matches Insider Gaming's two tables (27 non-hidden / 28 hidden), EGamers' split table, GTAScoop and KeenGamer on names, grades and the 1/2/6/46 split. Guides are grounded in Push Square's verified details (397 stunts: 130 jumps / 202 under-bridges / 40 knife flights / 25 base jumps; 42 Shooting Range challenges at Rodgers Ranch, Port Gellhorn + Griffin, Balsero; 18 card sets, 15 for 100%; 80 Challenges, 50 for the trophy, 70 for 100%; 8 garages $160,000 total; 200–300+ hours; 100% checklist unlocks after the story) and PowerPyx (200 hours, 39 gang operations, 22 bank jobs, 8 vaults). Only missable trophy: Positive Mental Attitude — one spot at Jason's house in Chapter 1 (GTAScoop/EGamers/PowerPyx). Cryptic trophies (Personal Best, Bad Luck I Guess, The Truth Is Out There, Challenging Tank, Ten Pin) are described honestly without invented steps.

## Verification done (2026-11-20, this session)

- `node serve.ts` on :8092 — index/app.js/style.css/trophies.json all HTTP 200 with exact byte sizes; 55 trophies load.
- Screenshots taken in headless Chromium (`--headless=new --no-sandbox --no-proxy-server`, 1280×800, fresh profile each, `--virtual-time-budget=8000`) and visually checked: checklist, guide detail, roadmap (hidden trophies correctly concealed as "Hidden Trophy"), Silver filter all render correctly. One cosmetic fix made after the first pass (search box given its own row so the placeholder is not truncated), then all 4 re-shot.
- `main.ts` run twice (`MAKEFUN_OUTPUT_DIR=/tmp/tg-out1` and `/tmp/tg-out2`): `diff -r` — **IDENTICAL**. dossier.json sha256 `888a049869a9a34b7103bc5d72702fbae8404031ff62ff81cfea73ed5a78a315` (552,380 bytes, under the 1.5 MiB cap), 9 files in /output.
- No network references in app code: no http(s) URLs in index.html/app.js/style.css; the only URLs are source citations in trophies.json data (allowed — a link opens only when the reader follows it).

## Status

Rebuilt under recording, committed (see git log), NOT pushed, NOT bundled, NOT submitted. Parent: extract muse-usage rows to `~/.makefun/muse-usage-gta6-trophy-guide-01.jsonl`, seal the recording, push, then submit with `--recording 01a1f78b-df8f-77af-a163-beaa08780bfa` + `--keypair` (escrowed). Deadline Sat 21 Nov 2026 18:00 WIB.
