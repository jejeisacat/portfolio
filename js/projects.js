// Shared project index. Add a new project here and every page's sidebar TOC updates.
// `href: null` renders as a disabled (not-yet-built) entry.
// A project with `children` renders as a group header (BADMARLON) with sub-projects nested under it.
const PROJECTS = [
  {
    slug: "sugo",
    name: "SUGO",
    href: "sugo.html",
    thumb: "assets/images/sugo/sugo-06.jpg",
    meta: "SUGO — Ceramic Tableware"
  },
  {
    slug: "badmarlon",
    name: "BADMARLON",
    href: null,
    children: [
      {
        slug: "dan",
        name: "Dan",
        href: "dan.html",
        thumb: "assets/images/dan/dan-01.jpg",
        meta: "BADMARLON"
      },
      {
        slug: "peekaboo",
        name: "Peek A Boo",
        href: "peekaboo.html",
        thumb: "assets/images/peekaboo/peekaboo-01.jpg",
        meta: "BADMARLON"
      },
      {
        slug: "linden-bed",
        name: "Linden Bed",
        href: "linden-bed.html",
        thumb: "assets/images/linden-bed/linden-bed-03.jpg",
        meta: "BADMARLON — Pet Furniture, Solid Wood"
      },
      {
        slug: "maison-paris",
        name: "Maison Paris",
        href: "maison-paris.html",
        thumb: "assets/images/maison-paris/maison-paris-01.jpg",
        meta: "BADMARLON"
      },
      {
        slug: "sono",
        name: "BADMARLON x SONO",
        href: "sono.html",
        thumb: "assets/images/sono/sono-01.jpg",
        meta: "BADMARLON"
      },
      {
        slug: "como",
        name: "Como",
        href: "como.html",
        thumb: "assets/images/como/como-01.jpg",
        meta: "BADMARLON"
      },
      {
        slug: "deauvile",
        name: "Deauvile",
        href: "deauvile.html",
        thumb: "assets/images/deauvile/deauvile-03.jpg",
        meta: "BADMARLON"
      },
      {
        slug: "haro",
        name: "Haro",
        href: "haro.html",
        thumb: "assets/images/haro/haro-01.jpg",
        meta: "BADMARLON"
      },
      {
        slug: "lapoo",
        name: "Lapoo",
        href: "lapoo.html",
        thumb: "assets/images/lapoo/lapoo-01.jpg",
        meta: "BADMARLON"
      },
      {
        slug: "marron",
        name: "Marron",
        href: "marron.html",
        thumb: "assets/images/marron/marron-01.jpg",
        meta: "BADMARLON"
      },
      {
        slug: "moo",
        name: "moo",
        href: "moo.html",
        thumb: "assets/images/moo/moo-01.jpg",
        meta: "BADMARLON"
      },
      {
        slug: "muret",
        name: "Muret",
        href: "muret.html",
        thumb: "assets/images/muret/muret-01.jpg",
        meta: "BADMARLON"
      },
      {
        slug: "nuts",
        name: "Nuts",
        href: "nuts.html",
        thumb: "assets/images/nuts/nuts-05.jpg",
        meta: "BADMARLON"
      },
      {
        slug: "provoo",
        name: "provoo",
        href: "provoo.html",
        thumb: "assets/images/provoo/provoo-01.jpg",
        meta: "BADMARLON"
      },
      {
        slug: "provoo-wood",
        name: "provoo wood ver.",
        href: "provoo-wood.html",
        thumb: "assets/images/provoo-wood/provoo-wood-01.jpg",
        meta: "BADMARLON"
      },
      {
        slug: "volvo-x-badmarlon",
        name: "Volvo X Bad Marlon",
        href: "volvo-x-badmarlon.html",
        thumb: "assets/images/volvo-x-badmarlon/volvo-x-badmarlon-02.jpg",
        meta: "BADMARLON"
      },
      {
        slug: "rupel",
        name: "Rupel",
        href: "rupel.html",
        thumb: "assets/images/rupel/rupel-08.jpg",
        meta: "BADMARLON"
      },
      {
        slug: "brdy",
        name: "Brdy",
        href: "brdy.html",
        thumb: "assets/images/brdy/brdy-01.jpg",
        meta: "BADMARLON"
      },
      {
        slug: "villaine",
        name: "Villaine",
        href: "villaine.html",
        thumb: "assets/images/villaine/villaine-01.jpg",
        meta: "BADMARLON"
      }
    ]
  },
  {
    slug: "graphic",
    name: "Graphic Works",
    href: null
  }
];

function renderProjectIndex() {
  const list = document.getElementById("project-index");
  if (!list) return;
  const current = document.body.dataset.project;

  const itemRow = (name, href, num) => {
    const inner = num != null
      ? `<span class="idx">${num}</span><span class="name">${name}</span>`
      : `<span class="name">${name}</span>`;
    return href
      ? `<a href="${href}">${inner}</a>`
      : `<span class="disabled" title="Coming soon">${inner}</span>`;
  };

  list.innerHTML = PROJECTS.map((p, i) => {
    const num = String(i + 1).padStart(2, "0");
    const children = p.children || [];
    const active = p.slug === current;
    const row = itemRow(p.name, p.href, num);

    let sub = "";
    if (children.length) {
      sub = `<ul class="project-subindex">${children.map((c) => {
        const childActive = c.slug === current;
        return `<li class="${childActive ? "active" : ""}">${itemRow(c.name, c.href, null)}</li>`;
      }).join("")}</ul>`;
    }

    return `<li class="${active ? "active" : ""}">${row}${sub}</li>`;
  }).join("");
}

// Small hand-placed offsets from dead-center, forming a loose gathered pile
// (not a wide scatter). Cards land here on load and whenever "Gather" is
// pressed. Cycles with a slightly larger nudge per extra lap if there are
// ever more projects than presets, so a big pile still reads as a pile.
const GATHERED_LAYOUT = [
  { tx: -15, ty: 8, r: -6 },
  { tx: 12, ty: -10, r: 5 },
  { tx: -8, ty: 18, r: -3 },
  { tx: 20, ty: 5, r: 7 },
  { tx: -22, ty: -12, r: -8 },
  { tx: 6, ty: 20, r: 4 },
  { tx: -18, ty: -6, r: 8 },
  { tx: 15, ty: -18, r: -5 },
];

function gatheredPosition(i) {
  const lap = Math.floor(i / GATHERED_LAYOUT.length);
  const base = GATHERED_LAYOUT[i % GATHERED_LAYOUT.length];
  const spread = 1 + lap * 0.5;
  return { tx: Math.round(base.tx * spread), ty: Math.round(base.ty * spread), r: base.r };
}

function renderProjectGrid() {
  const grid = document.getElementById("project-grid");
  if (!grid) return;

  const leaves = PROJECTS.flatMap((p) => (p.children && p.children.length ? p.children : [p]))
    .filter((p) => p.href && p.thumb);

  grid.innerHTML = leaves.map((p, i) => {
    const { tx, ty, r } = gatheredPosition(i);
    const style = [
      `--tx:${tx}px`,
      `--ty:${ty}px`,
      `--r:${r}deg`,
      `z-index:${i + 1}`,
    ].join(";");
    return `
      <a class="grid-item" href="${p.href}" style="${style}" data-gather-tx="${tx}" data-gather-ty="${ty}" data-gather-r="${r}" draggable="false">
        <span class="card"><img src="${p.thumb}" alt="${p.name}" loading="lazy" draggable="false"></span>
      </a>`;
  }).join("");

  initDeckDrag(grid);
  initGatherButton(grid);
}

// The "Gather" button snaps every card back to the pile position it was
// dealt at, regardless of where it's been dragged to since.
function initGatherButton(scope) {
  const btn = document.getElementById("gather-btn");
  if (!btn) return;
  btn.onclick = () => {
    scope.querySelectorAll(".grid-item").forEach((item) => {
      item.style.setProperty("--tx", `${item.dataset.gatherTx}px`);
      item.style.setProperty("--ty", `${item.dataset.gatherTy}px`);
      item.style.setProperty("--r", `${item.dataset.gatherR}deg`);
    });
  };
}

// Lets you pick up a dealt card and drop it anywhere. A plain click (no
// movement) still opens the project; a real drag suppresses that click.
// Shared across all cards in the pile: each time a card is picked up, it
// claims the next z-index, so whichever one you last dragged stays on top
// permanently — not just while the mouse happens to be over it.
let deckFrontZ = 1000;

function initDeckDrag(scope) {
  scope.querySelectorAll(".grid-item").forEach((item) => {
    let pressed = false;
    let dragging = false;
    let startX = 0, startY = 0, startTx = 0, startTy = 0;
    let justDragged = false;

    // Belt-and-suspenders: some browsers still start a native link/image
    // drag (ghost image, URL drag) despite draggable="false" in markup.
    item.addEventListener("dragstart", (e) => e.preventDefault());

    item.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      pressed = true;
      dragging = false;
      startX = e.clientX;
      startY = e.clientY;
      startTx = parseFloat(item.style.getPropertyValue("--tx")) || 0;
      startTy = parseFloat(item.style.getPropertyValue("--ty")) || 0;
      item.setPointerCapture(e.pointerId);
      // Claim front-most the instant it's picked up, not only once the drag
      // threshold is crossed — a click that never turns into a drag still
      // shouldn't leave the card looking picked-up-then-abandoned underneath.
      item.style.zIndex = String(++deckFrontZ);
    });

    item.addEventListener("pointermove", (e) => {
      if (!pressed) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (!dragging && Math.hypot(dx, dy) > 4) {
        dragging = true;
        item.classList.add("dragging");
      }
      if (dragging) {
        item.style.setProperty("--tx", `${startTx + dx}px`);
        item.style.setProperty("--ty", `${startTy + dy}px`);
      }
    });

    const endPress = (e) => {
      if (dragging) {
        justDragged = true;
        requestAnimationFrame(() => { justDragged = false; });
      }
      pressed = false;
      dragging = false;
      item.classList.remove("dragging");
      if (e?.pointerId != null) item.releasePointerCapture(e.pointerId);
    };
    item.addEventListener("pointerup", endPress);
    item.addEventListener("pointercancel", endPress);

    item.addEventListener("click", (e) => {
      if (justDragged) e.preventDefault();
    });
  });
}

function initInfoDialog() {
  const dialog = document.getElementById("info-dialog");
  const openBtn = document.getElementById("open-info");
  const closeBtn = document.getElementById("close-info");
  if (!dialog || !openBtn) return;

  openBtn.addEventListener("click", () => dialog.showModal());
  closeBtn?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });
}

function initContactDialog() {
  const dialog = document.getElementById("contact-dialog");
  const openBtn = document.getElementById("open-contact");
  const closeBtn = document.getElementById("close-contact");
  const cancelBtn = document.getElementById("cancel-contact");
  const form = document.getElementById("contact-form");
  if (!dialog || !openBtn) return;

  openBtn.addEventListener("click", () => dialog.showModal());
  closeBtn?.addEventListener("click", () => dialog.close());
  cancelBtn?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const from = document.getElementById("contact-from").value.trim();
    const message = document.getElementById("contact-message").value.trim();
    const subject = encodeURIComponent(`Portfolio inquiry from ${from}`);
    const body = encodeURIComponent(`${message}\n\n—\nFrom: ${from}`);
    window.location.href = `mailto:hello@yujiyeon.com?subject=${subject}&body=${body}`;
    dialog.close();
    form.reset();
  });
}

// Mobile only (see the max-width:860px rules in style.css) — the sidebar
// Index list is collapsed by default there so it doesn't push the actual
// project content down the page. This just toggles the class; on desktop
// widths the collapse styling doesn't apply, so the click is a harmless no-op.
function initTocToggle() {
  const toggle = document.getElementById("toc-toggle");
  const sidebar = document.querySelector(".sidebar");
  if (!toggle || !sidebar) return;
  toggle.addEventListener("click", () => sidebar.classList.toggle("expanded"));
}

document.addEventListener("DOMContentLoaded", () => {
  renderProjectIndex();
  renderProjectGrid();
  initInfoDialog();
  initContactDialog();
  initTocToggle();
});
