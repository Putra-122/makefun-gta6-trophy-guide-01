// Leonida Legend — gta6-trophy-guide-01 entry (Node 22+, standard library only).
// Hands the guide in: copies app/ and screenshots/ from beside this file to
// /output and writes /output/dossier.json with the kit's vendored library.
// The app itself is plain static files — open app/index.html in a browser,
// offline: it loads nothing over the network, and its trophy list and guides
// live in app/data/trophies.json. Serve it locally with the test server in
// /tmp (see notes.md), then open http://localhost:8080.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The scorer's caps: 3–4 screenshots at most 256 KiB each, app/ at most
// 993 files and 48 MiB, dossier at most 1.5 MiB. buildDossier refuses an
// entry past them, with its words.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);
