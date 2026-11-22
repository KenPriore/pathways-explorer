"use strict";

const {worlds, axes, years} = window.PATHWAYS;
const root = document.querySelector("main");
const worldTabs = [
  ["overview", "Overview"], ["timeline", "Timeline"], ["signals", "Signals"], ["route", "Route map"]
];
let mapObserver;

const safe = (value = "") => String(value).replace(/[&<>"']/g, character => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[character]));
const num = value => String(value).padStart(2, "0");
const tone = world => `style="--tone:${world.tone};--tone-ink:${world.ink}"`;
const worldLink = (id, tab = "overview") => `#world/${id}/${tab}`;

const active = selected => selected ? ' aria-current="page"' : "";
const list = entries => `<ul class="plain-list">${entries.map(entry => `<li>${safe(entry)}</li>`).join("")}</ul>`;
const quote = text => text ? `<blockquote class="quote">“${safe(text)}”</blockquote>` : "";

const definitions = {
  // Definitions follow the Pathways book's three uncertainty panels.
  "Integrated": "Connected, standards-based systems share data across the company, law firms, providers, and legal institutions.",
  "Fragmented": "Specialist tools work together through interfaces and shared standards. The value comes from choosing and combining them.",
  // This axis is about who controls how legal work runs, not who built the software.
  "Enterprise-led": "The company controls how legal work runs: the data, the playbooks, the workflows, and the rules. It builds its own systems or directs providers on its terms. The test: if the company fired the vendor tomorrow, it would keep all of them.",
  "Provider-led": "Law firms, legal tech companies, ALSPs, and big tech run the systems, and legal depends on them. If the company fired the provider tomorrow, the provider would keep the playbooks, the data, and the workflows. The same tool can sit in either world. What decides it is who runs the tool.",
  "Algorithm-led": "Automated systems resolve or carry out most legal work. People set the parameters and handle exceptions after the system has shaped the answer.",
  "Human-led": "Technology still does much of the work, but people keep authority over high-stakes judgment and can inspect, challenge, and override the machine."
};

// Reader-facing names: the same plain verbs as the route map, so no world reads as two "-led"s
// competing ("Provider-led" + "Human-led"). Tooltips carry the definition only.
const display = {
  "Integrated": "Integrated", "Fragmented": "Fragmented",
  "Enterprise-led": "Company drives", "Provider-led": "Providers run",
  "Algorithm-led": "Systems decide", "Human-led": "People decide"
};
function term(label, classes = "") {
  const tipText = definitions[label];
  return `<button class="axis-term ${classes}" type="button" data-term="${safe(label)}" aria-description="${safe(tipText)}">${safe(display[label] || label)}</button>`;
}

const symbols = {
  1: '<rect x="10" y="3" width="12" height="8" rx="1"/><path d="M16 11v6M5 21v-4h22v4"/><rect x="2" y="21" width="7" height="7" rx="1"/><rect x="12.5" y="21" width="7" height="7" rx="1"/><rect x="23" y="21" width="7" height="7" rx="1"/>',
  2: '<rect x="3" y="3" width="10" height="10" rx="2"/><rect x="3" y="19" width="10" height="10" rx="2"/><rect x="19" y="19" width="10" height="10" rx="2"/><path d="M24 2v12m-6-6h12"/>',
  3: '<path d="M3 11 16 4l13 7H3Zm5 3v6m8-6v6m8-6v6M4 23h24M4 28h24"/>',
  4: '<circle cx="16" cy="16" r="13"/><circle cx="16" cy="16" r="3"/><path d="m4 12 9 3m15-3-9 3m-3 4v10"/>'
};
function worldIcon(world) {
  return `<svg class="world-icon" aria-hidden="true" focusable="false" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${symbols[world.id]}</svg>`;
}

function worldCard(world) {
  return `<article class="world-card" ${tone(world)}>
    <div class="card-banner"><span>WORLD ${num(world.id)}</span>${worldIcon(world)}</div>
    <div class="card-content">
      <h3><a href="${worldLink(world.id)}">${safe(world.name)}</a></h3><p>${safe(world.premise)}</p>
      <div class="badges">${world.labels.map(label => term(label, "badge")).join("")}</div>
    </div>
    <div class="world-card-footer">Explore world</div>
  </article>`;
}

// The hero (title + scenario map) tops both the home page and Compare.
function heroSection({onCompare = false} = {}) {
  // No hero buttons on either page; the top bar has Worlds and Compare. Compare keeps the tighter band (.hero--compact).
  return `<section class="hero${onCompare ? " hero--compact" : ""}">
    <div class="wrap hero-inner">
      <div>
        <h1>The Future<br>of Law to <span>2040</span></h1>
        <p class="intro">Four possible worlds for legal work in 2040. Each one gives a different answer to the same three open questions: <span class="q q1">whether legal technology connects into shared systems or stays a kit of specialist tools</span>, <span class="q q2">whether the company or its outside providers drive the change</span>, and <span class="q q3">whether systems or people make the final call</span>.</p>
      </div>
      <figure class="hero-map">
        <figcaption class="map-caption"><span>Scenario map</span><span>2026 to 2040</span></figcaption>
        <div class="signal-map">
          <canvas aria-hidden="true"></canvas>
          <div class="map-origin">TODAY</div>
          <div class="map-ends">${worlds.map(world => `<a href="${worldLink(world.id)}" style="--track:${world.track}"><b>${num(world.id)}</b><span>${safe(world.name)}</span></a>`).join("")}</div>
        </div>
      </figure>
    </div>
  </section>${onCompare ? "" : window.AssumptionsStrip?.html() ?? ""}`;
}

function startMap() {
  const map = root.querySelector(".signal-map");
  if (!map) return;
  mapObserver = new ResizeObserver(() => drawMap(map));
  mapObserver.observe(map);
  // The browser can drop a canvas's pixels (GPU reset, memory pressure) and restores it blank, so draw again.
  // Each render makes a new canvas, so each canvas gets exactly one listener.
  map.querySelector("canvas").addEventListener("contextrestored", () => { if (map.isConnected) drawMap(map); });
  drawMap(map);
  // Cold loads: web fonts can land after the first draw and move the endpoints, so draw again then.
  document.fonts?.ready.then(() => { if (map.isConnected) drawMap(map); });
  requestAnimationFrame(() => { if (map.isConnected) drawMap(map); });
}

function renderHome() {
  root.innerHTML = `${heroSection()}
  <section class="wrap section" id="four-worlds" tabindex="-1">
    <div class="section-head"><h2>Enter a world</h2></div>
    <div class="world-grid">${worlds.map(worldCard).join("")}</div>
  </section>`;
  startMap();
  window.AssumptionsStrip?.mount(root);
}

function drawMap(map) {
  const canvas = map.querySelector("canvas");
  const bounds = map.getBoundingClientRect();
  const origin = map.querySelector(".map-origin").getBoundingClientRect();
  const scale = window.devicePixelRatio || 1;
  // Size and snap to the device pixels the browser paints the canvas on, so equal lines come out equally sharp.
  const left = Math.round(bounds.left * scale), top = Math.round(bounds.top * scale);
  canvas.width = Math.round(bounds.right * scale) - left;
  canvas.height = Math.round(bounds.bottom * scale) - top;
  const context = canvas.getContext("2d");
  context.scale(scale, scale);
  const fromX = origin.right - bounds.left;
  const fromY = (origin.top + origin.bottom) / 2 - bounds.top;
  map.querySelectorAll(".map-ends a").forEach((endpoint, index) => {
    const end = endpoint.getBoundingClientRect();
    const weight = 4;
    const centre = (value, edge, start) => (Math.round((value + edge - weight / 2) * scale) - start) / scale + weight / 2;
    const snapX = value => centre(value, bounds.left, left), snapY = value => centre(value, bounds.top, top);
    const toX = end.left - bounds.left;
    const toY = snapY((end.top + end.bottom) / 2 - bounds.top);
    const startY = snapY(fromY + (index - 1.5) * 7);
    const elbow = snapX(fromX + (toX - fromX) * (index === 0 || index === 3 ? .42 : .64));
    const track = getComputedStyle(endpoint).getPropertyValue("--track").trim(); // canvas cannot read var(); this is the resolved token
    context.strokeStyle = track;
    context.fillStyle = track;
    context.lineWidth = weight;
    context.beginPath();
    context.moveTo(fromX - 3, startY); // both ends tuck under their box, so rounded corners and fractional edges leave no gap
    context.lineTo(elbow, startY);
    context.lineTo(elbow, toY);
    context.lineTo(toX + 1, toY);
    context.stroke();
    context.fillRect(elbow - 5, toY - 5, 10, 10);
  });
}

function renderWorld(world, tab) {
  const view = {
    overview: () => renderOverview(world),
    timeline: () => renderTimeline(world),
    signals: () => renderSignals(world),
    route: () => renderRoute(world)
  }[tab]();
  root.innerHTML = `<nav class="world-switcher wrap" aria-label="Choose a world">
    ${worlds.map(other => `<a href="${worldLink(other.id, tab)}" ${tone(other)}${active(other.id === world.id)}>${num(other.id)} · ${safe(other.name)}</a>`).join("")}
  </nav>
  <div class="world-hero" ${tone(world)}>
    <div class="wrap"><div><p class="eyebrow world-edition">${worldIcon(world)} World ${num(world.id)} · 2040</p><h1>${safe(world.name)}</h1><p class="subtitle">${safe(world.role)}</p></div>
    <div class="world-intro"><p class="premise">${safe(world.premise)}</p><p>${safe(world.summary)}</p></div></div>
  </div>
  <div class="wrap">
    <nav class="subnav" aria-label="World chapters">
      ${worldTabs.map(([id, name]) => `<a href="${worldLink(world.id, id)}"${active(id === tab)}>${name}</a>`).join("")}
    </nav>
    <section class="world-body" aria-labelledby="section-title">${view}</section>
  </div>`;
}

// Route map: its own world tab at full page width.
// The animated map lives in route-map.html; embed=1 hides its own header and switcher.
function renderRoute(world) {
  return `<header class="body-head route-cap"><h2 id="section-title">Route map</h2>
      <p><span><span class="route-part">Three questions with two answers each make eight possible worlds.</span> <span class="route-part">Follow the line to this one.</span></span></p></header>
    <iframe class="route-frame" title="Route map: the three forks that lead to ${safe(world.name)}" src="route-map.html?world=${world.id}&embed=1&joined=1&v=20261122o"></iframe>`;
}

function boldFirstSentence(text) {
  const first = text.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? "";
  return `<strong>${safe(first)}</strong>${safe(text.slice(first.length))}`;
}

// Worlds 1-3: the slab beat runs in a narrow column, so its last two words, and hyphenated words, don’t break.
function keepLastPair(text) {
  const at = text.lastIndexOf(" ", text.lastIndexOf(" ") - 1) + 1;
  const start = safe(text.slice(0, at)).replace(/\b\w+-\w+\b/g, '<span class="story-keep">$&</span>');
  return `${start}<span class="story-keep">${safe(text.slice(at))}</span>`;
}

function renderOverview(world) {
  // World 4's third beat is as long as the others, so it reads as body text with a bold first sentence.
  const longDiff = world.id === 4;
  // Grounding story: the same three beats for every world, above the right/wrong panels.
  const story = world.story ? `<section class="world-story${longDiff ? " world-story--long-diff" : ` world-story--w${world.id}`}" aria-labelledby="story-title" ${tone(world)}>
      <h2 id="story-title" class="visually-hidden">This world in brief</h2>
      <div class="story-beat"><p class="eyebrow">The world in 2040</p><p>${safe(world.story.now)}</p></div>
      <div class="story-beat"><p class="eyebrow">How it got here</p><p>${safe(world.story.path)}</p></div>
      <div class="story-beat"><p class="eyebrow">What’s different from today</p><p>${longDiff ? boldFirstSentence(world.story.diff) : keepLastPair(world.story.diff)}</p></div>
    </section>` : "";
  return `${story}<div class="world-overview">
    <header class="body-head${world.quote ? " quote-band" : ""}"><h2 id="section-title">How this world works</h2>${world.quote ? quote(world.quote) : worldIcon(world)}</header>
    <article class="panel"><h3>What goes right</h3><p>${safe(world.promise)}</p></article>
    <article class="panel"><h3>What goes wrong</h3><p>${safe(world.danger)}</p></article>
    ${world.data ? `<article class="panel panel--data"><h3>Where the data sits</h3><p>${safe(world.data)}</p></article>` : ""}
  </div>`;
}

function renderTimeline(world) {
  const milestones = world.timeline.map(([title, ...details], index) => `
    <li class="milestone">
      <time datetime="${years[index]}">${years[index]}</time>
      <div class="milestone-card"><h3>${safe(title)}</h3>${list(details)}</div>
    </li>`).join("");
  return `<header class="body-head"><h2 id="section-title">The road to 2040</h2>${worldIcon(world)}</header>
    <ol class="milestones" aria-label="Scenario timeline" ${tone(world)}>${milestones}</ol>
    ${world.headlines?.length ? `<section class="related"><h3>Related reporting</h3>${list(world.headlines)}</section>` : ""}`;
}

function renderSignals(world) {
  return `<div class="newsroom" ${tone(world)}>
    <header class="news-mast"><h2 id="section-title">Signals</h2>${worldIcon(world)}</header>
    <div class="news-stories">${world.signals.map(([title, publisher]) => `<article class="news-story">${publisher ? `<p class="news-source">${safe(publisher)}</p>` : ""}<h3>${safe(title)}</h3></article>`).join("")}</div>
    ${world.evidence?.length ? `<section class="news-context"><h3>Behind the headlines</h3><div>${world.evidence.map(([title, description]) => `<article><h4>${safe(title)}</h4><p>${safe(description)}</p></article>`).join("")}</div></section>` : ""}
  </div>`;
}

function renderCompare() {
  const row = (label, cells) => `<tr><th scope="row">${safe(label)}</th>${cells.map(cell => `<td>${cell}</td>`).join("")}</tr>`;
  root.innerHTML = `${heroSection({onCompare: true})}
  <div class="wrap comparison" id="compare-table">
    <div class="section-head title-block compare-head"><h2 class="compare-title">Compare worlds</h2>
      <p class="cmp-cell"><span class="cmp-eyebrow">How to read this</span>Each pair below changes one answer and holds the rest. Worlds 1 and 2 split on technology: connected systems, or a kit of specialist tools. Worlds 1 and 3 split on who drives the change. Worlds 3 and 4 share systems and providers and part on who makes the final call.</p>
      <p class="cmp-cell cmp-note"><span class="cmp-eyebrow">What’s not here</span>Three questions, two answers each: eight possible worlds. The first convening mapped all eight and developed four. The other four stayed on the map, among them any fragmented world where providers run the systems and any world where people decide while the company drives. The real 2040 may carry pieces of all eight.</p></div>
    <p class="scroll-note" id="table-hint">Scroll across to see all four worlds.</p>
    <div class="table-scroll" tabindex="0" role="region" aria-label="Compare all four worlds" aria-describedby="table-hint">
      <table class="compare-table" aria-label="Four-world comparison"><thead><tr><th scope="col">Dimension</th>${worlds.map(world => `<th scope="col" ${tone(world)}><a href="${worldLink(world.id)}">${worldIcon(world)}${safe(world.name)}</a></th>`).join("")}</tr></thead>
      <tbody>${axes.map((axis, i) => row(axis, worlds.map(world => term(world.labels[i])))).join("")}${["Who runs the work", "What in-house legal does", "Who’s on the team", "Where the data sits"].map((label, i) => row(label, worlds.map(world => safe(world.compare?.[i] || "")))).join("")}${row("What goes right", worlds.map(world => safe(world.promise)))}${row("What goes wrong", worlds.map(world => safe(world.danger)))}</tbody></table>
    </div>
  </div>`;
  startMap();
}

// Credits: the full attribution, linked from the top bar on every page.
function renderCredits() {
  // Credits: blue hero → story → one yellow band → photos.
  const org = (name, url) => `<a href="${url}">${name}<span class="visually-hidden"> (opens their site)</span></a>`;
  // .cp-keep only holds words on one line; it adds no words.
  root.innerHTML = `<section class="credits-hero">
    <div class="wrap cr-hero">
      <h1>Credits <span class="cp-keep">and sources</span></h1>
      <p class="credits-lede">These four worlds come from <a href="https://www.legaltech.com/pathways">Pathways: The Future <span class="cp-keep">of Law</span></a>. <span class="cp-keep">The scenarios</span> belong to the people who <span class="cp-keep">built them.</span> <span class="cp-keep">This site</span> is my retelling, and the wording and any mistakes <span class="cp-keep">are mine.</span></p>
    </div>
  </section>
  ${window.CreditsPhotos?.html() ?? ""}
  <div class="cr-band">
    <div class="wrap cr-cols">
      <p class="cr-thanks">Thank you to ${org("The LegalTech Fund", "https://www.legaltech.com")}, ${org("Law.com", "https://www.law.com")} and ${org("Harvey", "https://www.harvey.ai")} for convening the work, to ${org("Leaders’ Quest", "https://www.leadersquest.org")} for guiding it, and to everyone in the room who argued these worlds <span class="cp-keep">into shape.</span></p>
      <div class="cr-notes">
        <p class="cr-method">The method came from Leaders’ Quest: scenario planning and the Three Horizons framework, developed by Bill Sharpe and colleagues at the International <span class="cp-keep">Futures Forum.</span> <span class="cp-keep">The room</span> held general counsel, law firm leaders, founders, and judicial, <span class="cr-tail">regulatory and <span class="cp-keep">academic voices.</span></span></p>
        <p class="cr-line"><b>Law.com</b> Its reporting supplies the headlines and charts in each <span class="cp-keep">world’s Signals.</span></p>
        <p class="cr-line"><b>Harvey</b> Grounded the imagined futures in what legal AI can <span class="cp-keep">do today.</span></p>
      </div>
    </div>
  </div>
  ${window.CreditsPhotos?.strip() ?? ""}`;
}

// Links shared from the previous pathways.kenpriore.ai build used "#/overview", "#/navigator[/n]"
// and "#/outcomes". Send them to the nearest page here instead of a blank route.
const legacyRoutes = {overview: "#worlds", navigator: "#worlds", outcomes: "#compare", sandbox: "#worlds", signals: "#worlds"};
function upgradeLegacyHash() {
  if (!location.hash.startsWith("#/")) return;
  const target = legacyRoutes[location.hash.slice(2).split("/")[0]] || "#worlds";
  history.replaceState(null, "", target);
}

function readRoute() {
  upgradeLegacyHash();
  const [view, a, b] = location.hash.slice(1).split("/");
  if (view === "sources") {
    history.replaceState(null, "", "#credits");
    return {view: "credits"};
  }
  if (view === "framework") {
    history.replaceState(null, "", "#worlds");
    return {view: "worlds"};
  }
  const first = worlds.find(world => world.id === Number(a)) || worlds[0];
  const tab = worldTabs.some(([id]) => id === b) ? b : "overview";
  if (view === "world" && (b === "lenses" || b === "questions")) {
    history.replaceState(null, "", worldLink(first.id));
  }
  if (view === "compare" && location.hash !== "#compare") {
    history.replaceState(null, "", "#compare");
  }
  return {view, first, tab};
}

function render({scroll = true, focusId = ""} = {}) {
  dismissTerm();
  mapObserver?.disconnect();
  window.AssumptionsStrip?.unmount();
  window.CreditsPhotos?.unmount();
  const {view, first, tab} = readRoute();
  let current = "worlds";
  let title = "The Future of Law to 2040";
  if (view === "world") {
    renderWorld(first, tab);
    title = first.name;
  } else if (view === "compare") {
    renderCompare();
    current = "compare";
    title = "Compare worlds";
  } else if (view === "credits") {
    renderCredits();
    window.CreditsPhotos?.mount(root);
    current = "credits";
    title = "Credits and sources";
  } else {
    renderHome();
  }
  document.body.classList.toggle("on-credits", view === "credits");
  document.title = `Pathways · ${title} · Ken Priore`;
  document.querySelectorAll("[data-nav]").forEach(link => {
    if (link.dataset.nav === current) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  if (focusId) document.getElementById(focusId)?.focus({preventScroll: true});
  if (scroll) {
    if (view === "four-worlds") document.getElementById("four-worlds").scrollIntoView();
    else window.scrollTo(0, 0);
  }
}

let previousView;
window.addEventListener("hashchange", () => {
  if (location.hash === "#main") return;
  const {view} = readRoute();
  const keepPosition = view === "world" && previousView === "world";
  render({scroll: !keepPosition});
  if (view === "four-worlds") document.getElementById("four-worlds").focus({preventScroll: true});
  else if (keepPosition) {
    root.querySelector(".subnav [aria-current]")?.focus({preventScroll: true});
  } else root.focus({preventScroll: true});
  previousView = view;
});

document.querySelector(".skip").addEventListener("click", event => {
  event.preventDefault();
  root.focus();
});

const tip = document.createElement("div");
tip.className = "axis-tooltip";
tip.setAttribute("popover", "manual");
tip.setAttribute("role", "tooltip");
let owner;
function dismissTerm() {
  if (owner) tip.hidePopover();
  owner = null;
}
function showTerm(button) {
  if (!button) return;
  document.body.append(tip);
  owner = button;
  tip.textContent = button.getAttribute("aria-description") || definitions[button.dataset.term];
  tip.showPopover();
  positionTerm();
}
function positionTerm() {
  if (!owner) return;
  const rect = owner.getBoundingClientRect();
  if (rect.bottom < 0 || rect.top > innerHeight || rect.right < 0 || rect.left > innerWidth) {
    dismissTerm();
    return;
  }
  const box = tip.getBoundingClientRect();
  tip.style.left = Math.max(8, Math.min(innerWidth - box.width - 8, rect.left)) + "px";
  tip.style.top = (rect.bottom + box.height + 12 <= innerHeight ? rect.bottom + 5 : Math.max(8, rect.top - box.height - 5)) + "px";
}
root.addEventListener("pointerover", e => { if (e.pointerType === "mouse") showTerm(e.target.closest("[data-term]")); });
root.addEventListener("pointerout", e => {
  if (e.pointerType === "mouse" && owner && e.target === owner && e.relatedTarget !== tip && document.activeElement !== owner) dismissTerm();
});
tip.addEventListener("pointerleave", () => { if (document.activeElement !== owner) dismissTerm(); });
root.addEventListener("focusin", e => showTerm(e.target.closest("[data-term]")));
root.addEventListener("focusout", e => { if (e.target === owner) dismissTerm(); });
document.addEventListener("pointerdown", e => { if (owner && e.target !== owner && e.target !== tip) dismissTerm(); });
root.addEventListener("click", e => showTerm(e.target.closest("[data-term]")));
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && owner) { e.preventDefault(); dismissTerm(); }
});
document.addEventListener("scroll", positionTerm, true);
window.addEventListener("resize", dismissTerm);

previousView = readRoute().view;
render();
