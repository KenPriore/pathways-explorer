/* Clock intro, the year counter: each color comes in with its words, then the page fades in.
   Every frame is a function of t, so ?intro=1&t=<ms> renders exactly what plays.
   The last positions are measured from the page underneath, never hard-coded. */
(() => {
  "use strict";
  const state = window.yearIntro;
  const html = document.documentElement;
  if (!state || !html.classList.contains("yi-wait")) return;

  const T = {
    count: [450, 1600],     // one hard cut per year
    settle: [1640, 2280],   // the year moves into the sentence
    rule: [1600, 1840],     // the rule runs out to the right
    stem: [2170, 2420],
    rows: [2940, 3680, 4420, 5160], // each color and its words arrive on one edge
    rowIn: 300,
    clear: [8370, 8620],    // each color closes onto its name with its words, as the sentence fades
    land: [8580, 9160],     // 2040 and the four names travel to their places
    fade: [9160, 9900],     // the page fades in around them
    end: 9900
  };
  const START = 2026, END = 2040;
  const STEM = ["By", ",", "legal work could run on"];
  const EYEBROW = "Four of eight possible worlds";
  // Each ending is split at the phrase breaks the phone layout uses. World 4 takes two lines from tablet width.
  const ENDINGS = [
    [["one platform", "the company owns"]],     // World 1: compare[0], story.path
    [["many tools", "in-house legal picks"]],   // World 2: premise, story.now
    [["systems that", "law firms own"]],        // World 3: premise, story.diff
    [["providers’ systems", "that qualified people", "can overrule"], ["providers’ systems", "that qualified people can overrule"]] // World 4: compare[0], summary
  ];
  // Each fill is the world's track from content.js. Type is whichever of ink and paper reads on it.
  const ON = {1: "var(--ink)", 2: "var(--ink)", 3: "var(--paper)", 4: "var(--paper)"};

  const clamp = (value, low = 0, high = 1) => Math.min(high, Math.max(low, value));
  const lerp = (a, b, p) => a + (b - a) * p;
  const span = (t, [from, to]) => clamp((t - from) / (to - from));
  const easeOut = p => 1 - (1 - p) ** 3;
  const easeInOut = p => (p < .5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2);
  const easeFade = p => p * p * (3 - 2 * p);

  let overlay, skip, el, page, frameId, layout, metrics, scrollMode;
  let startedAt = null, done = false;
  const listeners = [];
  const on = (target, type, handler, options) => {
    target.addEventListener(type, handler, options);
    listeners.push(() => target.removeEventListener(type, handler, options));
  };

  /* The strip has no hold of its own for an overlay, so this uses its public calls:
     seek(0) freezes it at the start, and a fresh mount afterwards gives it the normal opening beat. */
  const strip = window.AssumptionsStrip;
  const review = new URLSearchParams(location.search).get("strip"); // a frozen review position is left alone
  let stripHeld = false;
  function holdStrip() {
    if (review || !strip || !document.querySelector("main .astrip")) return;
    strip.seek(0);
    stripHeld = true;
  }
  function releaseStrip() {
    if (!stripHeld) return;
    stripHeld = false;
    const main = document.querySelector("main");
    if (!main.querySelector(".astrip")) return; // the route changed and app.js already let it go
    strip.unmount();
    strip.mount(main);
  }

  function finish() {
    if (done) return;
    done = true;
    cancelAnimationFrame(frameId);
    clearTimeout(state.timer);
    listeners.forEach(remove => remove());
    document.body.inert = false;
    state.release();
    html.classList.remove("yi-on");
    if (!html.classList.length) html.removeAttribute("class"); // the page is left exactly as it was
    if (scrollMode) history.scrollRestoration = scrollMode;
    releaseStrip();
    if (!overlay) return;
    overlay.remove();
    // Hand focus to the top of the document, so the next Tab is "Skip to content", with no ring drawn around main.
    const body = document.body;
    body.tabIndex = -1;
    body.style.outline = "0";
    body.focus({preventScroll: true});
    body.removeAttribute("tabindex");
    body.style.outline = "";
    if (!body.style.length) body.removeAttribute("style");
  }

  function make(parent, classes, text = "") {
    const node = document.createElement(classes === "yi-skip" ? "button" : "div");
    node.className = classes;
    node.textContent = text;
    parent.append(node);
    return node;
  }

  function build(worlds) {
    overlay = document.createElement("div");
    overlay.className = "yi";
    overlay.tabIndex = -1;
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Introduction. " + EYEBROW + ". " + worlds
      .map((world, i) => `${world.name}: by ${END}, legal work could run on ${ENDINGS[i][0].join(" ")}.`).join(" "));
    const art = make(overlay, "yi-art");
    art.setAttribute("aria-hidden", "true");
    el = {ground: make(art, "yi-ground"), bar: make(art, "yi-bar")};
    el.fill = make(art, "yi-fill");
    el.ticks = Array.from({length: END - START + 1}, () => make(art, "yi-tick"));
    el.worlds = worlds.map((world, i) => {
      // What travels to the map lies under the field, and shows as the field closes.
      const frame = make(art, "yi-frame"), num = make(art, "yi-num", String(world.id).padStart(2, "0"));
      const traveler = make(art, "yi-name", world.name);
      const field = make(art, "yi-field");
      field.style.setProperty("--fill", world.track);
      field.style.setProperty("--on", ON[world.id]);
      return {
        frame, num, traveler, field,
        band: make(field, "yi-band"),
        divider: make(field, "yi-divider"),
        lines: ENDINGS[i][0].map(line => make(field, "yi-slab yi-line", line)),
        whole: make(field, "yi-slab yi-line", ENDINGS[i][0].join(" ")),
        name: make(field, "yi-name", world.name)
      };
    });
    el.eyebrow = make(art, "yi-eyebrow", EYEBROW);
    el.by = make(art, "yi-slab yi-display", STEM[0]);
    el.comma = make(art, "yi-slab yi-display", STEM[1]);
    el.stem = make(art, "yi-slab yi-display", STEM[2]);
    el.digits = [...String(START)].map(digit => {
      const node = make(art, "yi-slab yi-digit");
      const glyph = document.createElement("span");
      glyph.textContent = digit;
      node.append(glyph);
      return node;
    });
    skip = make(overlay, "yi-skip", "Skip");
    skip.type = "button";
    skip.setAttribute("aria-label", "Skip intro");
    html.append(overlay); // a sibling of body, so body can be inert while this plays
  }

  function measureType() {
    const ctx = document.createElement("canvas").getContext("2d");
    const css = getComputedStyle(html);
    const faces = {
      slab: `870 1000px ${css.getPropertyValue("--slab")}`,
      name: "730 1000px Archivo, Arial, sans-serif",
      mono: `700 1000px ${css.getPropertyValue("--mono")}`
    };
    const measure = (face, text, track = 0) => {
      ctx.font = faces[face];
      const m = ctx.measureText(text);
      return {
        width: m.width / 1000 + text.length * track,
        left: -m.actualBoundingBoxLeft / 1000,
        right: m.actualBoundingBoxRight / 1000 + (text.length - 1) * track,
        cap: m.actualBoundingBoxAscent / 1000,
        middle: (m.fontBoundingBoxAscent - m.fontBoundingBoxDescent) / 2000
      };
    };
    metrics = {measure, digits: Array.from({length: 10}, (_, i) => measure("slab", String(i)))};
    metrics.cell = Math.max(...metrics.digits.map(d => d.width)); // tabular cells: this face's digits are proportional
    metrics.slabBase = .5 + metrics.digits[0].middle;
    metrics.nameBase = .55 + measure("name", "H").middle;
    metrics.monoBase = .5 + measure("mono", "H").middle;
  }

  function computeLayout() {
    const W = html.clientWidth, H = innerHeight;
    const column = document.querySelector(".hero-inner").getBoundingClientRect();
    const L = column.left, R = column.right;
    const {measure, digits, cell} = metrics;
    const wide = W >= 760 && W > H * 1.05;
    const tablet = !wide && W >= 600, short = wide && H < 560;

    // Opening. Wide: one line, flush to both edges of the column. Phone: "20" over "26", so the year still holds the screen.
    const pitch = cell - .028;
    const columns = wide ? 4 : 2, stack = 4 / columns;
    const inkAt = digit => (cell - digits[digit].width) / 2;
    const inkL = inkAt(2) + digits[2].left;
    // The right edge is the widest digit that column ever shows, so no year pushes past the margin.
    const inkR = pitch * (columns - 1) + Math.max(...digits.map((d, i) => inkAt(i) + d.right));
    const bigSize = Math.min((R - L) / (inkR - inkL), H * (wide ? .74 : .41));
    const bigW = bigSize * (inkR - inkL);
    const bigX = L + (R - L - bigW) / 2;
    const cap = digits[0].cap * bigSize, gap = Math.max(22, bigSize * .075), leading = cap + bigSize * .065;
    const bigBase = (H - cap - (stack - 1) * leading - gap - 24) / 2 + cap;
    const big = {inkL, x: bigX - inkL * bigSize, base: bigBase, leading, columns, size: bigSize, pitch, left: bigX, width: bigW, rule: bigBase + (stack - 1) * leading + gap};

    // Sentence: every line, at every width, starts on L, the left edge of the page's own column.
    const top = Math.round(H * (wide ? .46 : (H < 700 ? .34 : .3)));
    const copy = ENDINGS.map(options => (wide ? [options[0].join(" ")] : tablet ? options[options.length - 1] : options[0]));
    // Wide rows are equal. Stacked rows share the height by line count, so the space around every block is the same.
    const weights = copy.map(lines => (wide ? 1 : lines.length + 1.9));
    const unit = (H - top) / weights.reduce((a, b) => a + b, 0);
    let y = top;
    const rows = weights.map((weight, i) => {
      const from = Math.round(y);
      y += weight * unit;
      return {top: from, bottom: i === 3 ? H : Math.round(y)};
    });

    const name = measure("name", "Big Law Owns the Stack");
    const nameSize = wide ? Math.min(24, Math.max(13, unit * .18), W * .017) : clamp(unit * .48, 12.5, 18);
    let nameX = L;
    if (wide) {
      nameX = R - name.width * nameSize;
      const real = document.querySelector(".map-ends a span").getBoundingClientRect().left;
      if (real > W * .6 && real < nameX) nameX = real; // each name sits straight above its place in the map
    }
    const room = wide ? nameX - L - 56 : R - L;
    const widest = Math.max(...copy.flat().map(s => measure("slab", s, -.025).width));
    const size = Math.min(room / widest, unit * (wide ? .4 : .8), wide ? 58 : 56);

    const lineCap = measure("slab", "H").cap * size, lineStep = 1.04 * size;
    const nameGap = Math.max(nameSize * 1.65, size * .9);
    rows.forEach((row, i) => {
      const middle = (row.top + row.bottom) / 2;
      const block = wide ? lineCap : lineCap + (copy[i].length - 1) * lineStep + nameGap;
      row.base = middle - block / 2 + lineCap;
      row.nameBase = wide ? row.base : row.base + (copy[i].length - 1) * lineStep + nameGap;
      row.lines = copy[i].map(s => ({text: s, x: L - measure("slab", s).left * size}));
      row.nameX = wide ? nameX : L - measure("name", el.worlds[i].name.textContent).left * nameSize; // on a phone the names set on their ink too
    });

    const by = measure("slab", "By", -.045), word = measure("slab", STEM[2], -.045);
    let advance = by.width + measure("slab", " ").width - .045;
    const offsets = [2, 0, 4, 0].map(d => {
      const at = advance;
      advance += digits[d].width - .045;
      return at;
    });
    const headWidth = advance + measure("slab", ",").width;
    const headSize = Math.min(top * (wide ? (short ? .36 : .405) : .285), (R - L) / headWidth);
    const stemSize = Math.min(top * (wide ? .31 : tablet ? .24 : .158), (R - L) / (word.right - word.left)); // flush to both edges
    const eyebrow = measure("mono", EYEBROW.toUpperCase(), .075);
    const eyebrowSize = Math.min(wide ? 15 : 12.48, (R - L) / eyebrow.width);
    layout = {
      W, H, L, R, wide, big, top, rows, size, lineStep, nameX, nameSize, eyebrowSize, headSize, stemSize, offsets, commaAt: advance,
      head: {x: L - by.left * headSize, base: top * (wide ? (short ? .56 : .535) : tablet ? .63 : .68)},
      stem: {x: L - word.left * stemSize, base: top * .875},
      eyebrow: {x: L, base: wide ? Math.max(34, top * .14) + (short ? 0 : 4) : top * (tablet ? .3 : .385)}
    };

    // Landing: measure the glyph box inside our own digit at the size of the h1, to match the real glyph box.
    layout.landSize = parseFloat(getComputedStyle(page.year).fontSize);
    const probe = el.digits[1];
    probe.style.fontSize = layout.landSize + "px";
    probe.style.transform = "none";
    layout.glyphTop = probe.firstChild.getBoundingClientRect().top - probe.getBoundingClientRect().top;
    layout.landName = parseFloat(getComputedStyle(page.ends[0].name).fontSize);
    // Boxes and numbers take the map's own computed styles, so they can't drift from it.
    el.worlds.forEach(({frame, num}, i) => {
      const box = getComputedStyle(page.ends[i].box), figure = getComputedStyle(page.ends[i].num);
      Object.assign(frame.style, {borderColor: box.borderTopColor, borderRadius: box.borderTopLeftRadius});
      Object.assign(num.style, {color: figure.color, fontFamily: figure.fontFamily, fontSize: figure.fontSize, fontWeight: figure.fontWeight, lineHeight: figure.lineHeight, letterSpacing: figure.letterSpacing});
      layout.rows[i].border = parseFloat(box.borderTopWidth);
    });
  }

  function set(node, x, y, opacity, size) {
    node.style.visibility = opacity > 0 ? "visible" : "hidden";
    if (opacity <= 0) return;
    node.style.opacity = opacity;
    if (size !== undefined) node.style.fontSize = size + "px";
    node.style.transform = `translate(${x}px,${y}px)`;
    if (node.style.left) node.style.left = node.style.top = "";
  }
  // Once landed, a clone is laid out, not transformed, so it snaps to the same pixels as the element under it.
  function dock(node, x, y) {
    node.style.transform = "none";
    node.style.left = x + "px";
    node.style.top = y + "px";
  }
  function box(node, x, y, width, height, opacity) {
    set(node, x, y, opacity);
    node.style.width = Math.max(0, width) + "px";
    node.style.height = Math.max(0, height) + "px";
  }
  // The sentence arrives on an edge and leaves on a fade, as the colors close.
  function wipe(node, x, y, shown, opacity, size) {
    set(node, x, y, shown > 0 ? opacity : 0, size);
    // The clip runs past the box on three sides to keep overhanging glyphs whole.
    node.style.clipPath = shown >= 1 ? "none" : `inset(-30% ${100 - 108 * shown}% -30% -8%)`;
  }

  function draw(t) {
    const l = layout, m = metrics;
    const count = span(t, T.count);
    const year = String(START + Math.round(count * (END - START)));
    const settle = easeInOut(span(t, T.settle));
    const ruleOut = easeInOut(span(t, T.rule));
    const stemIn = easeOut(span(t, T.stem));
    const clear = easeFade(span(t, T.clear)), gone = 1 - clear;
    const land = easeInOut(span(t, T.land));
    const fade = span(t, T.fade);
    // Read every landing place before writing anything, so each frame costs one layout.
    const targets = land === 0 ? [] : page.ends.map(end => [end.box, end.name, end.num].map(node => node.getBoundingClientRect()));
    const glyphs = land === 0 ? [] : el.digits.map((_, i) => {
      page.range.setStart(page.year.firstChild, i);
      page.range.setEnd(page.year.firstChild, i + 1);
      return page.range.getBoundingClientRect();
    });

    // The whole overlay fades as one layer. What has landed covers its twin on the page, so it holds still.
    overlay.style.opacity = 1 - easeFade(fade);
    box(el.ground, 0, 0, l.W, l.H, 1);

    const ruleX = l.big.left + l.big.width * ruleOut;
    box(el.bar, ruleX, l.big.rule, l.big.width * (1 - ruleOut), 8, ruleOut < 1 ? 1 : 0);
    box(el.fill, ruleX, l.big.rule, l.big.width * Math.max(0, count - ruleOut), 8, count > ruleOut ? 1 : 0);
    el.ticks.forEach((tick, i) => {
      const x = l.big.left + (l.big.width - 2) * i / (END - START);
      box(tick, x, l.big.rule + 14, 2, i % (END - START) ? 7 : 12, ruleOut < 1 && x >= ruleX - 1 ? 1 : 0);
      tick.classList.toggle("yi-lit", START + i <= Number(year));
    });

    // The year
    el.digits.forEach((node, i) => {
      const digit = Number(year[i]);
      if (node.firstChild.textContent !== year[i]) node.firstChild.textContent = year[i];
      // On a phone the type shrinks ahead of the move and "40" leads sideways, so the two rows never collide.
      // Glyphs in a row are spaced in ems, so they can't close up while the size changes.
      const row = Math.floor(i / l.big.columns), column = i % l.big.columns, first = row * l.big.columns;
      const stacked = l.big.columns < 4;
      let size = lerp(l.big.size, l.headSize, stacked ? easeOut(settle) : settle);
      const rowX = lerp(l.big.x, l.head.x + l.offsets[first] * l.headSize, row ? easeOut(settle) : settle);
      const glyph = m.digits[digit];
      // Tabular cells, except that the first column sets on its ink, so the left edge holds through 2, 3 and 4.
      const inCell = column ? column * l.big.pitch + (m.cell - glyph.width) / 2 : l.big.inkL - glyph.left;
      let x = rowX + lerp(inCell, l.offsets[i] - l.offsets[first], settle) * size;
      let y = lerp(l.big.base + row * l.big.leading, l.head.base, settle) - m.slabBase * size;
      if (land > 0) {
        const to = glyphs[i];
        x = lerp(x, to.left, land);
        y = lerp(y, to.top - l.glyphTop, land);
        size = lerp(size, l.landSize, land);
      }
      set(node, x, y, 1, size);
      if (land === 1) dock(node, x, y);
    });

    // The stem
    const headTop = l.head.base - m.slabBase * l.headSize;
    wipe(el.by, l.head.x, headTop, stemIn, gone, l.headSize);
    set(el.comma, l.head.x + l.commaAt * l.headSize, headTop, stemIn === 1 ? gone : 0, l.headSize);
    wipe(el.stem, l.stem.x, l.stem.base - m.slabBase * l.stemSize, stemIn, gone, l.stemSize);
    wipe(el.eyebrow, l.eyebrow.x, l.eyebrow.base - m.monoBase * l.eyebrowSize, stemIn, gone, l.eyebrowSize);

    el.worlds.forEach((world, i) => {
      const row = l.rows[i];
      // A color and its words are one layer under one moving edge, so a color can't wait empty.
      const shown = easeOut(span(t, [T.rows[i], T.rows[i] + T.rowIn]));
      const open = shown > 0 && clear < 1;
      world.field.style.visibility = open ? "visible" : "hidden";
      const textTop = row.base - m.slabBase * l.size, nameTop = row.nameBase - m.nameBase * l.nameSize;
      if (open) {
        // Leaving, each color closes onto its name. Fading it over blue would pass through olive, purple and navy.
        const at = row.nameBase - .36 * l.nameSize;
        const upper = lerp(row.top, at, clear), lower = lerp(row.bottom, at, clear);
        world.field.style.clipPath = `inset(${upper}px ${l.W * (1 - shown)}px ${l.H - lower}px 0)`;
        box(world.band, 0, row.top, l.W, row.bottom - row.top, 1);
        set(world.whole, row.lines[0].x, textTop, l.wide ? 1 : 0, l.size);
        world.lines.forEach((node, j) => {
          const line = l.wide ? null : row.lines[j];
          if (line && node.textContent !== line.text) node.textContent = line.text;
          set(node, line?.x ?? 0, textTop + j * l.lineStep, line ? 1 : 0, l.size);
        });
        box(world.divider, l.nameX - 24, row.top, 1, row.bottom - row.top, l.wide ? .25 : 0);
        set(world.name, row.nameX, nameTop, 1, l.nameSize);
      } else {
        // children set visible would show through a hidden parent
        [world.band, world.divider, world.whole, world.name, ...world.lines].forEach(node => { node.style.visibility = "hidden"; });
      }

      // The name is the element that carries on into the map.
      const [to, toName, toNum] = targets[i] ?? [];
      const x = to ? lerp(row.nameX, toName.left, land) : row.nameX;
      const y = to ? lerp(nameTop, toName.top, land) : nameTop;
      set(world.traveler, x, y, clear > 0 ? 1 : 0, lerp(l.nameSize, l.landName, land));
      const wraps = land > .7 && toName.height > l.landName * 1.6;
      world.traveler.style.whiteSpace = wraps ? "normal" : "pre";
      world.traveler.style.width = wraps ? toName.width + .5 + "px" : "auto";

      // Each box draws in around its name as the name arrives, with the number inside it.
      const framed = easeOut(span(land, [.72, 1]));
      if (framed > 0) {
        const dx = x - toName.left, dy = y - toName.top; // the box keeps its place relative to the name
        box(world.frame, to.left + dx, to.top + dy, to.width, to.height, framed);
        world.frame.style.borderWidth = row.border + "px";
        set(world.num, toNum.left + dx, toNum.top + dy, framed);
      } else {
        world.frame.style.visibility = world.num.style.visibility = "hidden";
      }
      if (land === 1) {
        dock(world.frame, to.left, to.top);
        dock(world.traveler, toName.left, toName.top);
        dock(world.num, toNum.left, toNum.top);
      }
    });

    // Skip fades ahead of the page, so it doesn't sit double over the header.
    set(skip, l.R - 76, l.wide ? Math.max(12, l.top * .14 - 22) : 14, Math.max(.001, 1 - fade * 4));
  }

  function tick(now) {
    if (done) return;
    if (startedAt === null) startedAt = now;
    const t = now - startedAt;
    try {
      if (t >= T.end) return finish();
      draw(t);
      frameId = requestAnimationFrame(tick);
    } catch (error) {
      finish();
      console.error("Intro stopped", error);
    }
  }

  function keys(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      finish();
    } else if (event.key === "Tab") {
      event.preventDefault();
      skip.focus({preventScroll: true});
    } else if (!event.metaKey && !event.ctrlKey && !event.altKey && event.target !== skip) {
      if ([" ", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"].includes(event.key)) event.preventDefault();
    } else if (event.target === skip && /^(Arrow|Page|Home|End)/.test(event.key)) {
      event.preventDefault();
    }
  }

  async function start() {
    try {
      holdStrip();
      on(window, "keydown", event => { if (event.key === "Escape" && !overlay) finish(); }, true); // Esc while fonts load
      const faces = ['870 48px "Roboto Slab"', "730 16px Archivo", "400 16px Archivo"];
      await Promise.race([
        Promise.allSettled(faces.map(face => document.fonts.load(face))),
        new Promise(resolve => setTimeout(resolve, 1500))
      ]);
      if (done) return;
      if (!html.classList.contains("yi-wait")) return finish(); // the failsafe already showed the site
      if (location.hash && location.hash !== "#worlds") return finish(); // they navigated while fonts loaded
      page = {
        year: document.querySelector("main .hero h1 span"),
        ends: [...document.querySelectorAll(".map-ends a")].map(a => ({box: a, name: a.querySelector("span"), num: a.querySelector("b")})),
        range: document.createRange()
      };
      const worlds = window.PATHWAYS?.worlds;
      if (!page.year || worlds?.length !== 4 || page.ends.length !== 4 || page.year.textContent !== String(END)) return finish();
      if (state.frame !== null && state.frame >= T.end) return finish();

      scrollMode = history.scrollRestoration;
      history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
      build(worlds);
      if (getComputedStyle(overlay).position !== "fixed") return finish(); // intro.css did not arrive
      if (!state.forced) sessionStorage.setItem(state.key, "1");
      measureType();
      computeLayout();
      draw(state.frame ?? 0);
      clearTimeout(state.timer);
      html.classList.add("yi-on");
      html.classList.remove("yi-wait"); // body shows again, underneath an opaque overlay
      document.body.inert = true;
      overlay.focus({preventScroll: true});

      skip.addEventListener("click", finish);
      on(window, "keydown", keys, true);
      on(window, "wheel", event => event.preventDefault(), {passive: false});
      on(window, "touchmove", event => event.preventDefault(), {passive: false});
      on(window, "scroll", () => { if (scrollX || scrollY) window.scrollTo(0, 0); }); // no overflow:hidden, so the scrollbar never shifts the page
      on(window, "hashchange", finish);
      on(matchMedia("(prefers-reduced-motion: reduce)"), "change", event => { if (event.matches) finish(); });
      on(window, "resize", () => {
        if (!page.year.isConnected) return finish();
        computeLayout();
        if (state.frame !== null) draw(state.frame);
      });
      if (state.frame === null) frameId = requestAnimationFrame(tick);
    } catch (error) {
      finish();
      console.error("Intro could not start", error);
    }
  }
  state.started = true; // if this line is never reached, the tag's onload releases the page
  start();
})();
