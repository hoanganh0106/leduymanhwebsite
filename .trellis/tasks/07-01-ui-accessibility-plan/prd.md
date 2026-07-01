# Implement UI accessibility plan

## Goal

Bring the public Lê Duy Mạnh Saxophone site in line with all implementation waves in `UI-PLAN.md`: accessible contrast, readable label sizing, consistent keyboard focus, mobile touch targets, sax drag ergonomics, contact form feedback, mobile affordances, responsive image delivery, and typography consistency. The work should improve UX without changing the warm ivory visual system, tab-panel navigation model, CMS plan, or CTA hierarchy.

## User Value

Visitors should be able to read the page comfortably, navigate it by keyboard, tap controls reliably on mobile, interact with the sax explorer without accidental page scrolling, and understand contact form validation/submission state.

## Confirmed Facts

- The app is a Vite + React + TypeScript frontend using Tailwind v4 utility classes and `lucide-react`.
- Public shell and lead submission handlers live in `src/App.tsx`; public sections and contact form markup live in `src/sections.tsx`.
- Detail registration/contact forms live in `src/detail-pages.tsx`.
- Sax explorer UI lives in `src/sax-explorer.tsx`; shared styles live in `src/index.css`.
- `UI-PLAN.md` explicitly preserves the single warm ivory background, current CTA hierarchy, tab-panel navigation, and CMS/Supabase plan.
- Existing code has multiple low-opacity text classes, sub-11px labels, inconsistent focus treatment, and some controls below 44px touch size.

## Requirements

1. Preserve the current quiet-luxury warm ivory visual direction; do not introduce dark sections or unrelated redesign.
2. Preserve the existing navigation model: nav changes the active panel and deep links continue to work.
3. Preserve CTA hierarchy: no extra competing primary CTAs.
4. Improve public-page text contrast by raising low-opacity normal/small text and using deeper gold for small labels where needed.
5. Raise tiny public-facing labels so no intended readable label/body text is below 11px.
6. Add a reusable, consistent focus-visible treatment for interactive public elements that currently lack visible focus.
7. Bring obvious mobile touch targets to at least 44px or an equivalent hit area: header menu, nav/tab pills, small status/action pills, footer social controls.
8. Add sax explorer touch handling so horizontal drag does not fight vertical scrolling on mobile.
9. Add inline validation and loading/disabled state for lead submission forms so empty required fields and in-flight submission are visible in-app.
10. Add the mobile SectionTabs overflow cue from P1.
11. Implement P2 polish items where they apply to the public site: responsive image URLs/sizes, always-visible tour-card detail affordance on mobile, and a small semantic typography helper layer for touched label/body styles.
12. Keep scope to public UI/accessibility/form state. Avoid admin UI and CMS data model changes unless a shared class affects them harmlessly.

## Acceptance Criteria

- [ ] `src/sections.tsx`, `src/detail-pages.tsx`, `src/sax-explorer.tsx`, and `src/index.css` no longer contain public readable `text-[8px]`; public 9/10px labels are raised to at least 11px unless purely decorative.
- [ ] Low-opacity readable text called out in `UI-PLAN.md` is raised to accessible contrast targets while preserving the ivory background.
- [ ] Keyboard tabbing shows a clear focus ring on nav pills, section tabs, hero/detail CTAs, footer quick links, social links, form submit/reset controls, and sax list controls.
- [ ] Mobile touch controls called out in `UI-PLAN.md` have 44px minimum size or equivalent hit area.
- [ ] Sax stage drag uses `touch-action` or equivalent behavior so horizontal sax interaction does not accidentally hijack page scroll.
- [ ] Lead form submissions cannot double-submit while async save is in flight.
- [ ] Empty required lead fields produce visible inline errors next to the relevant inputs.
- [ ] Mobile section tabs communicate horizontal overflow with a subtle cue.
- [ ] Public image rendering gets a reusable responsive image path for Unsplash/upload URLs without changing content data.
- [ ] Tour-card detail affordance remains visible without hover on mobile.
- [ ] Touched labels/body copy use semantic helper classes or normalized sizing instead of adding more raw tiny text classes.
- [ ] `npm.cmd run build` passes.
- [ ] `npm.cmd run lint` passes or any pre-existing unrelated lint failures are clearly separated.

## Out Of Scope

- Switching from tab-panel navigation to a long scrolling page.
- Adding dark backgrounds or changing the core color direction.
- Reworking CMS/Supabase schema or admin workflows.
- Full raw-hex migration across all components; this task may add tokens/classes and use them for touched areas, but does not need to rewrite every existing utility.

## Open Questions

None blocking. `UI-PLAN.md` already provides the product intent and constraints for this pass.
