# Component Guidelines

> How components are built in this project.

---

## Overview

<!--
Document your project's component conventions here.

Questions to answer:
- What component patterns do you use?
- How are props defined?
- How do you handle composition?
- What accessibility standards apply?
-->

(To be filled by the team)

---

## Component Structure

<!-- Standard structure of a component file -->

(To be filled by the team)

---

## Props Conventions

<!-- How props should be defined and typed -->

(To be filled by the team)

---

## Styling Patterns

<!-- How styles are applied (CSS modules, styled-components, Tailwind, etc.) -->

(To be filled by the team)

---

## Accessibility

Public interactive UI should use the shared `.focus-ring` class from
`src/index.css` unless a component has an equivalent visible `focus-visible`
treatment. This applies to navigation pills, tab buttons, CTAs, card buttons,
footer links, social links, sax explorer controls, and form controls.

Readable labels should not use font sizes below `11px`. Use the `.ui-label`
helper for form and micro labels that need the gold uppercase style.

Readable gold labels on the ivory/surface backgrounds should use
`text-gold-ink` or `.ui-label`, backed by `--gold-ink` in `src/index.css`.
Do not use raw `text-[#9A7C30]` or `text-[#AF8C43]` for small readable labels;
those colors are decorative accent colors and do not meet AA contrast for
microcopy on ivory.

Touch targets for public controls should be at least 44px tall/wide, or use an
equivalent hit area such as `min-h-11`. Decorative icons may remain smaller.

Example:

```tsx
<button className="focus-ring inline-flex min-h-11 items-center rounded-full">
  Action
</button>
```

### Forms

Public lead forms use app-owned validation state, not silent early returns.
Render forms with `noValidate`, show field-level messages with `.form-error`,
set `aria-invalid` / `aria-describedby`, and disable the submit button while the
matching async submission is in flight.

Good:

```tsx
<input
  required
  aria-invalid={Boolean(formErrors.name)}
  aria-describedby={formErrors.name ? 'contact-name-error' : undefined}
/>
```

Avoid:

```tsx
if (!name || !phone) return;
```

### Images

Use `SafeImage` for public content images so fallback rendering and responsive
Unsplash `srcSet` / `sizes` generation stay centralized. Do not add ad hoc
image URL rewriting in individual cards unless `SafeImage` cannot support the
case.

---

## Common Mistakes

<!-- Component-related mistakes your team has made -->

- Adding a clickable public element without `.focus-ring`.
- Adding new microcopy with `text-[8px]`, `text-[9px]`, or `text-[10px]`.
- Relying on native browser required-field popovers instead of the in-app
  inline form error pattern.
