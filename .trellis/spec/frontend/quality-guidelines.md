# Quality Guidelines

> Code quality standards for frontend development.

---

## Overview

<!--
Document your project's quality standards here.

Questions to answer:
- What patterns are forbidden?
- What linting rules do you enforce?
- What are your testing requirements?
- What code review standards apply?
-->

(To be filled by the team)

---

## Forbidden Patterns

<!-- Patterns that should never be used and why -->

(To be filled by the team)

---

## Required Patterns

For public UI accessibility changes:

- Keep the warm ivory visual system; fix contrast by darkening text/opacity,
  not by adding dark sections.
- Normal readable text on ivory should avoid low-opacity ink classes below about
  `/70`.
- New public controls should include `.focus-ring` and a 44px hit target.
- Forms that call async lead submission should prevent double-submit with a
  disabled/loading state.
- Keep image optimization centralized in `SafeImage`.

---

## Testing Requirements

Before reporting a public UI/a11y pass complete, run:

```powershell
npm.cmd run build
npm.cmd run lint
git diff --check
```

When practical, serve the production bundle with `npm.cmd run preview` and
confirm the local URL returns HTTP 200.

---

## Code Review Checklist

<!-- What reviewers should check -->

- No public readable `text-[8px]`, `text-[9px]`, or `text-[10px]` remains.
- No low-opacity public readable ink text (`text-[#2A2520]/45` through `/65`)
  remains in touched public files.
- Keyboard focus is visible on all newly touched interactive controls.
- Form errors are visible inline and associated with fields via ARIA.
- Submit controls are disabled while their async submission is pending.
