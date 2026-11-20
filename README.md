# Leonida Legend — GTA VI Trophy Guide & Tracker

[![gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Putra-122/makefun-gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Putra-122/makefun-gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

An offline web app that guides PlayStation 5 players through all **55 GTA VI trophies** (1 Platinum, 2 Gold, 6 Silver, 46 Bronze) and tracks progress to the Platinum, **Vice Got a Price!**

## What it does

- **Checklist** — every trophy with its official name, description and grade; tick trophies off and progress is saved on the device (localStorage, no account, no network).
- **Guides in the maker's own words** — one per trophy, each citing its source (Push Square, PowerPyx, GamesFuze, Insider Gaming, EGamers, GTAScoop). Where a trophy's method is still unconfirmed by players, the guide says so instead of inventing steps.
- **Spoiler setting** — the 28 hidden trophies stay concealed (name, description and guide) until earned or until the reader turns spoilers on.
- **Platinum roadmap** — four phases: story, strangers, activities and crime cleanup, then collectibles and the 100% checklist, with per-phase progress.
- **Missable view** — flags the only possibly missable trophy, Positive Mental Attitude (meditate at Jason's house in Chapter 1), and confirms the other 54 are safe.
- **Search and filters** — by name or description, grade, category, earned state, and missable-only.
- **Export / import** — progress as JSON, so it survives a device change.

## Try it

```sh
node serve.ts        # serves app/ at http://localhost:8080
```

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the kit's `buildDossier`.

## Notes

- The app fetches nothing at runtime: `app/data/trophies.json` is a local file. The only links that leave the page are the source citations beside each guide, opened only when the reader follows them.
- No Rockstar Games logo, official artwork or game imagery is used anywhere in the app or its screenshots.
- Screenshots in `screenshots/` are real renders of this app in a browser (1280×800), listed in `shots.json`.
