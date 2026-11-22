"use strict";
/* Assumptions strip. A click or tap stops it and another starts it. One real list plus a copy on each side. The copies are for the eye only.
   `offset` is how far the real list has moved left, in CSS px. A larger offset = further right to left. */
window.AssumptionsStrip = (() => {
  const items = window.ASSUMPTIONS;
  const phone = matchMedia("(max-width:670px)");
  const calm = matchMedia("(prefers-reduced-motion:reduce)");
  const SPEED = {wide: 40, phone: 30};
  const HOLD = 1200; // a beat to read the first box before it leaves
  const esc = text => text.replace(/[&<>"]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"}[c]));
  const TAP = 8; // px of travel before a press counts as a drag
  let current = null;

  function list(copy) {
    return items.map((item, index) => {
      const [field, meaning] = item.fields[item.line];
      const body = `<span class="as-tag">${esc(item.tag)}</span><span class="as-title">${esc(item.title)}</span>
        <span class="as-field">${esc(field)}</span><span class="as-meaning">${esc(meaning)}</span>`;
      const box = copy
        ? `<div class="as-box ${item.kind}" data-index="${index}">${body}</div>`
        : `<button type="button" class="as-box ${item.kind}" data-index="${index}" aria-expanded="false" aria-controls="as-detail">${body}</button>`;
      const wire = item.tests ? '<svg class="as-wire" aria-hidden="true" focusable="false"><path/><rect width="6" height="6"/></svg>' : "";
      const classes = [item.tests && "linked", items[index + 1]?.tests && "before-link"].filter(Boolean).join(" ");
      return `<li class="${classes}">${wire}${box}</li>`;
    }).join("");
  }

  function html() {
    return `<section class="astrip" aria-labelledby="as-name">
      <div class="as-row">
        <div class="as-label"><h2 class="as-name" id="as-name"><span>The</span>&#32;<span>assumptions</span></h2></div>
        <div class="as-view" role="group" aria-labelledby="as-name" tabindex="0"><div class="as-track"><ul class="as-set as-real">${list(false)}</ul></div></div>
      </div>
      <div class="as-detail" id="as-detail" role="region" aria-labelledby="as-detail-title" tabindex="-1" hidden></div>
    </section>`;
  }

  function mount(root) {
    const strip = root.querySelector(".astrip");
    if (!strip) return;
    const view = strip.querySelector(".as-view");
    const track = strip.querySelector(".as-track");
    const real = strip.querySelector(".as-real");
    const detail = strip.querySelector(".as-detail");
    const boxes = [...real.querySelectorAll(".as-box")];
    const listeners = new AbortController();
    const on = (target, type, handler, options = {}) => target.addEventListener(type, handler, {signal: listeners.signal, ...options});

    let frozen = false, offset = 0;
    let loop = 0, gap = 0, room = 0, viewLeft = 0, width = 0;
    let selected = null, paused = false, byKey = false, resumeAt = null;
    let onScreen = false, held = true, alive = true;
    let frame = 0, last = null, resizeFrame = 0, drag = null, press = null, suppressClick = false, coast = 0;

    const wrapped = value => ((value % loop) + loop) % loop;
    const place = () => {
      if (!loop || calm.matches) return;
      // the copies cover one list either side, which is as far as focus or a drag can take it
      if (offset >= loop || offset < -loop) offset = wrapped(offset);
      track.style.transform = `translate3d(${gap - offset}px,0,0)`;
    };
    // a card in keyboard focus holds still; the strip itself can have focus while it runs
    const focusInside = () => byKey && (boxes.includes(document.activeElement) || detail.contains(document.activeElement));
    const reasons = () => ({
      paused, frozen, held, calm: calm.matches, open: selected !== null, focused: focusInside(),
      dragging: !!drag, hidden: document.hidden, offscreen: !onScreen
    });
    const canRun = () => alive && loop > 0 && !Object.values(reasons()).some(Boolean);

    function tick(now) {
      frame = 0;
      if (!canRun()) { sync(); return; }
      const seconds = last === null ? 0 : Math.min((now - last) / 1000, .25);
      last = now;
      const speed = phone.matches ? SPEED.phone : SPEED.wide;
      offset = wrapped(offset + (speed + coast) * seconds);
      coast = Math.abs(coast) < 3 ? 0 : coast * Math.exp(-seconds / .32);
      place();
      frame = requestAnimationFrame(tick);
    }

    function sync() {
      view.classList.toggle("dragging", !!drag);
      if (canRun()) {
        if (!frame) { last = null; frame = requestAnimationFrame(tick); }
      } else {
        if (frame) {
          cancelAnimationFrame(frame);
          offset = Math.round(offset); // rest on a whole pixel, so the type is crisp
          place();
        }
        frame = 0; last = null; coast = 0;
      }
    }

    /* Each box takes the narrowest width that still fits the shared height, so short copy never leaves an empty side. */
    function fitBoxes() {
      const small = phone.matches;
      const inset = Math.max(gap, root.querySelector(".hero-inner").getBoundingClientRect().left - view.getBoundingClientRect().left);
      const cap = Math.min(small ? 286 : 600, view.clientWidth - 2 * inset);
      const set = (box, w) => { box.style.width = `${w}px`; };
      real.style.alignItems = "flex-start";
      const floors = boxes.map(box => {
        box.style.width = "max-content";
        const style = getComputedStyle(box);
        const padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
        const widest = selector => {
          const span = box.querySelector(selector);
          span.style.width = "max-content";
          const size = Math.ceil(span.getBoundingClientRect().width);
          span.style.width = "";
          return size;
        };
        const names = [".as-tag", ".as-field"];
        if (!small) names.push(".as-title"); // one-line names wherever there is room
        return Math.min(cap, Math.max(...names.map(widest)) + padding + 3);
      });
      const oneLineName = boxes[0].querySelector(".as-title");
      const titleLine = parseFloat(getComputedStyle(oneLineName).lineHeight);
      const textLine = parseFloat(getComputedStyle(boxes[0].querySelector(".as-meaning")).lineHeight);
      // padding, tag, name, field label, then two lines (four on a phone)
      const base = (small ? 24 : 28) + 16 + 4 + titleLine + 11 + 14 + 4 + textLine * (small ? 4 : 2);
      const least = boxes.map(box => { set(box, cap); return box.getBoundingClientRect().height; });
      const height = Math.max(base, ...least) + .5;
      boxes.forEach((box, index) => {
        let low = floors[index], high = cap;
        while (low < high) {
          const middle = (low + high) >> 1;
          set(box, middle);
          if (box.getBoundingClientRect().height <= height) high = middle; else low = middle + 1;
        }
        set(box, low);
        // on a phone, widen until no title or meaning ends on a single word
        while (small && low < cap && [...box.querySelectorAll(".as-title,.as-meaning")].some(endsOnOneWord)) {
          low = Math.min(cap, low + 4);
          set(box, low);
        }
      });
      real.style.alignItems = "";
    }

    function endsOnOneWord(element) {
      const node = element.firstChild, words = [...node.data.matchAll(/\S+/g)];
      if (words.length < 2) return false;
      const top = word => {
        const range = document.createRange();
        range.setStart(node, word.index);
        range.setEnd(node, word.index + word[0].length);
        return range.getClientRects()[0]?.top;
      };
      return top(words[words.length - 1]) !== top(words[words.length - 2]);
    }

    function drawWires() {
      const height = real.offsetHeight;
      const length = parseFloat(getComputedStyle(strip).getPropertyValue("--link"));
      const from = Math.round(height * .3), to = Math.round(height * .7), elbow = length / 2;
      real.querySelectorAll(".as-wire").forEach(wire => {
        wire.querySelector("path").setAttribute("d", `M0 ${from}H${elbow}V${to}H${length}`);
        const node = wire.querySelector("rect");
        node.setAttribute("x", elbow - 3);
        node.setAttribute("y", to - 3);
      });
    }

    function makeCopies() {
      track.querySelectorAll(".as-set[aria-hidden]").forEach(node => node.remove());
      if (calm.matches) return;
      const template = document.createElement("ul");
      template.className = "as-set as-copy";
      template.setAttribute("aria-hidden", "true");
      template.innerHTML = list(true);
      const copies = template.querySelectorAll(".as-box");
      boxes.forEach((box, index) => { copies[index].style.width = box.style.width; });
      const wires = real.querySelectorAll(".as-wire");
      template.querySelectorAll(".as-wire").forEach((wire, index) => { wire.innerHTML = wires[index].innerHTML; });
      [-loop, loop].forEach(left => {
        const copy = template.cloneNode(true);
        copy.style.left = `${left}px`;
        track.append(copy);
      });
    }

    function layout() {
      if (!alive) return;
      const before = loop;
      strip.classList.toggle("still", calm.matches);
      view.scrollLeft = 0;
      if (calm.matches) view.removeAttribute("aria-description");
      else view.setAttribute("aria-description", "Enter or Space stops and starts the motion");
      gap = parseFloat(getComputedStyle(strip).getPropertyValue("--gap"));
      fitBoxes();
      loop = real.getBoundingClientRect().width;
      if (before && !frozen) offset *= loop / before; // a seeked offset stays where it was put
      width = view.getBoundingClientRect().width;
      viewLeft = view.getBoundingClientRect().left;
      room = Math.min(width, root.querySelector(".hero-inner").getBoundingClientRect().right - viewLeft);
      drawWires();
      makeCopies();
      if (calm.matches) track.style.transform = "";
      else place();
      if (selected !== null) { mark(); reveal(boxes[selected], true); }
      sync();
    }

    function reveal(box, forPanel = false) {
      if (calm.matches) {
        box.scrollIntoView({block: "nearest", inline: "nearest"});
        return;
      }
      const left = box.offsetParent === track ? box.offsetLeft : box.parentElement.offsetLeft + box.offsetLeft;
      const size = box.offsetWidth;
      const limit = forPanel ? room : width;
      const x = left + gap - offset;
      const start = forPanel
        ? Math.max(gap, root.querySelector(".hero-inner").getBoundingClientRect().left - viewLeft)
        : gap;
      if (x < start || x + size > limit) {
        const target = x < start ? start : Math.max(start, limit - size - (forPanel ? 0 : gap));
        offset = Math.round(left + gap - target);
        place();
      }
    }

    function mark() {
      track.querySelectorAll(".as-box").forEach(box => box.classList.remove("selected"));
      boxes.forEach((box, index) => box.setAttribute("aria-expanded", String(index === selected)));
      if (selected !== null) boxes[selected].classList.add("selected");
    }

    function open(index, clicked) {
      if (selected === index) { close(); return; }
      const item = items[index], box = boxes[index];
      // a copy was clicked: slide by whole lists, so the real box is the one under the pointer
      if (clicked && clicked !== box) offset -= clicked.closest(".as-set").offsetLeft - real.offsetLeft;
      selected = index;
      const [one, two] = item.fields;
      const part = (text, other) => Math.max(.75, Math.min(1.5, text.length / other.length)).toFixed(2);
      detail.className = `as-detail ${item.kind}`;
      detail.style.setProperty("--a", `${part(one[1], two[1])}fr`);
      detail.innerHTML = `<div class="as-head"><p class="as-tag">${esc(item.tag)}</p><p class="as-title" id="as-detail-title">${esc(item.title)}</p>
          ${item.tests ? `<p class="as-tests">Tests: ${esc(item.tests)}</p>` : ""}</div>
        <div class="as-first"><p class="as-field">${esc(one[0])}</p><p class="as-full">${esc(one[1])}</p></div>
        <div class="as-second"><p class="as-field">${esc(two[0])}</p><p class="as-full">${esc(two[1])}</p></div>
        <div class="as-end"><button type="button" class="as-close">Close</button></div>`;
      detail.hidden = false;
      mark();
      place();
      reveal(box, true);
      detail.focus({preventScroll: true});
      sync();
      detail.scrollIntoView({block: "nearest", behavior: calm.matches ? "auto" : "smooth"});
    }

    function hidePanel() {
      selected = null;
      detail.hidden = true;
      detail.replaceChildren();
      mark();
    }

    // Closing restarts. Focus moves to the strip, which stays put, and Tab carries on from the next card.
    function close() {
      if (selected === null) return;
      const index = selected;
      const hadFocus = strip.contains(document.activeElement) || document.activeElement === document.body;
      hidePanel();
      paused = frozen = held = false;
      if (hadFocus) {
        resumeAt = index + 1;
        if (calm.matches) boxes[index].focus({preventScroll: true});
        else view.focus({preventScroll: true});
      }
      sync();
    }

    // a drag moves the strip and is not a tap, so a stopped strip stays stopped
    function setAside() {
      if (selected === null) return;
      hidePanel();
      paused = true;
    }

    function toggle() {
      if (selected !== null) { close(); return; }
      if (calm.matches) return;
      if (paused || frozen) paused = frozen = held = false;
      else paused = true;
      sync();
    }

    on(strip, "click", event => {
      const dragged = suppressClick && event.detail > 0;
      suppressClick = false;
      if (dragged) return;
      if (event.target.closest(".as-close")) { close(); return; }
      if (event.target.closest(".as-detail")) return;
      const box = event.target.closest(".as-box");
      if (box) open(Number(box.dataset.index), box);
      else toggle();
    });

    on(strip, "keydown", event => {
      if (event.target === view && event.key === "Tab" && !event.shiftKey && resumeAt !== null) {
        const next = boxes[resumeAt] || root.querySelector("#four-worlds a");
        resumeAt = null;
        if (next) { event.preventDefault(); next.focus({preventScroll: !boxes.includes(next)}); }
        return;
      }
      if (event.key !== "Enter" && event.key !== " ") return;
      if (event.target !== view && event.target !== detail) return; // cards and Close are buttons already
      if (calm.matches && selected === null) return;
      event.preventDefault();
      if (!event.repeat) toggle();
    });
    on(view, "focusout", event => { if (event.target === view) resumeAt = null; });

    on(document, "keydown", event => {
      // Shift for a wheel scroll is not Tab, so it does not ring what the mouse clicked
      if (!["Shift", "Control", "Alt", "Meta"].includes(event.key)) strip.classList.remove("by-mouse");
      if (event.key === "Escape") {
        if (selected !== null) { event.preventDefault(); close(); }
        return; // Esc is not navigation, so it does not turn a pointer visit into a focus pause
      }
      if (["Shift", "Control", "Alt", "Meta"].includes(event.key)) return;
      byKey = true;
      if (view.contains(document.activeElement)) sync();
    }, {capture: true});
    on(document, "pointerdown", () => { byKey = false; strip.classList.add("by-mouse"); queueMicrotask(() => { if (alive) sync(); }); }, {capture: true});
    on(strip, "focusin", event => {
      if (byKey && boxes.includes(event.target)) reveal(event.target);
      sync();
    });
    on(strip, "focusout", () => queueMicrotask(() => { if (alive) sync(); }));

    on(strip, "pointerdown", event => {
      suppressClick = false;
      press = event.isPrimary ? {id: event.pointerId, x: event.clientX, y: event.clientY} : null;
    });
    on(window, "pointermove", event => {
      if (press?.id === event.pointerId && Math.hypot(event.clientX - press.x, event.clientY - press.y) > TAP) suppressClick = true;
    });
    on(window, "pointerup", () => { press = null; });
    on(window, "pointercancel", () => { press = null; });

    // drag and swipe: sideways moves the strip, up and down is left to the page
    on(view, "pointerdown", event => {
      if (calm.matches || !event.isPrimary || event.button > 0 || event.ctrlKey) return; // Control-press is the Mac menu click
      drag = {id: event.pointerId, x: event.clientX, y: event.clientY, from: offset, moving: false, lastX: event.clientX, at: event.timeStamp, velocity: 0};
      sync();
    });
    on(window, "pointermove", event => {
      if (!drag || event.pointerId !== drag.id) return;
      const mouse = event.pointerType === "mouse";
      if (mouse && !(event.buttons & 1)) { release(event); return; } // the button came up where the page could not see it
      const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
      if (!drag.moving) {
        if (!mouse && Math.abs(dy) > TAP && Math.abs(dy) > Math.abs(dx)) { drag = null; suppressClick = true; sync(); return; }
        if (Math.abs(dx) <= TAP) return;
        drag.moving = suppressClick = true;
        setAside();
        if (view.contains(document.activeElement)) document.activeElement.blur(); // a drag is not a choice, so Space cannot open that card
        offset = drag.from = wrapped(offset);
        view.setPointerCapture(event.pointerId);
      }
      offset = wrapped(drag.from - dx);
      const dt = Math.max(8, event.timeStamp - drag.at);
      drag.velocity = (drag.lastX - event.clientX) / dt * 1000;
      drag.lastX = event.clientX; drag.at = event.timeStamp;
      place();
    });
    const release = event => {
      if (!drag || event.pointerId !== drag.id) return;
      const flick = drag.moving && event.pointerType !== "mouse" && event.timeStamp - drag.at < 100;
      const velocity = drag.velocity;
      drag = null;
      sync();
      if (flick && frame) coast = Math.max(-1400, Math.min(1400, velocity));
    };
    on(window, "pointerup", release);
    on(window, "pointercancel", release);
    on(window, "blur", () => { if (drag) { drag = null; sync(); } });
    on(view, "dragstart", event => event.preventDefault());
    on(view, "wheel", event => {
      const dx = event.shiftKey && !event.deltaX ? event.deltaY : event.deltaX;
      if (calm.matches) {
        // native scrolling handles sideways; not every browser turns Shift+wheel into it
        if (event.shiftKey && dx && !event.deltaX) { event.preventDefault(); view.scrollLeft += dx; }
        return;
      }
      if (!dx || (!event.shiftKey && Math.abs(dx) <= Math.abs(event.deltaY))) return;
      event.preventDefault();
      setAside();
      offset = wrapped(offset + dx);
      place();
    }, {passive: false});

    on(document, "visibilitychange", sync);
    // where overflow:clip is missing, focus can scroll the hidden overflow; the transform owns position
    on(view, "scroll", () => { if (!calm.matches && view.scrollLeft) view.scrollLeft = 0; });
    if (document.fonts) on(document.fonts, "loadingdone", layout);
    on(calm, "change", layout);

    const seen = new IntersectionObserver(entries => { onScreen = entries.at(-1).isIntersecting; sync(); });
    seen.observe(view);
    const resized = new ResizeObserver(() => {
      const box = view.getBoundingClientRect();
      if (Math.abs(box.width - width) < .5 && Math.abs(box.left - viewLeft) < .5) return;
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(layout);
    });
    resized.observe(view);

    layout();
    document.fonts?.ready.then(() => { if (alive) layout(); });
    const holdTimer = held ? setTimeout(() => { held = false; sync(); }, HOLD) : 0;

    current = {
      state: () => ({offset, loop, gap, running: !!frame, speed: phone.matches ? SPEED.phone : SPEED.wide, selected, ...reasons()}),
      seek: value => { offset = value; frozen = true; place(); sync(); },
      destroy() {
        alive = false;
        listeners.abort();
        seen.disconnect();
        resized.disconnect();
        clearTimeout(holdTimer);
        cancelAnimationFrame(frame);
        cancelAnimationFrame(resizeFrame);
        frame = 0;
      }
    };
  }

  function unmount() {
    current?.destroy();
    current = null;
  }

  return {html, mount, unmount, state: () => current?.state() ?? null, seek: value => current?.seek(value)};
})();
