"use strict";

var STORE_KEY = "leonida-legend-v1";
var DATA_URL = "data/trophies.json";

var trophies = [];
var bySlug = {};
var earned = {};
var spoilers = false;
var filters = { q: "", grade: "", category: "", status: "", missableOnly: false };

function slugOf(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function loadStore() {
  try {
    var raw = localStorage.getItem(STORE_KEY);
    if (!raw) return;
    var data = JSON.parse(raw);
    if (data && typeof data === "object") {
      if (data.earned && typeof data.earned === "object") earned = data.earned;
      if (typeof data.spoilers === "boolean") spoilers = data.spoilers;
    }
  } catch (e) { /* a corrupt store is ignored; the guide still works */ }
}

function saveStore() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify({ earned: earned, spoilers: spoilers }));
  } catch (e) { /* storage may be unavailable; the guide still works */ }
}

function isEarned(t) { return !!earned[slugOf(t.name)]; }

function isConcealed(t) {
  return t.hidden && !spoilers && !isEarned(t);
}

function visibleName(t) { return isConcealed(t) ? "Hidden Trophy" : t.name; }

function gradeLabel(g) {
  return g.charAt(0).toUpperCase() + g.slice(1);
}

function el(tag, cls, text) {
  var n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined && text !== null) n.textContent = text;
  return n;
}

function trophyCard(t) {
  var li = el("li", "card" + (isEarned(t) ? " earned" : ""));
  var head = el("div", "card-head");
  var badge = el("span", "badge grade-" + t.grade, gradeLabel(t.grade));
  head.appendChild(badge);
  if (t.missable) head.appendChild(el("span", "tag-missable", "Missable"));
  if (t.hidden) head.appendChild(el("span", "tag-hidden", "Hidden"));
  li.appendChild(head);

  var name = el("h2", "card-name", visibleName(t));
  li.appendChild(name);
  li.appendChild(el("p", "card-desc", isConcealed(t) ? "Hidden on PlayStation until earned. Turn on spoilers to reveal it." : t.description));

  var row = el("div", "card-row");
  var toggle = el("button", "earn-btn", isEarned(t) ? "Earned ✓" : "Mark earned");
  toggle.type = "button";
  toggle.setAttribute("aria-pressed", isEarned(t) ? "true" : "false");
  toggle.addEventListener("click", function (ev) {
    ev.stopPropagation();
    var s = slugOf(t.name);
    if (earned[s]) delete earned[s]; else earned[s] = true;
    saveStore();
    render();
  });
  row.appendChild(toggle);
  var open = el("a", "guide-link", "Guide →");
  open.href = "#/trophy/" + slugOf(t.name);
  row.appendChild(open);
  li.appendChild(row);
  return li;
}

function applyFilters(list) {
  var q = filters.q.trim().toLowerCase();
  return list.filter(function (t) {
    if (filters.grade && t.grade !== filters.grade) return false;
    if (filters.category && t.category !== filters.category) return false;
    if (filters.status === "earned" && !isEarned(t)) return false;
    if (filters.status === "unearned" && isEarned(t)) return false;
    if (filters.missableOnly && !t.missable) return false;
    if (q) {
      if (isConcealed(t)) return false;
      var hay = (t.name + " " + t.description + " " + t.guide).toLowerCase();
      if (hay.indexOf(q) === -1) return false;
    }
    return true;
  });
}

function renderProgress() {
  var n = trophies.filter(isEarned).length;
  document.getElementById("earned-count").textContent = String(n);
  document.getElementById("progress-fill").style.width = (trophies.length ? (n / trophies.length * 100) : 0) + "%";
  var grades = ["platinum", "gold", "silver", "bronze"];
  var wrap = document.getElementById("progress-grades");
  wrap.textContent = "";
  grades.forEach(function (g) {
    var total = trophies.filter(function (t) { return t.grade === g; }).length;
    var got = trophies.filter(function (t) { return t.grade === g && isEarned(t); }).length;
    wrap.appendChild(el("span", "grade-count", gradeLabel(g) + " " + got + "/" + total));
  });
}

function renderList() {
  var list = document.getElementById("list");
  list.textContent = "";
  var shown = applyFilters(trophies);
  shown.forEach(function (t) { list.appendChild(trophyCard(t)); });
  document.getElementById("empty").hidden = shown.length !== 0;
}

function renderDetail(slug) {
  var box = document.getElementById("detail");
  box.textContent = "";
  var t = bySlug[slug];
  if (!t) {
    box.appendChild(el("p", null, "That trophy was not found. "));
    var back = el("a", null, "Back to the checklist");
    back.href = "#/";
    box.appendChild(back);
    return;
  }
  var idx = trophies.indexOf(t);
  var back = el("a", "back-link", "← Back to checklist");
  back.href = "#/";
  box.appendChild(back);

  box.appendChild(el("h2", "detail-name", visibleName(t)));
  var meta = el("p", "detail-meta");
  meta.appendChild(el("span", "badge grade-" + t.grade, gradeLabel(t.grade)));
  if (t.missable) meta.appendChild(el("span", "tag-missable", "Missable"));
  if (t.hidden) meta.appendChild(el("span", "tag-hidden", "Hidden"));
  meta.appendChild(el("span", "detail-cat", "Category: " + t.category));
  box.appendChild(meta);
  box.appendChild(el("p", "detail-desc", isConcealed(t) ? "Hidden on PlayStation until earned. Turn on spoilers to reveal it." : t.description));

  if (isConcealed(t)) {
    var reveal = el("button", "reveal-btn", "Reveal this spoiler");
    reveal.type = "button";
    reveal.addEventListener("click", function () {
      spoilers = true;
      document.getElementById("spoiler-toggle").checked = true;
      saveStore();
      render();
    });
    box.appendChild(reveal);
  } else {
    box.appendChild(el("h3", "detail-h", "How to unlock it"));
    box.appendChild(el("p", "detail-guide", t.guide));
    var src = el("p", "detail-source", "Source: ");
    var a = el("a", null, t.source);
    a.href = t.source_url;
    a.target = "_blank";
    a.rel = "noopener";
    src.appendChild(a);
    box.appendChild(src);
  }

  var toggle = el("button", "earn-btn big", isEarned(t) ? "Earned ✓ — tap to unmark" : "Mark earned");
  toggle.type = "button";
  toggle.addEventListener("click", function () {
    var s = slugOf(t.name);
    if (earned[s]) delete earned[s]; else earned[s] = true;
    saveStore();
    render();
  });
  box.appendChild(toggle);

  var nav = el("div", "detail-nav");
  if (idx > 0) {
    var prev = el("a", null, "← " + visibleName(trophies[idx - 1]));
    prev.href = "#/trophy/" + slugOf(trophies[idx - 1].name);
    nav.appendChild(prev);
  }
  if (idx < trophies.length - 1) {
    var next = el("a", null, visibleName(trophies[idx + 1]) + " →");
    next.href = "#/trophy/" + slugOf(trophies[idx + 1].name);
    nav.appendChild(next);
  }
  box.appendChild(nav);
}

var PHASES = [
  { n: 1, title: "Play the story", cats: ["story"],
    text: "Finish all five chapters. Twelve trophies unlock from the story alone, and the credits open the 100% checklist. Before Chapter 1 ends, meditate at Jason's house — the one spot for Positive Mental Attitude that may not come back." },
  { n: 2, title: "Strangers and side stories", cats: ["strangers"],
    text: "Clear the eight Strangers and Freaks strands. Andy, Kenton, Billy, Randy and Tyrone each end with a final-mission trophy, and Bret's strand feeds the 100% checklist, so finish these before the long cleanup." },
  { n: 3, title: "Activities and crime cleanup", cats: ["activities", "crime"],
    text: "The grind phase: 250 stunts, 42 shooting-range golds, 14 drone races, 20 race wins, 50 challenges — and the crime set: five bank vaults, an armored truck, a jewelry store unseen, three shops in a row and one illegal operation per gang." },
  { n: 4, title: "Collectibles and 100%", cats: ["collectibles", "misc", "completion", "platinum"],
    text: "Three card sets, 100 WAiNK scans, 100 vehicles, every garage, $100,000 spent, $250,000 laundered — then the 100% Completion Checklist itself. A Long Road is the last Gold; the Platinum follows the moment it pops." }
];

function renderRoadmap() {
  var box = document.getElementById("roadmap");
  box.textContent = "";
  box.appendChild(el("h2", null, "Road to the Platinum"));
  box.appendChild(el("p", null, "About 200 hours in four phases: story, then strangers, then the activities and crime grind, then collectibles and the 100% checklist. Cheats disable trophies — save them until everything is done."));
  PHASES.forEach(function (ph) {
    var card = el("section", "phase");
    var items = trophies.filter(function (t) { return ph.cats.indexOf(t.category) !== -1; });
    var got = items.filter(isEarned).length;
    card.appendChild(el("h3", null, "Phase " + ph.n + " — " + ph.title + " (" + got + "/" + items.length + ")"));
    card.appendChild(el("p", null, ph.text));
    var ul = el("ul", "phase-list");
    items.forEach(function (t) {
      var li = el("li", isEarned(t) ? "done" : "");
      var a = el("a", null, (isEarned(t) ? "✓ " : "") + visibleName(t));
      a.href = "#/trophy/" + slugOf(t.name);
      li.appendChild(a);
      ul.appendChild(li);
    });
    card.appendChild(ul);
    box.appendChild(card);
  });
}

function renderMissable() {
  var box = document.getElementById("missable");
  box.textContent = "";
  box.appendChild(el("h2", null, "Missable trophies"));
  var miss = trophies.filter(function (t) { return t.missable; });
  if (miss.length === 0) {
    box.appendChild(el("p", null, "No missable trophies are listed."));
  } else {
    box.appendChild(el("p", null, "Only one trophy in the whole list is reported as possibly missable. Everything else can be earned after the story, in free roam."));
    miss.forEach(function (t) {
      var card = el("article", "miss-card");
      card.appendChild(el("h3", null, t.name));
      card.appendChild(el("p", null, t.description));
      card.appendChild(el("p", null, t.guide));
      var a = el("a", null, "Open the guide →");
      a.href = "#/trophy/" + slugOf(t.name);
      card.appendChild(a);
      box.appendChild(card);
    });
  }
  var safe = el("p", "safe-note", "Safe: the other 54 trophies cannot be missed. There is no mission replay and no mission medals, and one playthrough is enough.");
  box.appendChild(safe);
}

function currentView() {
  var h = location.hash || "#/";
  if (h.indexOf("#/trophy/") === 0) return { view: "detail", slug: h.slice(9) };
  if (h === "#/roadmap") return { view: "roadmap" };
  if (h === "#/missable") return { view: "missable" };
  return { view: "checklist" };
}

function render() {
  renderProgress();
  var cur = currentView();
  document.getElementById("detail").hidden = cur.view !== "detail";
  document.getElementById("roadmap").hidden = cur.view !== "roadmap";
  document.getElementById("missable").hidden = cur.view !== "missable";
  document.getElementById("list").hidden = cur.view !== "checklist";
  document.querySelectorAll(".view-btn").forEach(function (b) {
    b.classList.toggle("active", b.getAttribute("data-view") === cur.view ||
      (cur.view === "detail" && b.getAttribute("data-view") === "checklist"));
  });
  if (cur.view === "detail") renderDetail(cur.slug);
  if (cur.view === "roadmap") renderRoadmap();
  if (cur.view === "missable") renderMissable();
  if (cur.view === "checklist") renderList();
}

function bindControls() {
  document.getElementById("search").addEventListener("input", function (e) {
    filters.q = e.target.value;
    if (currentView().view === "checklist") renderList();
  });
  document.getElementById("grade-filter").addEventListener("change", function (e) {
    filters.grade = e.target.value;
    if (currentView().view === "checklist") renderList();
  });
  document.getElementById("category-filter").addEventListener("change", function (e) {
    filters.category = e.target.value;
    if (currentView().view === "checklist") renderList();
  });
  document.getElementById("status-filter").addEventListener("change", function (e) {
    filters.status = e.target.value;
    if (currentView().view === "checklist") renderList();
  });
  document.getElementById("missable-only").addEventListener("change", function (e) {
    filters.missableOnly = e.target.checked;
    if (currentView().view === "checklist") renderList();
  });
  document.getElementById("spoiler-toggle").addEventListener("change", function (e) {
    spoilers = e.target.checked;
    saveStore();
    render();
  });
  document.querySelectorAll(".view-btn").forEach(function (b) {
    b.addEventListener("click", function () {
      location.hash = "#/" + (b.getAttribute("data-view") === "checklist" ? "" : b.getAttribute("data-view"));
    });
  });
  document.getElementById("export-btn").addEventListener("click", function () {
    var blob = new Blob([JSON.stringify({ earned: earned, spoilers: spoilers }, null, 2)], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "leonida-legend-progress.json";
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  });
  document.getElementById("import-file").addEventListener("change", function (e) {
    var f = e.target.files && e.target.files[0];
    if (!f) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var data = JSON.parse(String(reader.result));
        if (data && typeof data.earned === "object") {
          earned = {};
          Object.keys(data.earned).forEach(function (k) { if (bySlug[k]) earned[k] = true; });
          if (typeof data.spoilers === "boolean") {
            spoilers = data.spoilers;
            document.getElementById("spoiler-toggle").checked = spoilers;
          }
          saveStore();
          render();
        }
      } catch (err) { /* a bad file is ignored */ }
      e.target.value = "";
    };
    reader.readAsText(f);
  });
  document.getElementById("reset-btn").addEventListener("click", function () {
    earned = {};
    saveStore();
    render();
  });
  window.addEventListener("hashchange", render);
}

function applyQueryPreset() {
  var q = new URLSearchParams(location.search);
  var g = q.get("grade");
  if (g && ["platinum", "gold", "silver", "bronze"].indexOf(g) !== -1) {
    filters.grade = g;
    document.getElementById("grade-filter").value = g;
  }
  var v = q.get("view");
  if (v === "roadmap" || v === "missable") location.hash = "#/" + v;
  var t = q.get("trophy");
  if (t && bySlug[t]) location.hash = "#/trophy/" + t;
}

loadStore();
document.getElementById("spoiler-toggle").checked = spoilers;
bindControls();
fetch(DATA_URL).then(function (r) { return r.json(); }).then(function (data) {
  trophies = data.trophies || data;
  trophies.forEach(function (t) { bySlug[slugOf(t.name)] = t; });
  applyQueryPreset();
  render();
}).catch(function () {
  document.getElementById("list").textContent = "";
  document.getElementById("empty").hidden = false;
  document.getElementById("empty").textContent = "The trophy data could not be loaded. Check that data/trophies.json sits beside this page.";
});
