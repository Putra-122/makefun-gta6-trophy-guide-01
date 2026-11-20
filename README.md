# Leonida Legend — GTA VI Trophy Guide & Tracker

![make.fun](https://make.fun/badge/gta6-trophy-guide-01.svg)
![Rank](https://make.fun/badge/gta6-trophy-guide-01/Putra-122/makefun-gta6-trophy-guide-01/rank.svg)
![Reward](https://make.fun/badge/gta6-trophy-guide-01/Putra-122/makefun-gta6-trophy-guide-01/reward.svg)

An offline web app that is the best guide and tracker for the 55 PlayStation 5 trophies of Grand Theft Auto VI — built for the [gta6-trophy-guide-01 bounty on make.fun](https://make.fun/bounty/gta6-trophy-guide-01).

## What it does

- **The official list, all 55 trophies** — 1 Platinum, 2 Gold, 6 Silver, 46 Bronze, each with its official name, description and grade (28 of them hidden, exactly as PlayStation lists them).
- **A guide for every trophy, in plain words, with its source cited** — what to do, where and how, and when it can be missed. Sources: Push Square, Insider Gaming, EGamers, GTAScoop.
- **Checklist saved in the browser** — tick trophies off as you earn them; progress survives reloads. Export it as JSON and import it back on another machine.
- **Filters by grade and kind, plus text search** — find the Silver grind, the stranger strands, or just the money trophies.
- **Spoiler setting** — the 28 hidden trophies stay concealed until you earn them or turn spoilers on, so the story stays unspoiled.
- **Platinum roadmap** — four phases from the first mission to 100% Completion, about 200–300 hours.
- **The one missable trophy, flagged** — Positive Mental Attitude (meditate at all 18 spots) is the only trophy that can slip away; one spot is at Jason's house in Chapter 1.

## Run it

Static files, no build step, no network. Open `app/index.html` in a desktop browser, or serve the folder:

```sh
node serve.ts   # serves app/ at http://localhost:8080 (development only)
```

The entry program `main.ts` (Node 22+) copies `app/` and `screenshots/` to `/output` and writes `/output/dossier.json`:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Files

- `app/index.html`, `app/app.js`, `app/style.css` — the guide itself.
- `app/data/trophies.json` — the 55 trophies with official names, descriptions, grades, hidden flags, categories, missable flags, guides and sources.
- `screenshots/` — 4 renders of the guide running in a browser (checklist, a trophy guide, the roadmap, the Silver filter).
- `main.ts` — the entry program. `vendor/makefun-frontend.ts` is the kit's copy, unchanged.
