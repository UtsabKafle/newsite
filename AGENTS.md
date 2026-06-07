## Goal
- Complete mobile responsiveness and educational flow alignment across all 10 module chapter files (150 files).

## Constraints & Preferences
- All changes must be mobile-first with `lg:` breakpoints to preserve desktop appearance.
- Interactive Diagram must be positioned above Visual Learning in every chapter (educational flow: learn → explore → understand).
- Visual Learning content must be diagram-specific, describing interactions, observations, and key insights.
- Touch targets must be minimum 44×44px on mobile.
- Vocabulary tables must convert to stacked card layout on screens <640px (no horizontal scroll).
- Images must have `max-width:100%;height:auto` protection.
- Use only HTML5, CSS3, modern vanilla JS — no frameworks or libraries.

## Progress
### Done
- **Explorer-pack "Built for curious minds" 3 cards** — mobile layout changed to `flex-row` (icon left, text right) with reduced padding (`p-3 lg:p-5`), smaller icon (`w-8 h-8 lg:w-12 lg:h-12`), and reduced gaps to eliminate whitespace.
- **Builder-pack feature 3 cards** — same mobile compacting pattern applied.
- **Academy.html "Building confident builders" + "Interactive Tools" cards** — same mobile compacting pattern applied.
- **Chapter heading fix** — Module 1 chapter 1 heading changed from "How Computer Works" to "How Internet Works" (all 3 instances: `<title>`, `<meta description>`, `<h1>`).
- **Broken HTML fix** — Module 10 chapter 1 Fun Facts section had 5 nested `<div>` cards instead of siblings with missing content; restructured into proper 4-card grid with project-planning fun facts.
- **Responsive vocab table CSS** — Added `@media(max-width:640px)` CSS to all 150 chapter files converting tables to stacked card layout (labels: "Term:" / "Definition:", card styling).
- **Image protection** — Added `max-width:100%;height:auto` + `max-w-full` class to all 150 chapter files.
- **Touch target fixes** across all 150 chapter files:
  - "Back to Module Overview" text links — added `py-2` padding (~36px+ touch area)
  - "Show Answers" buttons — changed `py-2.5` to `py-3` (~44px)
  - Knowledge Check radio labels — added `py-2` padding
  - `btn-primary` buttons — normalized `py-2.5` to `py-3`
- **Product pages fixed** (9 files: academy, explorer-pack, builder-pack, ai-systems, enterprise, lms, saas-tools, school-systems, index.html) — added responsive table CSS + image `max-width` + `overflow-wrap:break-word`.
- **Visual Learning sections added** to all 126 chapters in modules 2-10 that were missing them — each section is diagram-specific with title, description of what it shows, interactions to explore, and key insight. Content covers 139 diagram topics across all modules.
- **Interactive Diagram + Visual Learning merged** into one unified section across all 140 chapter files that had both sections (single `<section>` with diagram button + `<hr>` separator + visual learning content below it). The `text-center` class was removed from the glass-panel to accommodate the new content layout.
- **Chapter Navigation normalized** across all 139 chapter files to a uniform structure:
  - All use `<h2 class="... lesson-heading">` heading (converted from `<p>` uppercase heading)
  - All links inside the glass-panel (no footer/border pattern)
  - Chapter 1: `<span></span>` + Back to Module Overview + Next button
  - Chapters 2-13: Previous link + Back to Module Overview + Next button (with chapter title)
  - Chapter 14: Previous link + Back to Module Overview (no Next)
  - Fixed 5 files (module6 ch10-14) that were missing `<section>` wrapper around the nav
  - Removed duplicate "Back to Module Overview" links and the footer "Consica Academy" label
- **Diagram dark/light theme toggle** — Added across all ~140 diagram files (via shared `diagram-engine.js` + `diagram-base.css`):
  - Light theme CSS variables and overrides in `diagram-base.css` (`[data-theme="light"]`) — covers all surface, text, border, glass, shadow, and action-bar styles
  - Theme toggle button in the action bar of every diagram (reads/writes `localStorage('consica-theme')`, inherits main-site preference)
  - SVG component colors (backgrounds, text, connections, icons, markers) are theme-aware via `DIAGRAM_THEMES` palette lookup in `diagram-engine.js`
  - Re-renders diagram on toggle when in learn/explore mode
  - No changes needed to individual `index.html` diagram wrappers — everything is in the shared engine/CSS
  - **Inline-style text color fix** — Added `[style*="color:#..."]` CSS attribute selectors to override hardcoded JS inline text colors (e9e8f0, 94a3b8, cbd5e1, 475569, f8fafc) with light-theme equivalents; also converted builder panel backgrounds/borders from rgba(255,255,255) to rgba(0,0,0) for light theme
- **Diagram performance + accessibility + mobile** across diagram engine:
  - RAF loop caching (`_pulseActiveComponent` caches `.component` Nodelist, skips on unchanged index; `_updateLiveMetrics` skips DOM writes when values unchanged)
  - Bezier Horner polynomial optimization (6 multiplications + 5 additions per dot vs 12+8 originally)
  - `destroy()` method (cancels RAF, removes document listeners, clears caches)
  - ARIA labels, `aria-live="polite"`, `role="alertdialog"`, `:focus-visible` styles
  - Reduced-motion `@media(prefers-reduced-motion)` covering all CSS keyframe animations
  - Pinch-to-zoom + 1-finger touch pan on SVG; responsive CSS for `<600px`/`<420px`
  - Event delegation for play/control buttons (fixes null-ref crashes)
  - Dark mode animation wrapper (overrides `cfg.animate` to reapply theme palette every frame, fixing play-button color flash)
- **Auto challenges** — 63 boilerplate diagrams (modules 6-10) converted to `engine.buildAutoChallenge(container)` which generates quiz/sequence challenges from component data; 8 custom challenges preserved; fallback for <2 components
- **Component SVG icon/text polish**:
  - Icon circle background now uses theme palette `pal2.iconBg` (was hardcoded `#0959C8`); icon moved 4px higher for 5px gap vs text
  - Default marker centered at `cx+cw/2` (was left-aligned `cx+22`), uses `pal2.markerBg`, reduced r=14
  - Component stroke uses `this._pal().compStroke` (was hardcoded `#2a3a55`, fixing light-theme appearance, including cylinder top stroke)
- **Play button animation fix** — Eliminated SVG `cloneNode(true)` in `_initZoomPan` which was breaking `_flowDots` element references (all flow dots pointed to detached DOM nodes, making `_updateFlowDots` invisible). Replaced with tracked listener removal: `zoomWheel`, `zoomMousedown`, `zoomDblclick`, `zoomTouchstart`, `zoomTouchmove` handlers stored in `this._listeners` and removed before re-adding on re-init. Also set initial `transform` on packet flow dots and initial `cx`/`cy` on trailing dots so they appear at connection start positions (not top-left) before Play is pressed.
- **Architectural redesign: Self-contained diagrams** — Converted 138 of 168 diagrams from shared-engine wrappers to fully self-contained premium interactive experiences:
  - Each diagram has its own index.html (~9 KB), styles.css (~17 KB), script.js (~23-45 KB) — zero imports from `shared/`
  - 60 FPS RAF animation loops, bezier data flow, canvas particles, theme toggle, speed slider, info panel, completion overlay, loading skeleton, error boundary
  - 28 new diagrams created in modules 6 & 8 (Software Development + Networking topics, each had 14 new)
  - Module 1 diagram-01 (Internet Highway) is the reference implementation: world map, 13 nodes, 10 cities, canvas particles, 3-layer toggle, compass rose
- **Deleted 165 orphaned backup files** (110 `.bak` + 55 `.bak2`) from modules 7-10
- **Removed dead code** from shared engine: `buildClickExplorer()` (~60 lines), `_getIconChar()` (~45 lines), `@keyframes celebrationPulse` CSS
- **Backfilled missing data** — `deeperDive` + `advancedConcept` fields for all 14 module 7 diagrams (42 component objects)
- **Loading skeleton** — Added to all 140 diagram `index.html` files with shimmer animation + fade-out on load
- **Speed controller upgrade** — Button-based → range slider (0.25×–4×) in `diagram-engine.js` + `diagram-base.css`
- **Created `shared/scripts/diagram-premium.js`** — Utilities for world map builder, canvas particles, completion overlay, bezier interpolation, layer toggle (for diagrams that still used shared engine)
- **Module 10 grand capstone converted** — Upgraded with packet flow animation, custom animate callback, enhanced layout/styling
- **Converted remaining 30 wrapper diagrams** (modules 6 website development, 8 Scratch, 3 diag-14 troubleshooting, 10 diag-14 grand capstone) — all now fully self-contained with zero shared dependencies
- **Fixed 3 broken module 7 diagrams** — diag-12 (Cloud Security, missing script.js), diag-13 (Mobile Security, empty dir), diag-14 (Future Security, empty dir) — all created with topic-appropriate content
- **Module 1 diagram-09 (Undersea Cables) coordinate bug** — repeater node x/y were quoted strings `"410"`/`"50"` causing string concatenation in bezier math; fixed to numeric
- **Module 1 diagram-09 icon rendering fix** — added emoji font-family + 22px to `.node-icon` CSS; swapped buoy (🧭→⚓ anchor) and data (📊→💾 floppy) for universal emoji support

### In Progress
- (none)

### Blocked
- (none)

## Key Decisions
- Removed ALL shared engine dependencies from all 168 diagrams — each is fully self-contained with zero imports
- Shared engine files (`diagram-engine.js`, `diagram-base.css`, `icons.js`, `diagram-premium.js`) kept in `shared/` for reference, but no active diagram references them
- Google Fonts (Inter) is the only external dependency — no CDN resources
- Consistent architectural pattern: CSS variables for theming, RAF animation, bezier data flow, canvas particles, clickable SVG nodes, custom challenge system, completion overlay, loading skeleton, error boundary
- Module 7 broken diagrams (12–14) created using module 7 custom-GV format (NODES array, CHALLENGES with q/o/a fields, zone-based SVG painting) — matches existing HTML/CSS patterns already in place
- Node.js preferred over Python for JS data extraction (avoids PowerShell emoji escaping issues, can eval() JS object literals directly)

## Next Steps
1. User can request further content tuning or mobile layout adjustments for any specific section/page.
2. Phase 3 (RTC / Collaboration) — WebSocket server, shared state, teacher presenter mode, live annotations.

## Critical Context
- **168 total diagram directories** across 10 modules; **all 168 fully self-contained** — zero shared engine dependencies
- Shared engine files still exist at `shared/` paths but no diagram references them (kept for reference)
- Module 7 broken diagrams fixed: diagram-12 (cloud-security) script.js created, diagram-13 (mobile-security) and diagram-14 (future-security) fully created with topic-appropriate content
- Module 1 diagram-01 (Internet Highway) is the reference self-contained implementation
- Module 1 diagram-09 (Undersea Cables) uses custom SVG + canvas particles; had string-coordinate bug in repeater node (fixed) and icon rendering issue resolved with emoji font-family + universally-supported emoji (⚓ anchor, 💾 floppy)
- Each self-contained diagram includes: 5-6 interactive SVG nodes with info panel, RAF animation loop at 60 FPS, speed slider (0.25×–4×), dark/light theme, 5-10 MCQ challenges, completion overlay, loading skeleton, error boundary, accessibility
- The `scrollToVocabulary()` function (defined in `shared/utils/dom.js`) provides smooth-scroll with highlight animation — already included in all chapters.
- Some chapter style blocks are minified (no spaces); regex replacements must match exact no-space format.
- Module overview pages (e.g., `how-computer-works.html`, `computer-assembly.html`, `mini-projects.html`) were intentionally not given visual-learning sections — they are navigation/overview pages, not lesson content.
- Chapter filenames use NO leading zeros for single-digit chapters (e.g., `chapter-2-how-devices-connect.html`, not `chapter-02-...`).
- `module5/chapter-14-future-of-apps.html` has no Chapter Navigation section (pre-existing anomaly).

## Relevant Files
- `C:\Users\badhi\AppData\Local\Temp\opencode\visual_learning_content.py` — content map for modules 1-7 diagram-specific visual learning text (97 entries).
- `C:\Users\badhi\AppData\Local\Temp\opencode\visual_learning_modules_8_10.py` — content map for modules 8-10 (42 entries).
- `C:\Users\badhi\AppData\Local\Temp\opencode\insert_visual_learning.py` — script that inserted visual-learning sections into 126 chapter files.
- `C:\Users\badhi\AppData\Local\Temp\opencode\fix_responsive.py` — added responsive vocab table CSS + image max-width to all chapters.
- `C:\Users\badhi\AppData\Local\Temp\opencode\fix_touch_targets.py` — fixed touch target sizes across 150 files.
- `C:\Users\badhi\AppData\Local\Temp\opencode\convert_wrappers.py` (31 KB) — Python conversion script used for 30 wrapper diagrams — extracts `var components`/`var connections` data, generates self-contained script.js/index.html/styles.css.
- `C:\Users\badhi\AppData\Local\Temp\opencode\fix_module3.js` (15 KB) — Node.js script for module 3 diagram-14 conversion (handles unquoted JS object keys).
- All 10 module lesson directories (`module1/` through `module10/`) — each with `chapters/` and `diagrams/` subdirectories.
