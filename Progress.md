# Portfolio — Progress

Last updated: 2026-07-26

## What this is

A no-build, static portfolio site for Yujiyeon (product designer / branding), plus a
separate local "Builder" admin tool for authoring project detail pages without hand-editing
HTML. Everything runs by opening `.html` files directly in a browser — no server, no
npm/node, no build step.

## Live deployment

- **Custom domain**: https://www.yujihada.com (Cloudflare DNS → Vercel, both records
  set to "DNS only", not proxied — required for Vercel's SSL to issue correctly)
- **Vercel URL**: https://portfolio-pink-omega-69.vercel.app
- **GitHub repo**: https://github.com/jejeisacat/portfolio (public) — Vercel auto-deploys
  every push to `main`. No build step configured (Framework Preset: Other) since this is
  plain static HTML/CSS/JS.
- This machine has no Xcode Command Line Tools installed, so there's no local `git`/`gh`/
  `vercel` CLI. The initial repo and all 154 files were pushed using GitHub's REST
  Contents API directly via `curl` (base64-encoding each file), not git. The Builder's
  Publish button (below) uses the same API approach from the browser.

## Site structure

```
portfolio/
├── index.html              intro page — draggable card pile links to detail pages
├── sugo.html                detail page: SUGO
├── linden-bed.html          detail page: Linden Bed (BADMARLON)
├── dan.html                 detail page: Dan (BADMARLON)
├── peekaboo.html             detail page: Peek A Boo (BADMARLON)
├── maison-paris.html         + 14 more BADMARLON detail pages (see table below)
├── css/style.css            shared styles for all site pages
├── js/projects.js           PROJECTS array (sidebar Index + intro deck data) + dialogs
├── assets/
│   ├── fonts/               FriedelProTrial-Regular.otf (site's @font-face)
│   └── images/<slug>/       <slug>-01.jpg, -02.jpg, ... per project
└── builder/                 local admin tool, not part of the public site
    ├── index.html
    ├── builder.css
    └── builder.js
```

## Shared top bar (every page)

`.site-header` — brand "YUJIYEON" left, Information / Instagram / Email right — is
`position: fixed` across the whole site (intro, every detail page, and pages the Builder
exports), height set by the `--header-h` CSS variable (64px). It never moves, regardless
of scroll. Information → bio modal, Email → Contact modal (From + message; Send opens a
prefilled `mailto:`, no backend).

## Detail page template

- Left sidebar sits below the fixed top bar (`position: fixed; top: var(--header-h)`),
  and holds only the project Index (nested — BADMARLON groups all its sub-projects) +
  footer. No divider line next to it.
- Main (offset by `margin-left`/`margin-top` to clear the sidebar and top bar): back link,
  title + tagline, image gallery (natural aspect ratio, no cropping), Details grid
  (Client / Role, sometimes Year / Type) + Overview copy.
- English only — an EN/KO toggle was built and then removed at the designer's request;
  no bilingual scaffolding remains on the site pages.
- Site-wide type is set via a custom `@font-face` (Friedel Pro Trial,
  `assets/fonts/FriedelProTrial-Regular.otf`), falling back to the system sans-serif stack
  if it fails to load.

## Intro page (index.html)

Below the fixed top bar: a **pile of cards**, one per project (image only, no
name/caption — plain photo, 8:5 ratio, 16px corner radius, drop shadow). Cards render
already gathered in a loose stack at dead-center (`GATHERED_LAYOUT` in `js/projects.js`) —
there's no scatter/deal-out animation anymore. Hovering a card lifts/enlarges it and
brings it to front. **Cards are draggable** — pick one up and drop it anywhere; native
browser link/image dragging is disabled so the drop position actually sticks. A plain
click (no movement) still opens the project. A **"Gather" button** fixed at the bottom
center snaps every card back to its original pile position regardless of where it's been
dragged. Only projects with photos *and* a real `.html` page get a card.

## Content status per project

All BADMARLON sub-projects were sourced from the designer's own reorganized
`~/Documents/작업물/BADMARLON/` folder (photos selected, resized to max 1800px, ≤8 per
project). Most only have generic placeholder Details/Overview copy — real photos, no real
write-up yet — since there was no reliable source for client/year/role per item beyond
"BADMARLON."

| Project | Slug | Photos | Copy |
|---|---|---|---|
| SUGO | `sugo` | 6 | Real, written |
| Linden Bed | `linden-bed` | 6 | Real, written |
| Dan | `dan` | 8 (real photos, replacing old 3D-render placeholders) | Real, written |
| Peek A Boo | `peekaboo` | 8 | Real, written |
| Maison Paris | `maison-paris` | 8 | Generic placeholder |
| BADMARLON x SONO | `sono` | 6 | Generic placeholder |
| Como | `como` | 7 | Generic placeholder |
| Deauvile | `deauvile` | 4 | Generic placeholder |
| Haro | `haro` | 8 | Generic placeholder |
| Lapoo | `lapoo` | 4 | Generic placeholder |
| Marron | `marron` | 8 | Generic placeholder |
| moo | `moo` | 3 | Generic placeholder |
| Muret | `muret` | 8 | Generic placeholder |
| Nuts | `nuts` | 8 | Generic placeholder |
| provoo | `provoo` | 3 | Generic placeholder |
| provoo wood ver. | `provoo-wood` | 4 | Generic placeholder |
| Volvo X Bad Marlon | `volvo-x-badmarlon` | 7 | Generic placeholder |
| Rupel | `rupel` | 8 | Generic placeholder |
| Brdy | `brdy` | 5 | Generic placeholder |
| Villaine | `villaine` | 7 | Generic placeholder |
| Graphic Works | `graphic` | 0 | Not started |

Notes on source-folder cleanup decisions (in case something looks missing):
- Skipped a duplicate `LInden` folder — identical source to the already-built Linden Bed.
- Skipped English-named `Brdy`/`Villaine` folders that only had tiny web-exported `.avif`
  thumbnails — used the fuller real-photo folders instead (now renamed by the designer to
  match: `Rupel`, `Brdy`, `Villaine` folders all English).
- `Dan_The royal grocery X Badmarlon`'s real photography replaced the project's old
  placeholder 3D-render mockup images.

## The Builder (`builder/index.html`)

A local admin UI for editing project pages without touching HTML. State lives in the
browser's `localStorage` (per-browser, not synced anywhere) — nothing here is saved to
disk automatically. `DEFAULT_PROJECTS` (seed data, `SEED_VERSION = "3"`) now includes all
21 site projects, backfilled into any browser opening the tool for the first time (or
first time since the version bump) — existing projects already in someone's local storage
are never overwritten, only missing ones get added.

- **Left**: project list, nested under groups (e.g. BADMARLON). Drag to reorder — this
  order is exactly what ends up in the sidebar Index and the intro pile. "+ New Project",
  and "Copy PROJECTS Array" (serializes the whole groups/order/projects tree into the
  literal `const PROJECTS = [...]` block to paste into `js/projects.js`).
- **Center (editor)**: Name, Category (대분류 — assign to an existing group or create a
  new one), Slug, Tagline, Client/Role/Year/Type, Overview, and a **Generate** button.
  Photos show as a **grid, up to 4 per row** (`.photo-list` / `.photo-card` in
  `builder.css`), each card with: drag to reorder, alt text, a &#9733; button to pick
  which one is the **card image** used on the intro page's pile (defaults to the first
  photo if none is pinned), a &#9986; **crop** button that opens an in-browser crop dialog
  (drag the box to move it, drag a corner handle to resize, optional locked ratio via
  Free/1:1/4:5/4:3/16:9 pills, Apply Crop re-encodes just that photo via canvas), and a
  &#10530; **resize** button that re-encodes just that photo to a new max dimension via
  canvas (prompts for the target size; works for newly-added photos and, best-effort, for
  on-disk ones — falls back to an error message if the browser won't allow reading that
  file into a canvas).
- **Generate button** opens a settings dialog (Language EN/KO, Tone Reference, Voice,
  Length, Structure, Photo Flow, Emphasis, Tone Notes) and fills tagline/overview (and
  photos, where Claude already sourced some) straight into the fields — no API call, no
  copy-paste. Each click now writes **both** an English and a Korean draft at once
  (`taglineEn`/`overviewEn` and `taglineKo`/`overviewKo` on the project record); the
  Language pill only picks which one is shown/edited immediately after. Two small **EN /
  KO** toggle buttons next to Generate switch which draft is showing without regenerating,
  and manual edits are saved into whichever language is currently active so switching back
  and forth doesn't lose anything. For SUGO / Linden Bed / Dan / Peek A Boo / Graphic Works
  this pulls from hand-written copy (`AI_CONTENT` in `builder.js`) in both languages;
  Length/Structure/Photo Flow genuinely change the output. Voice/Tone Reference/Tone Notes
  are captured and saved per project but don't change the canned text yet. The 16 newer
  BADMARLON projects aren't in `AI_CONTENT`, so Generate falls back to a simple auto-built
  template (in both languages) for them instead of real researched copy. Regenerating no
  longer prompts to overwrite unless the current text was hand-typed and doesn't already
  match a stored draft — earlier this asked on nearly every click, which was easy to miss
  and looked like Generate wasn't working at all.
- **Right**: live preview iframe using the site's real `css/style.css`, with a PC/Mobile
  toggle. PC always renders a real 1440px-wide layout internally (so it never trips the
  site's mobile breakpoint) and is scaled down to fit — sidebar and content show side by
  side, like the real page, at any preview panel width. Mobile renders at a real 390×844.
- **Export Page & Images** downloads `<slug>.html` (identical template to the real pages)
  plus any newly-added photos (already-on-disk photos aren't re-downloaded). You then move
  the file/photos into place by hand and paste the "Copy PROJECTS Array" output into
  `js/projects.js`. Kept as a manual fallback.
- **Publish** (next to Export) pushes the project live with one click, no download/move
  step: it PUTs the page HTML, any new photos, and a freshly-regenerated `js/projects.js`
  straight to the GitHub repo via the Contents API (`fetch`, base64-encoded content) —
  Vercel then auto-deploys. First use prompts for the GitHub repo (`owner/repo`) and a
  Personal Access Token (`repo` scope); both are saved in that browser's `localStorage`
  only (`portfolioBuilder.github`), never written to any file. "깃허브 설정" next to the
  button reopens that prompt if the token needs replacing. Requires being online and the
  token having write access to the repo — Chrome/Edge/Safari all fine here since it's
  plain `fetch`, not the File System Access API.

## Known limitations / honesty notes

- No backend: Export and "Copy PROJECTS Array" require manually moving downloaded files
  into `assets/images/<slug>/` and pasting the array into `js/projects.js`.
- No real AI/API call anywhere — Generate uses pre-written content (this conversation) plus
  deterministic local logic (length/structure/photo-flow), not a live model.
- Builder state is per-browser `localStorage`; not a durable backup. Export regularly.
- 16 of the 19 BADMARLON sub-projects have real photos but only generic "part of the
  BADMARLON collection" placeholder copy — no client/year/role details were available to
  write real Overview text honestly. Worth a real writing pass per project.
- Gallery `<img>` tags on the 16 newer BADMARLON pages don't have `width`/`height`
  attributes (the hand-built template normally sets these to prevent layout shift) — a
  minor gap from generating them via a batch script rather than the Builder.
- Fixed: seeded photos from `DEFAULT_PROJECTS` had no `id`, so every photo in a project
  compared equal and the cover-photo star lit up on all of them at once (and clicking one
  did nothing visible). `ensureDefaultsSeeded()` now assigns ids on seed, and `loadState()`
  repairs any already-saved photos missing one, on every load.
- The Builder itself is Korean-only tooling for the designer. The public site is
  English-only (a visitor-facing EN/KO toggle was tried and removed); the Generate
  dialog's own Language pill still lets you draft either language into a project's
  fields, independent of that removed toggle.

## Suggested next steps

1. Write real Details/Overview copy for the 16 generic-placeholder BADMARLON projects
   (client, year, role, what the piece actually is) — best done by the designer directly,
   since the folder names alone don't say enough to write it honestly.
2. Build the Graphic Works project (pick source images, run through the Builder).
3. Decide whether Voice/Tone Reference/Tone Notes in Generate should do more, or be trimmed
   if they're not earning their space.
4. Swap placeholder contact info if `hello@yujiyeon.com` isn't the real address (Instagram
   is already the real `@jiy.y`).
5. Consider adding `width`/`height` to the newer pages' gallery images for smoother loading.
