// Leonida Legend — GTA VI trophy guide & tracker (offline, no network).
// Loads app/data/trophies.json, keeps progress in localStorage only.

const STORE_KEY = 'gta6-trophy-progress-v1';
const SPOILER_KEY = 'gta6-trophy-spoilers-v1';

const GRADE_LABEL = { platinum: 'Platinum', gold: 'Gold', silver: 'Silver', bronze: 'Bronze' };
const CATEGORY_LABEL = {
  platinum: 'Platinum', story: 'Story', side: 'Stranger strands', activities: 'Activities',
  races: 'Races', collectibles: 'Collectibles', crime: 'Crime', exploration: 'Exploration', money: 'Money'
};

const ROADMAP = [
  {
    phase: 1, title: 'Play the story — enjoy it, miss nothing',
    time: 'First playthrough',
    text: 'Just play. All 12 story trophies (Chapters 1–4, the final mission, and the named missions in between) pop on their own and cannot be missed. When the credits roll you unlock the 100% Completion Checklist and free roam opens up. Do the one thing that matters here: meditate at Jason\u2019s house in Chapter 1 — it is one of the 18 spots for Positive Mental Attitude, the only possibly missable trophy.',
    ids: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
  {
    phase: 2, title: 'Stranger strands & side missions',
    time: 'After the story, or alongside it',
    text: 'Finish every stranger strand: Andy, Kenton, Billy, Randy, Tyrone and Bret, plus 8 strands in total for Strangers & Freaks. Randy\u2019s Wish List vehicles and Tyrone\u2019s Kitty Litter Labs are the two that need a checklist of their own — do them strand by strand, not all at once.',
    ids: [22, 23, 24, 25, 26, 27, 29]
  },
  {
    phase: 3, title: 'Activities, collectibles & the grind',
    time: 'The long middle — 100+ hours',
    text: 'Work the big counters: 250 of 397 stunts, gold in all 42 Shooting Range challenges, 20 different races, 100 WAiNK scans, 3 (then 15) Collectible Card sets, 50 of 80 Challenges, and the money grind — $250,000 laundered, $100,000 spent, all 8 garages. Track everything from Touch Pad > Progress. Do the 18 meditations now if you have not already — Positive Mental Attitude is the only trophy that can slip away.',
    ids: [15, 16, 17, 18, 19, 20, 21, 28, 30, 31, 32, 35, 51, 52, 53, 54, 55]
  },
  {
    phase: 4, title: 'Cleanup & 100% Completion',
    time: 'Endgame',
    text: 'Open the 100% Completion Checklist at Touch Pad > Progress > 100% Completion and work it down: 15 of 18 card sets, 70 of 80 Challenges, and the remaining activities. The last jobs are usually the crime spree trophies (bank vaults, armored trucks, gang operations) and exploring every corner of Leonida. Finish A Long Road and the Platinum — Vice Got a Price! — pops with it.',
    ids: [14, 33, 34, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 1]
  }
];

let DATA = null;
let earned = new Set();
let showSpoilers = false;
let filters = { q: '', grade: 'all', category: 'all', status: 'all', missable: false };

function loadState() {
  try { earned = new Set(JSON.parse(localStorage.getItem(STORE_KEY) || '[]').filter(Number.isInteger)); } catch { earned = new Set(); }
  showSpoilers = localStorage.getItem(SPOILER_KEY) === '1';
}
function saveState() {
  localStorage.setItem(STORE_KEY, JSON.stringify([...earned].sort((a, b) => a - b)));
  localStorage.setItem(SPOILER_KEY, showSpoilers ? '1' : '0');
}
function byId(id) { return DATA.trophies.find((t) => t.id === id); }
function concealed(t) { return t.hidden && !showSpoilers && !earned.has(t.id); }
function esc(s) { return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

function updateProgress() {
  const total = DATA.trophies.length;
  const n = earned.size;
  const pct = Math.round((n / total) * 100);
  document.getElementById('progressText').textContent = `${n} of ${total} earned`;
  document.getElementById('progressPct').textContent = `${pct}%`;
  document.getElementById('progressFill').style.width = `${pct}%`;
  const counts = ['platinum', 'gold', 'silver', 'bronze'].map((g) => {
    const all = DATA.trophies.filter((t) => t.grade === g).length;
    const got = DATA.trophies.filter((t) => t.grade === g && earned.has(t.id)).length;
    return `<span class="grade-count grade-${g}">${GRADE_LABEL[g]} ${got}/${all}</span>`;
  }).join('');
  document.getElementById('gradeCounts').innerHTML = counts;
}

function trophyCard(t) {
  const isEarned = earned.has(t.id);
  const hid = concealed(t);
  const name = hid ? 'Hidden trophy' : esc(t.name);
  const desc = hid ? 'Hidden until earned — turn on “Show spoilers” to reveal it, or earn it in-game.' : esc(t.description);
  const guide = hid ? '' : `<p class="card-guide">${esc(t.guide)}</p><p class="card-source">Source: <a href="${esc(t.sourceUrl)}" target="_blank" rel="noopener">${esc(t.source)}</a></p>`;
  const flags = [
    t.missable ? '<span class="flag flag-missable">⚠ Possibly missable</span>' : '',
    t.hidden ? '<span class="flag flag-hidden">Hidden</span>' : '',
  ].join('');
  return `<article class="card grade-${t.grade} ${isEarned ? 'earned' : ''} ${hid ? 'concealed' : ''}">
    <label class="check"><input type="checkbox" data-earn="${t.id}" ${isEarned ? 'checked' : ''} aria-label="Mark ${esc(t.name)} earned"><span class="checkmark">✓</span></label>
    <div class="card-body">
      <div class="card-top"><span class="grade-badge grade-${t.grade}">${GRADE_LABEL[t.grade]}</span><span class="card-cat">${CATEGORY_LABEL[t.category]}</span>${flags}</div>
      <h3><a href="#/trophy/${t.id}">${name}</a></h3>
      <p class="card-desc">${desc}</p>
      ${guide}
    </div>
  </article>`;
}

function renderChecklist() {
  const q = filters.q.trim().toLowerCase();
  let list = DATA.trophies.filter((t) => {
    if (filters.grade !== 'all' && t.grade !== filters.grade) return false;
    if (filters.category !== 'all' && t.category !== filters.category) return false;
    if (filters.status === 'earned' && !earned.has(t.id)) return false;
    if (filters.status === 'remaining' && earned.has(t.id)) return false;
    if (filters.missable && !t.missable) return false;
    if (q && !(t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.guide.toLowerCase().includes(q))) return false;
    return true;
  });
  const view = document.getElementById('view');
  view.innerHTML = `
    <section class="controls">
      <input id="fSearch" type="search" placeholder="Search trophies, guides…" value="${esc(filters.q)}" aria-label="Search trophies">
      <label>Grade <select id="fGrade">
        ${['all', 'platinum', 'gold', 'silver', 'bronze'].map((g) => `<option value="${g}" ${filters.grade === g ? 'selected' : ''}>${g === 'all' ? 'All grades' : GRADE_LABEL[g]}</option>`).join('')}
      </select></label>
      <label>Kind <select id="fCategory">
        ${['all', ...Object.keys(CATEGORY_LABEL)].map((c) => `<option value="${c}" ${filters.category === c ? 'selected' : ''}>${c === 'all' ? 'All kinds' : CATEGORY_LABEL[c]}</option>`).join('')}
      </select></label>
      <label>Status <select id="fStatus">
        ${['all', 'earned', 'remaining'].map((s) => `<option value="${s}" ${filters.status === s ? 'selected' : ''}>${s === 'all' ? 'All' : s === 'earned' ? 'Earned' : 'Still to earn'}</option>`).join('')}
      </select></label>
      <label class="check-inline"><input id="fMissable" type="checkbox" ${filters.missable ? 'checked' : ''}> Missable only</label>
      <label class="check-inline spoiler"><input id="fSpoilers" type="checkbox" ${showSpoilers ? 'checked' : ''}> Show spoilers (reveals hidden trophies)</label>
      <span class="spacer"></span>
      <button id="btnExport" type="button">Export progress</button>
      <label class="import-btn">Import progress <input id="fileImport" type="file" accept="application/json,.json"></label>
      <button id="btnReset" type="button" class="danger">Reset</button>
    </section>
    <p class="list-meta">${list.length} of ${DATA.trophies.length} trophies shown${showSpoilers ? '' : ' · 28 hidden trophies stay concealed until earned or until spoilers are shown'}.</p>
    <section class="cards">${list.map(trophyCard).join('') || '<p class="empty">No trophies match these filters.</p>'}</section>`;
  document.getElementById('fSearch').addEventListener('input', (e) => { filters.q = e.target.value; rerenderListOnly(); });
  document.getElementById('fGrade').addEventListener('change', (e) => { filters.grade = e.target.value; renderChecklist(); });
  document.getElementById('fCategory').addEventListener('change', (e) => { filters.category = e.target.value; renderChecklist(); });
  document.getElementById('fStatus').addEventListener('change', (e) => { filters.status = e.target.value; renderChecklist(); });
  document.getElementById('fMissable').addEventListener('change', (e) => { filters.missable = e.target.checked; renderChecklist(); });
  document.getElementById('fSpoilers').addEventListener('change', (e) => { showSpoilers = e.target.checked; saveState(); renderChecklist(); });
  document.getElementById('btnExport').addEventListener('click', exportProgress);
  document.getElementById('fileImport').addEventListener('change', importProgress);
  document.getElementById('btnReset').addEventListener('click', () => { if (confirm('Clear all earned trophies in this tracker?')) { earned.clear(); saveState(); updateProgress(); renderChecklist(); } });
  view.querySelectorAll('[data-earn]').forEach((box) => box.addEventListener('change', () => {
    const id = Number(box.dataset.earn);
    if (box.checked) earned.add(id); else earned.delete(id);
    saveState(); updateProgress(); renderChecklist();
  }));
}

function rerenderListOnly() {
  // Re-render only the card list on search keystrokes, keeping focus in the box.
  const q = filters.q.trim().toLowerCase();
  const list = DATA.trophies.filter((t) => {
    if (filters.grade !== 'all' && t.grade !== filters.grade) return false;
    if (filters.category !== 'all' && t.category !== filters.category) return false;
    if (filters.status === 'earned' && !earned.has(t.id)) return false;
    if (filters.status === 'remaining' && earned.has(t.id)) return false;
    if (filters.missable && !t.missable) return false;
    if (q && !(t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.guide.toLowerCase().includes(q))) return false;
    return true;
  });
  const section = document.querySelector('.cards');
  const meta = document.querySelector('.list-meta');
  if (section) section.innerHTML = list.map(trophyCard).join('') || '<p class="empty">No trophies match these filters.</p>';
  if (meta) meta.textContent = `${list.length} of ${DATA.trophies.length} trophies shown.`;
  document.querySelectorAll('[data-earn]').forEach((box) => box.addEventListener('change', () => {
    const id = Number(box.dataset.earn);
    if (box.checked) earned.add(id); else earned.delete(id);
    saveState(); updateProgress(); renderChecklist();
  }));
}

function renderRoadmap() {
  const view = document.getElementById('view');
  view.innerHTML = `
    <section class="roadmap">
      <h2>Road to the Platinum — Vice Got a Price!</h2>
      <p class="roadmap-intro">Four phases, roughly 200–300 hours. The story first, then the stranger strands, then the long activity and collectible grind, and finally the 100% Completion cleanup. One rule covers the whole run: <strong>meditate at Jason&rsquo;s house in Chapter 1</strong> — Positive Mental Attitude is the only trophy that can be missed.</p>
      ${ROADMAP.map((p) => `
        <article class="phase">
          <h3>Phase ${p.phase} — ${esc(p.title)}</h3>
          <p class="phase-time">${esc(p.time)}</p>
          <p>${esc(p.text)}</p>
          <ul class="phase-trophies">${p.ids.map((id) => { const t = byId(id); return `<li><a href="#/trophy/${id}"><span class="grade-badge grade-${t.grade}">${GRADE_LABEL[t.grade]}</span> ${concealed(t) ? 'Hidden trophy' : esc(t.name)}</a>${t.missable ? ' <span class="flag flag-missable">⚠ Missable</span>' : ''}${earned.has(id) ? ' ✓' : ''}</li>`; }).join('')}</ul>
        </article>`).join('')}
      <p class="roadmap-note">Sources: Push Square — GTA 6 Trophy Guide &amp; Roadmap; Insider Gaming — Complete GTA 6 Trophy List. Time estimate 200–300+ hours (Push Square).</p>
    </section>`;
}

function renderMissable() {
  const t = byId(28);
  const view = document.getElementById('view');
  view.innerHTML = `
    <section class="missable">
      <h2>⚠ The one trophy you can miss</h2>
      <p class="missable-intro">Every other trophy can be earned in free roam after the story. This one cannot be relied on later — one of its spots is tied to an early chapter.</p>
      <article class="card grade-bronze ${earned.has(28) ? 'earned' : ''}">
        <label class="check"><input type="checkbox" data-earn="28" ${earned.has(28) ? 'checked' : ''} aria-label="Mark Positive Mental Attitude earned"><span class="checkmark">✓</span></label>
        <div class="card-body">
          <div class="card-top"><span class="grade-badge grade-bronze">Bronze</span><span class="card-cat">Exploration</span><span class="flag flag-missable">⚠ Possibly missable</span></div>
          <h3><a href="#/trophy/28">${esc(t.name)}</a></h3>
          <p class="card-desc">${esc(t.description)}</p>
          <p class="card-guide">${esc(t.guide)}</p>
          <p class="card-source">Source: <a href="${esc(t.sourceUrl)}" target="_blank" rel="noopener">${esc(t.source)}</a></p>
        </div>
      </article>
      <p class="missable-note">Why it can be missed: GTAScoop and PowerPyx both flag Positive Mental Attitude as the only trophy that might be missable — one meditation spot sits at Jason&rsquo;s house in Chapter 1. Meditate there before the story moves on, and finish the other 17 spots whenever you like.</p>
    </section>`;
  view.querySelector('[data-earn]').addEventListener('change', (e) => {
    if (e.target.checked) earned.add(28); else earned.delete(28);
    saveState(); updateProgress(); renderMissable();
  });
}

function renderDetail(id) {
  const t = byId(id);
  const view = document.getElementById('view');
  if (!t) { view.innerHTML = '<p class="empty">No such trophy. <a href="#/">Back to the checklist</a>.</p>'; return; }
  const hid = concealed(t);
  const prev = byId(id - 1);
  const next = byId(id + 1);
  view.innerHTML = `
    <section class="detail">
      <p class="back"><a href="#/">&larr; Back to the checklist</a></p>
      <article class="card grade-${t.grade} ${earned.has(id) ? 'earned' : ''} ${hid ? 'concealed' : ''} detail-card">
        <label class="check"><input type="checkbox" data-earn="${id}" ${earned.has(id) ? 'checked' : ''} aria-label="Mark ${esc(t.name)} earned"><span class="checkmark">✓</span></label>
        <div class="card-body">
          <div class="card-top"><span class="grade-badge grade-${t.grade}">${GRADE_LABEL[t.grade]}</span><span class="card-cat">${CATEGORY_LABEL[t.category]}</span>${t.missable ? '<span class="flag flag-missable">⚠ Possibly missable</span>' : ''}${t.hidden ? '<span class="flag flag-hidden">Hidden</span>' : ''}</div>
          <h2>${hid ? 'Hidden trophy' : esc(t.name)}</h2>
          <p class="card-desc">${hid ? 'Hidden until earned — turn on “Show spoilers” on the checklist to reveal it, or earn it in-game.' : esc(t.description)}</p>
          ${hid ? '' : `<h3>How to get it</h3><p class="card-guide">${esc(t.guide)}</p>
          <p class="card-source">Source: <a href="${esc(t.sourceUrl)}" target="_blank" rel="noopener">${esc(t.source)}</a> — guide text is written for this page; the source is cited, never copied.</p>`}
        </div>
      </article>
      <nav class="prev-next">
        ${prev ? `<a href="#/trophy/${prev.id}">&larr; ${concealed(prev) ? 'Hidden trophy' : esc(prev.name)}</a>` : '<span></span>'}
        ${next ? `<a href="#/trophy/${next.id}">${concealed(next) ? 'Hidden trophy' : esc(next.name)} &rarr;</a>` : '<span></span>'}
      </nav>
    </section>`;
  view.querySelector('[data-earn]').addEventListener('change', (e) => {
    if (e.target.checked) earned.add(id); else earned.delete(id);
    saveState(); updateProgress(); renderDetail(id);
  });
}

function exportProgress() {
  const payload = { app: 'gta6-trophy-guide', version: 1, exportedAt: new Date().toISOString(), earned: [...earned].sort((a, b) => a - b) };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'gta6-trophy-progress.json';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function importProgress(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(String(reader.result));
      const ids = Array.isArray(data) ? data : data.earned;
      if (!Array.isArray(ids)) throw new Error('no earned list');
      const valid = new Set(DATA.trophies.map((t) => t.id));
      const next = new Set(ids.filter((n) => Number.isInteger(n) && valid.has(n)));
      earned = next; saveState(); updateProgress(); renderChecklist();
      alert(`Imported ${next.size} earned trophies.`);
    } catch { alert('That file is not a valid progress export.'); }
    event.target.value = '';
  };
  reader.readAsText(file);
}

function parseHash() {
  const raw = location.hash.replace(/^#/, '');
  const [pathPart, queryPart] = raw.split('?');
  const params = new URLSearchParams(queryPart || '');
  return { path: pathPart || '/', params };
}

function route() {
  const { path, params } = parseHash();
  document.querySelectorAll('.tab').forEach((el) => el.classList.remove('active'));
  if (params.get('grade')) filters.grade = params.get('grade');
  if (params.get('category')) filters.category = params.get('category');
  if (params.get('spoiler') === 'on') { showSpoilers = true; saveState(); }
  if (params.get('spoiler') === 'off') { showSpoilers = false; saveState(); }
  if (path === '/' || path === '') { document.getElementById('tabChecklist').classList.add('active'); renderChecklist(); }
  else if (path === '/roadmap') { document.getElementById('tabRoadmap').classList.add('active'); renderRoadmap(); }
  else if (path === '/missable') { document.getElementById('tabMissable').classList.add('active'); renderMissable(); }
  else if (path.startsWith('/trophy/')) { renderDetail(Number(path.split('/')[2])); }
  else { document.getElementById('tabChecklist').classList.add('active'); renderChecklist(); }
  window.scrollTo(0, 0);
}

async function main() {
  loadState();
  const res = await fetch('data/trophies.json');
  DATA = await res.json();
  updateProgress();
  window.addEventListener('hashchange', route);
  route();
}

main();
