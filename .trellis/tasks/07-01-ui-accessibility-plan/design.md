# Design

## Boundaries

This is a public UI/accessibility pass. It touches the public shell and shared public styles:

- `src/App.tsx` for lead submission state and handler contracts.
- `src/sections.tsx` for public navigation, section tabs, public content controls, and the main contact form.
- `src/detail-pages.tsx` for detail-page form feedback and CTA/focus consistency.
- `src/sax-explorer.tsx` for sax interaction affordances and focus treatment.
- `src/index.css` for shared focus, overflow cue, and touch-action styles.

Admin UI and CMS data contracts are out of scope.

## Approach

Use small shared CSS utilities where repeated behavior must be consistent:

- `.focus-ring` for a unified `focus-visible` outline/ring.
- A mobile tab overflow cue class or wrapper style for `SectionTabs`.
- Sax stage touch behavior in CSS so the component markup stays simple.

For contrast and font-size updates, prefer local utility edits plus a few semantic helper classes in the touched public components. A full design-token migration is intentionally not required in this pass; the task can introduce Tailwind theme token mapping only if it helps touched code without causing broad churn.

For responsive images, keep the current content model. Extend the existing image helper/component path so Unsplash and normal URLs can produce `srcSet`/`sizes` or optimized query parameters at render time without editing CMS data.

For forms, keep validation state close to the form owner:

- `App.tsx` already owns `saveLead` and the public handler functions.
- Public forms should receive enough state to disable submit controls and show inline errors without changing the Supabase payload shape.
- Validation should happen before `saveLead`, but still keep native input semantics (`required`, labels, field names).

## Data Flow

Lead form flow should remain:

1. User fills a public or detail form.
2. The relevant submit handler validates required fields.
3. If invalid, the app sets field-level error state and does not call `saveLead`.
4. If valid, the app sets an in-flight state, calls `saveLead(payload)`, then shows the existing success state.
5. Submit buttons are disabled while the matching form is in flight.

No Supabase schema, payload field names, or admin lead rendering should change.

## Compatibility

- Hash/deep-link behavior remains unchanged.
- Visual tone remains warm ivory; no dark section backgrounds.
- CTA hierarchy remains unchanged; focus/touch updates should not make secondary CTAs look primary.
- Existing `prefers-reduced-motion` behavior remains respected.

## Tradeoffs

- A full raw-hex-to-token migration would be cleaner long term but has too much churn for this UX pass. This task uses a targeted approach.
- Inline form validation adds component state, but it directly solves silent failure and double-submit without changing backend behavior.
- Shared focus CSS avoids repeating long Tailwind class strings and keeps keyboard behavior easier to audit.
- Responsive image helpers improve delivery without changing stored image URLs, but they should stay conservative for non-Unsplash uploads.

## Rollback

All changes are local frontend edits. If a visual regression appears, revert the most recent touched file or remove the new shared utility class usage while keeping the existing markup intact.
