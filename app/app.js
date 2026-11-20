// Leonida Legend — offline GTA 6 trophy guide and tracker.
// Loads data/trophies.json once, keeps progress in localStorage, renders
// the checklist, the trophy detail pages, the platinum roadmap and the
// missable view from the hash route. No network at run time.

const DATA_URL = "data/trophies.json";
const EARNED_KEY = "leonida-legend-earned-v1";
const SPOILER_KEY = "leonida-legend-spoilers-v1";

const GRADES = ["Platinum", "Gold", "Silver", "Bronze"];

const ROADMAP = [
  {
    title: "Phase 1 — Play the story",
    text: "Finish all five chapters. Twelve trophies unlock from the story alone, and the credits open the 100% checklist. Before Chapter 1 ends, meditate at Jason's house — the one spot for Positive Mental Attitude that may not come back.",
    names: ["Just Like Paradise", "Paradise Lost", "T**s Ass Drug Money", "Vice City, Baby!", "Top Of The World, Ma", "You Gotta Know When to Get Off", "Trust", "Break the Bank", "Family Matters", "DWNFALL", "Hi-Jacked", "Snow Storm", "Positive Mental Attitude"]
  },
  {
    title: "Phase 2 — Strangers",
    text: "Finish the stranger strands. Eight strands earn the Silver Strangers & Freaks, and Andy, Kenton, Billy, Randy and Tyrone each have their own final-mission trophy. New strands unlock as the story moves on, so check the stranger markers after each chapter.",
    names: ["Strangers & Freaks", "Road to Rehabilitation", "This Was No Boat Accident", "The Lone Rider", "Supply & Demand", "Spin On This!", "Fair Game"]
  },
  {
    title: "Phase 3 — Activities and crime",
    text: "The long grinds: 250 stunts, gold in all 42 shooting range challenges, drone races at all 14 spots, 20 races, and the crime tallies with your partner — 5 bank vaults, an armored truck, a jewelry store without being seen, 3 shops in a row, and an illegal operation from every gang.",
    names: ["Cunning Stunts", "The Shootist", "Top Fun", "Earn Cash, Not Kudos", "Baited My Tackle", "Stick Fiddler", "Master of None", "One Last Thing", "Maximum Withdrawal", "Sneakthief", "A Classic Blitz Play", "Pest Control", "Hot Together", "Retail Therapy", "Gunslinger", "Catch Me If You Can", "Capital Offense", "Let's Go Bowling", "Ten Pin"]
  },
  {
    title: "Phase 4 — Collectibles and 100%",
    text: "Finish the collections — 3 card sets, 100 WAiNK scans, 100 discovered vehicles, every garage, $100,000 spent and $250,000 laundered — then clear the 100% checklist for A Long Road. That pops the Platinum, Vice Got a Price!. Cheats disable trophies, so save them until everything is done.",
    names: ["Don't Touch My Deck", "You WAiNKer!", "Whip It Good", "Little Boxes", "On the Spot", "Dime on the Dollar", "Treat Yo Self", "The Goodtime State", "In The Beginning…", "Challenging Tank", "Personal Best", "Actions Speak Louder", "Bad Luck, I Guess", "The Truth Is Out There", "A Long Road", "Vice Got a Price!"]
  }
];

let trophies = [];
let earned = new Set();
let spoilers = false;

const byName = new Map();
const bySlug = new Map();

function slugOf(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function loadSaved() {
  try {
    earned = new Set(JSON.parse(localStorage.getItem(EARNED_KEY) || "[]"));
  } catch (_) {
    earned = new Set();
  }
  spoilers = localStorage.getItem(SPOILER_KEY) === "1";
}

function saveEarned() {
  localStorage.setItem(EARNED_KEY, JSON.stringify([...earned]));
}

function saveSpoilers() {
  localStorage.setItem(SPOILER_KEY, spoilers ? "1" : "0");
}

function isEarned(t) {
  return earned.has(slugOf(t.name));
}

function isConcealed(t) {
  return t.hidden && !isEarned(t) && !spoilers;
}

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function gradeBadge(t) {
  return `<span class="badge badge-${t.grade.toLowerCase()}">${esc(t.grade)}</span>`;
}

function targetLine(t) {
  return t.target ? `<span class="target">Target: ${Number(t.target).toLocaleString("en-US")}</span>` : "";
}

function kindLabel(kind) {
  return kind.charAt(0).toUpperCase() + kind.slice(1);
}

function cardHtml(t) {
  const slug = slugOf(t.name);
  const done = isEarned(t);
  const hidden = isConcealed(t);
  const name = hidden ? "Hidden Trophy" : esc(t.name);
  const desc = hidden ? "Hidden until earned." : esc(t.description);
  const flags = [
    t.missable ? `<span class="flag flag-missable">Missable</span>` : "",
    hidden ? `<span class="flag flag-hidden">Hidden</span>` : ""
  ].join(" ");
  return `<article class="card${done ? " is-earned" : ""}" data-slug="${slug}">
    <div class="card-top">${gradeBadge(t)}<span class="kind">${esc(kindLabel(t.kind))}</span>${flags}</div>
    <h3>${name}</h3>
    <p class="desc">${desc}</p>
    <p class="meta">${targetLine(t)}</p>
    <div class="card-actions">
      <button type="button" data-toggle="${slug}">${done ? "Earned ✓" : "Mark earned"}</button>
      <a class="guide-link" href="#/trophy/${slug}">Guide →</a>
    </div>
  </article>`;
}

function readFilters() {
  return {
    q: document.getElementById("search").value.trim().toLowerCase(),
    grade: document.getElementById("filter-grade").value,
    kind: document.getElementById("filter-kind").value,
    status: document.getElementById("filter-status").value,
    missableOnly: document.getElementById("filter-missable").checked
  };
}

function applyFilters(list, f) {
  return list.filter((t) => {
    if (f.grade && t.grade !== f.grade) return false;
    if (f.kind && t.kind !== f.kind) return false;
    if (f.status === "earned" && !isEarned(t)) return false;
    if (f.status === "unearned" && isEarned(t)) return false;
    if (f.missableOnly && !t.missable) return false;
    if (f.q) {
      const hay = (t.name + " " + t.description + " " + t.kind).toLowerCase();
      if (!hay.includes(f.q)) return false;
    }
    return true;
  });
}

function renderProgress() {
  const n = earned.size;
  document.getElementById("earned-count").textContent = String(n);
  document.getElementById("progress-fill").style.width = (n / trophies.length * 100) + "%";
  document.getElementById("grade-counts").innerHTML = GRADES.map((g) => {
    const total = trophies.filter((t) => t.grade === g).length;
    const got = trophies.filter((t) => t.grade === g && isEarned(t)).length;
    return `<span>${g} ${got}/${total}</span>`;
  }).join(" ");
}

function renderChecklist() {
  const f = readFilters();
  const list = applyFilters(trophies, f);
  const el = document.getElementById("results");
  el.innerHTML = list.length
    ? `<p class="count-line">Showing ${list.length} of ${trophies.length} trophies.</p><div class="grid">${list.map(cardHtml).join("")}</div>`
    : `<p class="empty">No trophies match these filters. <button type="button" id="clear-filters">Clear filters</button></p>`;
  const clear = document.getElementById("clear-filters");
  if (clear) clear.addEventListener("click", () => {
    document.getElementById("search").value = "";
    document.getElementById("filter-grade").value = "";
    document.getElementById("filter-kind").value = "";
    document.getElementById("filter-status").value = "";
    document.getElementById("filter-missable").checked = false;
    render();
  });
}

function trophyListHtml(names) {
  return `<ul class="phase-list">${names.map((name) => {
    const t = byName.get(name);
    if (!t) return "";
    const slug = slugOf(t.name);
    const shown = isConcealed(t) ? "Hidden Trophy" : esc(t.name);
    return `<li class="${isEarned(t) ? "is-earned" : ""}">${gradeBadge(t)} <a href="#/trophy/${slug}">${shown}</a>${t.missable ? ` <span class="flag flag-missable">Missable</span>` : ""}</li>`;
  }).join("")}</ul>`;
}

function renderRoadmap() {
  const el = document.getElementById("results");
  el.innerHTML = `<div class="roadmap">
    <h2>Road to the Platinum</h2>
    <p>About 200 hours in four phases: story, then strangers, then the activities and crime grind, then collectibles and the 100% checklist. Cheats disable trophies — save them until everything is done.</p>
    ${ROADMAP.map((p, i) => `<section class="phase">
      <h3>${esc(p.title)} <span class="phase-count">(${p.names.filter((n) => byName.get(n) && isEarned(byName.get(n))).length}/${p.names.length})</span></h3>
      <p>${esc(p.text)}</p>
      ${trophyListHtml(p.names)}
    </section>`).join("")}
  </div>`;
}

function renderMissable() {
  const el = document.getElementById("results");
  const missable = trophies.filter((t) => t.missable);
  el.innerHTML = `<div class="missable">
    <h2>Missable trophies</h2>
    <p>Only one trophy is flagged as possibly missable by the published guides. Everything else can be earned after the story in free roam.</p>
    <div class="grid">${missable.map(cardHtml).join("")}</div>
    <p class="missable-note">The one spot to watch is at Jason's house in Chapter 1: meditate there before the story moves past it. Every other meditation spot stays open all game.</p>
  </div>`;
}

function renderDetail(slug) {
  const t = bySlug.get(slug);
  const el = document.getElementById("results");
  if (!t) {
    el.innerHTML = `<p class="empty">No trophy with that name. <a href="#/">Back to checklist</a></p>`;
    return;
  }
  const idx = trophies.indexOf(t);
  const prev = trophies[(idx - 1 + trophies.length) % trophies.length];
  const next = trophies[(idx + 1) % trophies.length];
  const hidden = isConcealed(t);
  el.innerHTML = `<div class="detail">
    <p><a href="#/" class="back-link">← Back to checklist</a></p>
    <div class="detail-head">${gradeBadge(t)}<span class="kind">${esc(kindLabel(t.kind))}</span>${t.missable ? `<span class="flag flag-missable">Missable</span>` : ""}${hidden ? `<span class="flag flag-hidden">Hidden</span>` : ""}</div>
    <h2>${hidden ? "Hidden Trophy" : esc(t.name)}</h2>
    <p class="desc">${hidden ? "Hidden until earned." : esc(t.description)}</p>
    ${targetLine(t) ? `<p class="meta">${targetLine(t)}</p>` : ""}
    <h3>How to unlock it</h3>
    ${hidden
      ? `<p>This trophy is hidden on PlayStation until earned. Turn on “Show spoilers (hidden trophies)” in the filters, or earn it, to see its guide.</p>`
      : `<p class="guide-text">${esc(t.guide)}</p>
         <p class="source-line">Source: <a href="${t.source_url}" target="_blank" rel="noopener">${esc(t.source)}</a></p>`}
    <div class="detail-actions">
      <button type="button" data-toggle="${slugOf(t.name)}">${isEarned(t) ? "Earned ✓" : "Mark earned"}</button>
    </div>
    <nav class="prev-next">
      <a href="#/trophy/${slugOf(prev.name)}">← ${isConcealed(prev) ? "Hidden Trophy" : esc(prev.name)}</a>
      <a href="#/trophy/${slugOf(next.name)}">${isConcealed(next) ? "Hidden Trophy" : esc(next.name)} →</a>
    </nav>
  </div>`;
}

function parseHash() {
  const raw = location.hash.replace(/^#\/?/, "");
  if (raw.startsWith("trophy/")) return { route: "detail", slug: raw.slice("trophy/".length) };
  if (raw === "roadmap") return { route: "roadmap" };
  if (raw === "missable") return { route: "missable" };
  if (raw.startsWith("?")) {
    const params = new URLSearchParams(raw.slice(1));
    return { route: "checklist", preset: params };
  }
  return { route: "checklist" };
}

function applyPreset(preset) {
  if (!preset) return;
  const grade = preset.get("grade");
  if (grade && GRADES.includes(grade)) document.getElementById("filter-grade").value = grade;
  const kind = preset.get("kind");
  if (kind) document.getElementById("filter-kind").value = kind;
}

function setTab(route) {
  for (const tab of document.querySelectorAll("[data-tab]")) {
    tab.classList.toggle("active", tab.dataset.tab === route);
  }
}

function render() {
  const parsed = parseHash();
  const toolbar = document.querySelector(".toolbar");
  toolbar.style.display = parsed.route === "checklist" ? "" : "none";
  setTab(parsed.route === "detail" ? "checklist" : parsed.route);
  if (parsed.route === "checklist") {
    if (parsed.preset) applyPreset(parsed.preset);
    renderChecklist();
  } else if (parsed.route === "roadmap") {
    renderRoadmap();
  } else if (parsed.route === "missable") {
    renderMissable();
  } else {
    renderDetail(parsed.slug);
  }
  renderProgress();
}

function fillKindFilter() {
  const kinds = [...new Set(trophies.map((t) => t.kind))].sort();
  const sel = document.getElementById("filter-kind");
  for (const k of kinds) {
    const opt = document.createElement("option");
    opt.value = k;
    opt.textContent = kindLabel(k);
    sel.appendChild(opt);
  }
}

function exportProgress() {
  const blob = new Blob([JSON.stringify({ earned: [...earned].sort() }, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "leonida-legend-progress.json";
  a.click();
  URL.revokeObjectURL(a.href);
}

function importProgress(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(String(reader.result));
      const list = Array.isArray(data) ? data : data.earned;
      if (!Array.isArray(list)) throw new Error("bad file");
      const valid = new Set(trophies.map((t) => slugOf(t.name)));
      earned = new Set(list.filter((s) => valid.has(s)));
      saveEarned();
      render();
    } catch (_) {
      alert("That file is not a Leonida Legend progress export.");
    }
  };
  reader.readAsText(file);
}

async function init() {
  loadSaved();
  const res = await fetch(DATA_URL);
  const data = await res.json();
  trophies = data.trophies || data;
  for (const t of trophies) {
    byName.set(t.name, t);
    bySlug.set(slugOf(t.name), t);
  }
  fillKindFilter();
  document.getElementById("spoilers").checked = spoilers;
  for (const id of ["search", "filter-grade", "filter-kind", "filter-status"]) {
    document.getElementById(id).addEventListener("input", render);
  }
  document.getElementById("filter-missable").addEventListener("change", render);
  document.getElementById("spoilers").addEventListener("change", (e) => {
    spoilers = e.target.checked;
    saveSpoilers();
    render();
  });
  document.getElementById("export-btn").addEventListener("click", exportProgress);
  document.getElementById("import-btn").addEventListener("click", () => document.getElementById("import-file").click());
  document.getElementById("import-file").addEventListener("change", (e) => {
    if (e.target.files[0]) importProgress(e.target.files[0]);
    e.target.value = "";
  });
  document.getElementById("reset-btn").addEventListener("click", () => {
    if (confirm("Clear all earned trophies?")) {
      earned = new Set();
      saveEarned();
      render();
    }
  });
  document.getElementById("results").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-toggle]");
    if (!btn) return;
    const slug = btn.dataset.toggle;
    if (earned.has(slug)) earned.delete(slug);
    else earned.add(slug);
    saveEarned();
    render();
  });
  window.addEventListener("hashchange", render);
  render();
}

init();
