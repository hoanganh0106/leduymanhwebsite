# Implementation Plan

## Checklist

1. Load frontend coding guidelines and inspect current public component patterns.
2. Add shared focus/touch/overflow utilities in `src/index.css`.
3. Update `SectionTabs`, header nav/menu, footer links/socials, and public CTA buttons to use the shared focus treatment and 44px touch targets.
4. Raise public small readable labels and low-opacity public text in `src/sections.tsx`.
5. Update detail-page back/submit controls and small labels/text in `src/detail-pages.tsx`.
6. Update sax explorer touch behavior and focus treatment in `src/sax-explorer.tsx`.
7. Add lead form validation/loading state in `src/App.tsx`, threading only the required props into public/detail form components.
8. Add inline error rendering and disabled/loading submit controls to the public and detail forms.
9. Add responsive image support through existing public image helpers/components where possible.
10. Make tour-card detail affordance visible without hover on mobile.
11. Add or apply small semantic typography helpers for touched labels/body text.
12. Search for missed public `text-[8px]`, low-opacity readable text, missing focus classes, and sub-44px controls in touched files.
13. Run `npm.cmd run build`.
14. Run `npm.cmd run lint`.
15. If practical, launch or preview and do a quick rendered smoke check for the main public page and contact/detail form paths.

## Validation Commands

```powershell
npm.cmd run build
npm.cmd run lint
```

Optional rendered check:

```powershell
npm.cmd run dev
Invoke-WebRequest http://127.0.0.1:5173/ -UseBasicParsing
```

## Risky Files

- `src/App.tsx`: form submission state must not break lead payloads or existing success states.
- `src/sections.tsx`: large component file with many repeated class strings; use search after edits.
- `src/detail-pages.tsx`: detail registration flows should keep existing props/contracts unless intentionally extended.
- `src/index.css`: shared class names should avoid global side effects beyond intended public controls.

## Review Gate Before Start

- PRD, design, and implementation plan exist.
- No blocking product questions remain because `UI-PLAN.md` already states the target scope and exclusions.
- Start task only after user approval to proceed with implementation.
