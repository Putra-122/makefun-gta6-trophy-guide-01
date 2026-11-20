# gta6-trophy-guide-01 — build notes

Built 2026-11-20 in a fresh recorded session. Competition: offline web app — guide + tracker for the 55 official PS5 GTA VI trophies, $250 ESCROWED, top 50, closes Sat 21 Nov 2026 18:00 WIB.

## Harness check — PASSED

Kit downloaded from `https://make.fun/c/gta6-trophy-guide-01/kit` into `~/workspace/makefun/gta6-trophy-guide-01-kit/` and extracted. `competition.yaml` line 471, "Recorded harnesses": Claude Code, Claude Desktop's Cowork, Codex, **Muse app**, Superbot, Gemini CLI, Qwen Code, GitHub Copilot CLI, pi, oh-my-pi, DeepSeek Harness, Factory Droid, Grok Build, Muse Code, Kiro CLI, CodeBuddy Code, Goose, OpenClaw, Hermes Agent, opencode, ZCode, Antigravity. **Muse app IS a recorded harness — the build is allowed.**

## ⚠️ RECORD FLOW — parent must read this before submitting

This competition's transcript gate is stricter than the meme/news-image ones:

- `competition.yaml` line 488 (`transcripts_witnessed`): every session must come from **a sealed recording that `makefun record` made while the agent worked** — "no transcript upload is taken". A session begun before the recording started FAILS.
- `competition.yaml` line 469 + RULES.txt line 116: the flow is — create repo (after opening), bring in the starter, **start `node cli/makefun.mjs record --competition gta6-trophy-guide-01 --source <repo>`**, then start a NEW agent session in it and build there. `main.ts` needs at least one line the agent wrote; the recording must see the agent write every file (source, data file, screenshots included).
- **This build session began before any recording started**, so a plain bundle of this session's files may fail `transcripts_witnessed`. Options for the parent: (a) start `record` and spawn a FRESH build session that re-writes the entry (authorship rules require the recording to see every file written anyway — the files here are the spec to re-implement, not to copy); or (b) verify with the kit whether the bundle flow is accepted for this competition type before spending a rebuild. Do NOT submit this session's bundle blind.
- Submit (per RULES.txt): `node cli/makefun.mjs submit --competition gta6-trophy-guide-01 --source <repo> --commit <sha> --title "<name>" --recording <id> --keypair wallet.json` (escrowed → --keypair required).

## The entry — "Leonida Legend"

`~/workspace/makefun/entry-gta6-trophy-guide-01/` (all code written in this session; `vendor/makefun-frontend.ts` and `LICENSE` are the kit's own files, copied unchanged as the rules require):

- `app/data/trophies.json` — all 55 trophies: official name, description, grade (1 platinum / 2 gold / 6 silver / 46 bronze), hidden flag (28 hidden), category, missable flag, a guide in my own words per trophy, and a cited source + URL per trophy.
- `app/index.html` + `app/app.js` + `app/style.css` — offline single-page app (system fonts, no network): checklist with localStorage progress, export/import progress as JSON, search, filters by grade/kind/status, missable-only toggle, spoiler setting (28 hidden trophies concealed until earned or until spoilers are shown), hash-routed trophy detail pages with prev/next, a 4-phase platinum roadmap view, and a dedicated missable-trophy view. No Rockstar logo or artwork.
- `main.ts` — written in-session: copies app/ + screenshots/ to /output, writes dossier.json via the vendored library (same caps as the starter).
- `serve.ts` — dev-only static server (PORT env, default 8080).
- `screenshots/` — 4 JPEG renders of the app running in headless Chromium, 1280×800, each under 256 KiB: 1-checklist, 2-guide (Cunning Stunts detail), 3-roadmap, 4-silver (Silver filter applied). `shots.json` lists the views.
- `README.md` — 3 live make.fun badges + bounty link. `.makefun/owner.json` = `{"wallet": "xfazjnk39LekFTxvEGhGVcAtmdpCtQYbx4KzztVeFbU"}`.

## Trophy list — verified, not invented

The kit starter's `trophies.json` was cross-checked against four independent public lists and matches exactly (names, descriptions, grades, 1/2/6/46 split, 28 hidden):

- Push Square — GTA 6 Trophy Guide & Roadmap (2026-11-18): also grounded the guides — 397 stunts (130 jumps / 202 under-bridges / 40 knife flights / 25 base jumps), 42 Shooting Range challenges at Rodgers Ranch (Port Gellhorn) + Griffin (Balsero), 14 Top Fun drone locations, 18 card sets (15 for 100%), 80 Challenges (50 for the trophy, 70 for 100%), 18 meditation spots, 8 garages $160,000 total, 200–300+ hours to platinum, 100% checklist unlocks after the story.
- Insider Gaming — Complete GTA 6 Trophy List: the exact 28-hidden split (27 non-hidden listed separately) — used for the hidden flags and the spoiler setting.
- EGamers + GTAScoop: grade split, "only possible missable: Positive Mental Attitude" (one spot at Jason's house in Chapter 1), Actions Speak Louder = 500 Criminal Profile actions.
- Where a trophy's description is cryptic (Personal Best, Bad Luck I Guess, The Truth Is Out There), the guide says what the description hints at and does not invent a specific location or step.

## Verification done (2026-11-20, this session)

- `node serve.ts` on :8091 — index/app.js/style.css/trophies.json all HTTP 200; 55 trophies load over HTTP.
- Screenshots taken in headless Chromium (`--headless=new --no-sandbox --no-proxy-server`, 1280×800, fresh profile each shot) and visually checked: checklist, guide detail, roadmap, Silver filter all render correctly. (First pass caught a real bug — bare `.grade-*` CSS rules painted whole cards in grade colors — fixed by scoping them to `.grade-badge`, re-shot, verified.)
- `main.ts` run twice (`MAKEFUN_OUTPUT_DIR=/tmp/tg-out1` and `/tmp/tg-out2`): `diff -r` — **IDENTICAL**. dossier.json builds (705,506 bytes, under the 1.5 MiB cap), 9 files in /output.
- No network references in app code: no http(s) URLs in index.html/app.js/style.css; the only URLs are source citations in trophies.json data, rendered as links (allowed by the rules — a link opens only when the reader follows it).

## Status

NOT committed, NOT pushed, NOT bundled, NOT submitted. Ready for the parent to create repo Putra-122/makefun-gta6-trophy-guide-01, run the pre-submit check, and handle the record/bundle question above before submitting. Deadline Sat 21 Nov 2026 18:00 WIB.
