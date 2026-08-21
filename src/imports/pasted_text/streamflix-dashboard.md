# FIGMA PROMPT — STREAMFLIX MAIN DASHBOARD / HOME PAGE

Design a **modern premium streaming dashboard for StreamFlix**, using the attached screenshots as the **primary reference for layout, spacing, content organization, and streaming-platform experience**.

Visual direction: inspired by modern streaming dashboards such as Netflix, but **do not copy Netflix branding, logo, exact UI, or proprietary visual identity**. This should feel like a complete, consistent StreamFlix platform — matching the previously designed Login and Register pages.

These are **static high-fidelity design mockups**, not functional prototypes. Hover/active/selected states should be shown as separate static variants, not live interactions.

**Priority order if time-constrained:** Dashboard → Components → Login/Register → Responsive.

---

## 1. STREAMFLIX BRAND COLOR PALETTE

| Token | Hex | Usage |
|---|---|---|
| Primary Background | `#0A0908` | Page background, header, section backgrounds, footer |
| Primary Accent / CTA | `#49111C` | Primary CTA, active nav, selected filters, progress fill, hover states, highlights |
| Primary Text | `#F2F4F3` | Headings, titles, nav text, primary buttons |
| Secondary Accent | `#A9927D` | Secondary text, metadata, descriptions |
| Neutral Accent | `#5E503F` | Borders, dividers, disabled elements, muted text |

**Do NOT use bright Netflix red.** `#49111C` (deep burgundy) is the primary interactive accent throughout every screen. This palette must stay identical across Login, Register, and Dashboard — do not introduce new colors.

---

## 2. OVERALL DASHBOARD STRUCTURE

Full-screen, vertically scrollable dashboard:

1. Fixed top navigation
2. Large cinematic hero section
3. Genre/category filters
4. Continue Watching
5. New Releases
6. Genre-based content rows (horizontally scrollable — see §15)
7. Critically Acclaimed
8. Recommended TV Shows
9. Footer

---

## 3. TOP NAVIGATION BAR

Fixed on scroll, subtle dark/translucent background.

**Left:** Existing StreamFlix SVG logo from Login/Register — do not redesign.

**Nav items:** Home · TV Shows · Movies · New & Popular · My List · Browse by Language
- 14–16px, medium/bold weight, `#F2F4F3`
- Active page (Home) uses `#49111C` indicator, kept minimal

**Right side:**
- Search icon (minimal magnifying glass)
- Notification bell with `#49111C` indicator dot
- Profile avatar (circular, `#49111C` background, letter "A" or generic icon) + small dropdown chevron

---

## 4. HERO SECTION

- Occupies ~70–80vh, full-width cinematic background image
- Dark gradient overlay: `#0A0908` at strong transparency, left-to-right and bottom-to-top, plus a subtle `#49111C` tint (~5–10%)
- Content aligned left:
  - Small label: "FEATURED" or "STREAMFLIX ORIGINAL"
  - Large bold condensed title (e.g., "SPIDER-MAN: BRAND NEW DAY") in `#F2F4F3`
  - Metadata row: Match % (`#49111C`), year/rating (`#A9927D`), rating badge with `#5E503F` border
  - Short description (`#F2F4F3`, 16–18px, max-width ~500px, comfortable line height)
  - Buttons: **▶ Play** (bg `#F2F4F3`, text `#0A0908`) and **ⓘ More Info** (bg `#49111C`, text `#F2F4F3`), ~48px tall, subtle hover states
  - Small circular audio/mute toggle near hero's right edge (transparent bg, `#5E503F` border, light icon)

---

## 5. GENRE FILTERS

Horizontal pill filters below the hero: All · Action · Drama · Sci-Fi · Horror · Documentary · Comedy · Romance

- **Active** ("All"): bg `#F2F4F3`, text `#0A0908`
- **Inactive**: bg `#5E503F` at low opacity, text `#F2F4F3`
- **Hover**: `#49111C`

---

## 6. MOVIE CARD COMPONENT (reusable)

Build once, reuse everywhere.

- **Default:** poster image, rounded corners (~6–8px), no visible border, dark background
- **Hover:** scale ~1.03, dark overlay, shows Play / Add to My List / Like buttons + title + metadata, controls use `#49111C`
- **Selected:** subtle `#49111C` highlight
- Card width ~200–240px, 2:3 cinematic poster ratio

Metadata styling: Match % → `#49111C` · Year → `#A9927D` · Rating → `#5E503F` border · Genre → `#A9927D`

**My List state:** "＋ Add to My List" default → "✓ In My List" active (`#49111C`)

---

## 7. CONTENT ROWS

Each row uses the Movie Card component in a horizontally scrollable carousel with subtle left/right nav arrows (dark bg, light icon, `#49111C` on hover, don't permanently cover posters).

**Continue Watching** — cards include a progress bar (track `#5E503F`, fill `#49111C`) and optional remaining time.

**New Releases** — includes "Explore All ›" link in `#49111C`.

**Genre rows** — create one row each for: Action & Thriller, Drama, Sci-Fi, Horror, Comedy. All use the identical card component and row layout; only the heading text changes.

**Critically Acclaimed** — cards show poster, title, rating, genre, year.

**Recommended TV Shows** — includes "Explore All ›" link; cards show poster, title, match %, year, rating.

---

## 8. OVERLAYS

**Search** (triggered from nav icon): dark input, placeholder "Search movies, shows, genres...", bg `#0A0908`, border `#5E503F`, focus state `#49111C`. Results use the standard movie card.

**Notifications** (dropdown from bell icon): compact dark dropdown, bg `#0A0908`, border `#5E503F`, primary text `#F2F4F3`, secondary text `#A9927D`, active indicators `#49111C`. Example items: "New episode available," "You might like this movie," "Your watchlist has been updated."

**Profile dropdown**: Profile · Account · Settings · Help Center · Sign Out. Dark background, `#49111C` hover/active.

---

## 9. FOOTER

Minimal, muted (`#5E503F`), not visually dominant. Links: Audio Description, Help Center, Gift Cards, Media Centre, Investor Relations, Jobs, Terms of Use, Privacy, Cookie Preferences, Corporate Information, Contact Us. Bottom line: "© STREAMFLIX 2026"

---

## 10. SPACING

- ~40–48px horizontal page padding
- 40–56px between content rows
- 12–16px between row heading and poster row
- 12–16px between poster cards

---

## 11. RESPONSIVE BREAKPOINTS

| Device | Size | Notes |
|---|---|---|
| Desktop | 1920×1080 | Full nav, full hero, 6–8 cards visible |
| Laptop | 1440×900 | Same structure, scaled |
| Tablet | 768×1024 | Reduced hero height, poster size, nav spacing, font sizes |
| Mobile | 390×844 | Logo + search + profile only in nav (hide links); smaller hero; 2–3 cards per row; full-width buttons |

---

## 12. VISUAL STYLE

Cinematic · Minimalist · Premium · Dark · Modern · Professional · Streaming-focused. Should clearly resemble a premium streaming dashboard while remaining visually distinct from Netflix. No floating decorative elements — focus on hero, navigation, carousels, filters, cards, and a clean experience.

---

## 13. WATCH / PLAYER SCREEN (Static Mockup)

Figma can't run real video, TMDB calls, or YouTube embeds — so this screen is a **static "now playing" mockup**: a still frame that *looks* like something is mid-playback, not a working player. Build it as two frame variants: **Movie** (full-width, no side panel) and **Series** (video + right-side episode panel).

### Layout
- **Movie variant:** single full-width video area (~16:9), centered, max content width matching the rest of the dashboard.
- **Series variant:** video area (~70% width, left) + episode panel (~30% width, right), same total width as the Movie variant.

### Video area (both variants)
- 16:9 frame, background = a cinematic still (use the title's hero/backdrop image)
- Thin dark gradient overlay at the bottom for control legibility
- Centered large translucent circular Play icon — `#F2F4F3` icon on a semi-transparent `#0A0908` circle — representing the paused/thumbnail state
- Scrubber bar: track `#5E503F`, filled portion `#49111C`, small round handle
- Control row below scrubber: Play/Pause · Skip Back 10s · Skip Forward 10s · elapsed/total time (`#A9927D`) · volume icon · CC icon · Settings gear · Fullscreen — icons in `#F2F4F3`, `#49111C` on hover
- Below the player: title (large, `#F2F4F3`), Subscribe/Follow button (`#49111C`), metadata row (match %, year, rating) matching hero styling

### Right-side Episode Panel — Series variant only
Styled like a video-platform "up next" queue panel:
- Header: show title (bold, `#F2F4F3`) + "Season X · Episode list" (`#A9927D`), collapse/close icon top-right
- Small utility row: loop icon, shuffle icon, "···" overflow menu — subtle `#A9927D`
- Scrollable vertical episode list, each row:
  - Episode number, left, `#A9927D`, small
  - Thumbnail (16:9, ~120px wide, 4px rounded corners) with a small dark duration pill in the bottom-right corner
  - Episode title (`#F2F4F3`, 1–2 lines max)
  - Season/show subtitle beneath title (`#A9927D`, small)
- **Currently playing row:** `#49111C` left-border accent or tinted background; thumbnail shows a small "Now Playing" indicator instead of the duration pill
- Panel background `#0A0908`, row dividers use thin `#5E503F` lines, list scrolls independently of the video area

### Dev handoff annotation
Add a text note on the frame: *"Clicking a title opens this Watch screen. If the content is a single movie, use the Movie variant (full-width, no side panel). If it's a series, use the Series variant with the episode panel, current episode highlighted."*

---

## 14. FIGMA FILE ORGANIZATION — IMPORTANT

Organize the project into **5 separate Figma pages**, in this exact order, so each interface can be accessed and edited independently. Do not place everything on one giant canvas.

```
01 — LOGIN
02 — REGISTER
03 — DASHBOARD
04 — WATCH SCREEN
05 — COMPONENTS
06 — RESPONSIVE
```

**01 — LOGIN:** Login screen, form components, input states, buttons, Forgot Password state if applicable.

**02 — REGISTER:** Registration screen and form (First Name, Last Name, Date of Birth, Username, Email, Password, Confirm Password, Terms & Privacy checkbox, Google/Microsoft login buttons), form states.

**03 — DASHBOARD:** Main dashboard — navigation, hero, genre filters, all content rows, footer, movie card instances, carousel states.

**04 — WATCH SCREEN:** The static player mockup from §13 — Movie variant and Series variant (with episode panel) side by side for comparison.

**05 — COMPONENTS:** Dedicated design-system page. Build these as **true Figma components with variants** (Default / Hover / Active / Selected / Disabled) — not duplicated static frames. Include: StreamFlix Logo, Buttons, Input fields, Password fields, Checkboxes, Navigation items, Movie cards, Genre pills, Progress bars, Icons, Dropdowns, Modals, Cards, Dividers, Episode list row, Player controls.

**06 — RESPONSIVE:** Desktop 1920×1080, Desktop 1440×900, Tablet 768×1024, Mobile 390×844 — clearly organized.

**Rules:**
- Keep each interface on its own page — never merge Login, Register, and Dashboard into one frame or page.
- Within each page, arrange screens left to right with clear section titles.
- Use Auto Layout, reusable components, and consistent naming throughout.
- Centralize shared components in **04 — COMPONENTS** rather than duplicating them across pages.
- The project should be easy to navigate, easy to edit, and easy for developers to inspect and implement.