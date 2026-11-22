"use strict";
/* Credits: "How it came together" (mockup, Ken 2026-11-22).
   Motion follows the assumptions strip: right to left, a click or tap stops and restarts, drag or swipe either way. */
window.CreditsPhotos = (() => {
  // Story order, by the capture time in each original. Alt text names only Ken.
  const photos = [
    [1201, "Ken Priore writes on a whiteboard next to cards of open questions."],
    [1201, "Ken Priore smiles as he turns to the person sitting next to him during a session."],
    [1201, "Ken Priore raises a hand mid-sentence as he talks with another participant."],
    [1200, "Ken Priore sits in a circle of participants around picture cards spread across the floor."],
    [1201, "Ken Priore, a notepad on his knee, listens during a group discussion."],
    [1201, "Ken Priore laughs with others in the circle."],
    [1201, "Ken Priore leans back in his chair and listens to the discussion."],
    [1201, "Ken Priore holds his notes and presents in front of a Three Horizons chart."],
    [1201, "Ken Priore talks two participants through a Three Horizons chart."]
  ];
  const phone = matchMedia("(max-width:670px)");
  // COPY.md, Captions: a season and NYC, never a day or a month.
  const caption = index => (index < 6 ? "NYC · Spring 2026" : "NYC · Summer 2026");
  const calm = matchMedia("(prefers-reduced-motion:reduce)");
  const SPEED = {wide: 40, phone: 30};
  const HOLD = 1200; // a beat on the first photo before it leaves
  const TAP = 8;     // px of travel before a press counts as a drag
  let current = null;

  const list = copy => photos.map(([height, alt], index) => {
    const file = `photos/${String(index + 1).padStart(2, "0")}`;
    return `<li class="cp-photo" data-index="${index}" style="--ratio:${1800 / height}">
      <img width="1800" height="${height}" alt="${copy ? "" : alt}" decoding="async" draggable="false"
        data-src="${file}.jpg" data-srcset="${file}-720.jpg 720w, ${file}-1200.jpg 1200w, ${file}.jpg 1800w"><span class="cp-cap">${caption(index)}</span></li>`;
  }).join("");

  // The words are explorations/credits-photos/COPY.md, Draft (v2, Ken's answers), unchanged.
  // .cp-keep adds no words: it stops a sentence leaving its first or last word alone at a line's edge.
  function html() {
    return `<section class="cp-story wrap" aria-labelledby="cp-title">
      <h2 class="cp-title" id="cp-title">How it came together</h2>
      <div class="cr-cols">
        <div class="cp-col">
          <p class="cp-cell cp-start">Pathways began in <span class="cp-keep">November 2025</span> at the <span class="cp-keep">TLTF Summit</span> in Austin, where more than 120 people mapped the shifts already underway in the business <span class="cp-keep">of law.</span> <span class="cp-keep">The LegalTech</span> Fund and Law.com convened the work with Harvey, and <span class="cr-end1">Leaders’ Quest designed <span class="cp-keep">and guided it.</span></span></p>
          <p class="cp-cell cp-seat">TLTF asked me to join the second phase, which met in NYC in the spring and summer <span class="cp-keep">of 2026.</span> <span class="cp-keep">The group</span> took the seat of <span class="cp-keep">in-house</span> legal, because what legal departments buy often shapes how far <span class="cr-end2">the rest of the <span class="cp-keep">industry changes.</span></span></p>
        </div>
        <div class="cp-col">
          <p class="cp-cell cp-phase">That phase ran as <span class="cp-keep">three convenings.</span> <span class="cp-keep">The first</span> narrowed what we didn’t know to three open questions, which made eight possible combinations, and four were chosen <span class="cp-keep">to develop.</span> <span class="cp-keep">The second</span> tested whether each world was plausible and <span class="cp-keep">held together.</span> <span class="cp-keep">The third</span> asked what each would mean for legal departments, law firms, legal tech and <span class="cr-end3d">the public, <span class="cr-end3c">and <span class="cr-end3b">what <span class="cr-end3a">to <span class="cp-keep">watch for.</span></span></span></span></span></p>
          <p class="cp-cell cp-moment"><span class="cp-keep">What I</span> remember most is the time between sessions, when we could already see the outlines of the four worlds taking shape <span class="cp-keep">in the news.</span> <span class="cp-keep">I also</span> changed my mind along the way, and came to think that maybe <span class="cr-end4">law firms could <span class="cp-keep">reinvent themselves.</span></span></p>
        </div>
      </div>
    </section>`;
  }

  // The last section of the page, after the thank-you block (Ken: "move the photo strip to the bottom of the pae").
  function strip() {
    return `<section class="cp-strip"><div class="cp-in">
      <div class="cp-view" role="region" aria-roledescription="carousel" aria-label="Photos of Ken Priore at Pathways" tabindex="0">
        <div class="cp-track"><ul class="cp-set cp-real">${list(false)}</ul></div>
      </div>
      <p class="cp-credit">Photos: Studio Brooke</p>
    </div></section>`;
  }

  function mount(root) {
    const view = root.querySelector(".cp-view");
    if (!view) return;
    const track = view.querySelector(".cp-track");
    const real = view.querySelector(".cp-real");
    const items = [...real.children];
    const listeners = new AbortController();
    const on = (target, type, handler, options = {}) => target.addEventListener(type, handler, {signal: listeners.signal, ...options});

    const query = new URLSearchParams(location.search).get("photos");
    let frozen = query !== null && query !== "" && Number.isFinite(Number(query));
    let offset = frozen ? Number(query) : 0;
    let held = !frozen, paused = false, onScreen = false, near = false, alive = true;
    let holdTimer = 0, loop = 0, width = 0, height = 0, starts = [], slots = [];
    let frame = 0, last = null, resizeFrame = 0, drag = null, suppressClick = false, coast = 0;

    const wrapped = value => ((value % loop) + loop) % loop;

    // Only the photos in the window, and the ones about to enter it, are requested.
    function load() {
      if (!near) return;
      const left = calm.matches ? view.scrollLeft : offset;
      slots = slots.filter(slot => {
        if (slot.left + slot.width < left - width * .05 || slot.left > left + width * 1.2) return true;
        const img = slot.img;
        img.sizes = `${Math.ceil(slot.width)}px`;
        img.srcset = img.dataset.srcset;
        img.src = img.dataset.src;
        return false;
      });
    }

    function place() {
      if (!loop || calm.matches) return;
      if (offset >= loop || offset < 0) offset = wrapped(offset);
      track.style.transform = `translate3d(${-offset}px,0,0)`;
      load();
    }

    const reasons = () => ({paused, frozen, held, calm: calm.matches, dragging: !!drag, hidden: document.hidden, offscreen: !onScreen});
    const canRun = () => alive && loop > 0 && !Object.values(reasons()).some(Boolean);

    function tick(now) {
      frame = 0;
      if (!canRun()) { sync(); return; }
      const seconds = last === null ? 0 : Math.min((now - last) / 1000, .25);
      last = now;
      offset = wrapped(offset + ((phone.matches ? SPEED.phone : SPEED.wide) + coast) * seconds);
      coast = Math.abs(coast) < 3 ? 0 : coast * Math.exp(-seconds / .32);
      place();
      frame = requestAnimationFrame(tick);
    }

    function sync() {
      if (canRun()) {
        if (!frame) { last = null; frame = requestAnimationFrame(tick); }
        return;
      }
      if (frame) {
        cancelAnimationFrame(frame);
        offset = Math.round(offset); // rest on a whole pixel, so faces stay crisp
        place();
      }
      frame = 0; last = null; coast = 0;
    }

    function layout() {
      if (!alive) return;
      const before = loop;
      const scrolled = calm.matches ? view.scrollLeft : 0;
      track.querySelectorAll(".cp-copy").forEach(node => node.remove());
      view.classList.toggle("still", calm.matches);
      view.setAttribute("aria-description", calm.matches
        ? "Left and right arrow keys move through the photos"
        : "Enter or Space stops and starts the motion. Left and right arrow keys move one photo");
      real.style.width = "";
      // a whole-pixel lap, so the copy lands on the same pixels and the wrap cannot show
      loop = Math.ceil(real.getBoundingClientRect().width);
      if (!calm.matches) real.style.width = `${loop}px`;
      ({width, height} = view.getBoundingClientRect());
      starts = items.map(item => item.getBoundingClientRect().left - real.getBoundingClientRect().left);
      const sets = [[real, 0]];
      if (calm.matches) {
        track.style.transform = "";
      } else {
        for (const shift of [-loop, loop]) {
          const copy = document.createElement("ul");
          copy.className = "cp-set cp-copy";
          copy.setAttribute("aria-hidden", "true");
          copy.innerHTML = list(true);
          copy.style.left = `${shift}px`;
          track.append(copy);
          sets.push([copy, shift]);
        }
        view.scrollLeft = 0;
        if (before && !frozen) offset *= loop / before;
      }
      slots = [];
      for (const [set, shift] of sets) {
        [...set.children].forEach((item, index) => {
          const img = item.firstElementChild;
          const size = item.getBoundingClientRect().width;
          // an already loaded photo can need a sharper file after a resize
          if (img.hasAttribute("src")) img.sizes = `${Math.ceil(size)}px`;
          else slots.push({img, left: starts[index] + shift, width: size});
        });
      }
      if (calm.matches) { view.scrollLeft = scrolled; load(); } else place();
      sync();
    }

    function toggle() {
      if (calm.matches) return;
      if (paused || frozen) paused = frozen = held = false;
      else paused = true;
      sync();
    }

    // Arrow keys stop it on a whole photo, flush with the window's left edge.
    function step(direction) {
      const from = calm.matches ? view.scrollLeft : wrapped(offset);
      const all = [-loop, 0, loop].flatMap(shift => starts.map(start => start + shift));
      const target = direction > 0 ? all.find(x => x > from + 2) : all.filter(x => x < from - 2).pop();
      if (calm.matches) {
        view.scrollLeft = Math.max(0, Math.min(view.scrollWidth - view.clientWidth, target));
      } else {
        paused = true;
        sync();
        offset = wrapped(target);
        place();
      }
    }

    on(view, "click", event => {
      const dragged = suppressClick && event.detail > 0;
      suppressClick = false;
      if (!dragged) toggle();
    });

    on(view, "keydown", event => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        step(event.key === "ArrowRight" ? 1 : -1);
      } else if ((event.key === "Enter" || event.key === " ") && !calm.matches) {
        event.preventDefault();
        if (!event.repeat) toggle();
      }
    });

    // Sideways moves the photos; up and down is left to the page. A drag is not a tap, so a stopped strip stays stopped.
    on(view, "pointerdown", event => {
      suppressClick = false;
      if (!event.isPrimary || event.button > 0) return;
      const still = calm.matches;
      if (still && event.pointerType !== "mouse") return; // touch scrolls natively
      drag = {id: event.pointerId, x: event.clientX, y: event.clientY, still, from: still ? view.scrollLeft : offset,
        moving: false, lastX: event.clientX, at: event.timeStamp, velocity: 0};
      sync();
    });
    on(window, "pointermove", event => {
      if (!drag || event.pointerId !== drag.id) return;
      const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
      if (!drag.moving) {
        if (Math.abs(dy) > TAP && Math.abs(dy) > Math.abs(dx)) { drag = null; suppressClick = true; sync(); return; }
        if (Math.abs(dx) <= TAP) return;
        drag.moving = suppressClick = true;
        view.classList.add("dragging");
        view.setPointerCapture(event.pointerId);
      }
      if (drag.still) view.scrollLeft = drag.from - dx;
      else { offset = wrapped(drag.from - dx); place(); }
      const dt = Math.max(8, event.timeStamp - drag.at);
      drag.velocity = (drag.lastX - event.clientX) / dt * 1000;
      drag.lastX = event.clientX; drag.at = event.timeStamp;
    });
    function release(event) {
      if (!drag || event.pointerId !== drag.id) return;
      const flick = drag.moving && event.pointerType !== "mouse" && event.timeStamp - drag.at < 100;
      const velocity = drag.velocity;
      drag = null;
      view.classList.remove("dragging");
      sync();
      if (flick && frame) coast = Math.max(-1400, Math.min(1400, velocity));
    }
    on(window, "pointerup", release);
    on(window, "pointercancel", release);
    on(window, "blur", () => { if (drag) { drag = null; view.classList.remove("dragging"); sync(); } });
    on(view, "dragstart", event => event.preventDefault());
    on(view, "wheel", event => {
      if (calm.matches) return;
      const dx = event.shiftKey && !event.deltaX ? event.deltaY : event.deltaX;
      if (!dx || (!event.shiftKey && Math.abs(dx) <= Math.abs(event.deltaY))) return;
      event.preventDefault();
      offset = wrapped(offset + dx);
      place();
    }, {passive: false});

    on(view, "scroll", () => {
      if (calm.matches) load();
      else if (view.scrollLeft) view.scrollLeft = 0; // the transform owns position
    });
    on(document, "visibilitychange", sync);
    on(calm, "change", layout);

    const ahead = new IntersectionObserver(entries => {
      if (!entries.at(-1).isIntersecting) return;
      near = true; load(); ahead.disconnect();
    }, {rootMargin: "300px 0px"});
    ahead.observe(view);
    const seen = new IntersectionObserver(entries => {
      onScreen = entries.at(-1).isIntersecting;
      // the beat starts when the strip is first seen, since it now sits far below the opening screen
      if (onScreen && held && !holdTimer) holdTimer = setTimeout(() => { held = false; sync(); }, HOLD);
      sync();
    });
    seen.observe(view);
    const resized = new ResizeObserver(() => {
      const box = view.getBoundingClientRect();
      if (Math.abs(box.width - width) < .5 && Math.abs(box.height - height) < .5) return;
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(layout);
    });
    resized.observe(view);

    layout();

    current = {
      state: () => ({offset, loop, starts, running: !!frame, speed: phone.matches ? SPEED.phone : SPEED.wide, ...reasons()}),
      seek(value) { offset = value; frozen = true; place(); sync(); },
      destroy() {
        alive = false;
        listeners.abort();
        [ahead, seen, resized].forEach(observer => observer.disconnect());
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

  return {html, strip, mount, unmount, state: () => current?.state() ?? null, seek: value => current?.seek(value)};
})();
