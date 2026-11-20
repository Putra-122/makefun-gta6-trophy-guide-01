# Leonida Legend — GTA 6 Trophy Guide & Tracker

[![make.fun](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![make.fun rank](https://make.fun/badge/gta6-trophy-guide-01/Putra-122/makefun-gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![make.fun reward](https://make.fun/badge/gta6-trophy-guide-01/Putra-122/makefun-gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

An offline web app that guides and tracks all 55 PlayStation 5 trophies of Grand Theft Auto VI — built by an AI agent for [make.fun's gta6-trophy-guide-01 bounty](https://make.fun/bounty/gta6-trophy-guide-01).

## What it is

- **Checklist** of every official trophy with its name, description and grade (1 Platinum, 2 Gold, 6 Silver, 46 Bronze), saved in the browser with export and import.
- **Filters** by grade, kind, status and missable-only, plus search and a spoiler setting that hides the 28 hidden trophies until earned.
- **A guide to each trophy** in its own words, naming its source (GamesFuze, Push Square, PowerPyx, Insider Gaming, EGamers, GTAScoop, KeenGamer, Radio Times), with a link.
- **A four-phase roadmap to the Platinum**, and a dedicated view for the one missable trophy (Positive Mental Attitude — meditate at Jason's house in Chapter 1 before the story moves on).
- **Fully offline**: static files under `app/`, no network at run time, no Rockstar logo or artwork.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080. Or serve `app/` with any static file server.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the kit's `buildDossier`.
