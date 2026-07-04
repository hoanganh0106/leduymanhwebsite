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

### Scenario: Milestone Multi-Image Gallery Contract

#### 1. Scope / Trigger
- Trigger: changing artist milestone media from one optional image URL to an ordered image URL array across SQL, Supabase fetchers, admin editing, and public detail rendering.

#### 2. Signatures
- DB: `public.milestones.images text[] not null default '{}'`.
- Frontend type: `Milestone.images?: string[]`.
- Admin field: `{ key: 'images', type: 'gallery', imageAspect: 16 / 9 }`.
- Fetcher: `fetchMilestones(): Promise<Milestone[]>`.

#### 3. Contracts
- `images` is an ordered URL array; left-to-right order in admin is the public display order.
- Public renderers consume only `Milestone.images`; do not reintroduce `Milestone.image` for milestone galleries.
- Fetchers may read legacy Supabase rows with `image: string` and normalize them to `images: [image]` until the migration has run.
- Gallery uploads use the existing `site-images` bucket and shared crop/upload helper path used by single-image admin fields.

#### 4. Validation & Error Matrix
- Non-image file -> show the admin image-file validation error and do not open the cropper.
- File larger than 10MB -> show the admin size validation error and do not upload.
- Supabase not configured -> show the admin Supabase connection error and do not upload.
- Empty or missing `images` -> public milestone renders text only.
- Legacy `image` present and `images` absent -> fetcher returns a one-item `images` array.

#### 5. Good/Base/Bad Cases
- Good: a milestone with five images renders collage plus `+2`, and opening the overlay starts at the fourth image.
- Base: a milestone with one image renders a full-width 16:9 image below the detail text.
- Bad: saving gallery URLs into a string field or reading `milestone.image` in public UI creates a split contract.

#### 6. Tests Required
- `npm.cmd run build` must pass after schema/type/fetcher changes.
- `npm.cmd run lint` must pass after adding gallery/lightbox hooks and buttons.
- Search assertion: `rg "milestone\\.image" src` should not find public milestone render usage.
- Manual admin assertion: add, remove, reorder, save, and reload milestone images; order must persist.
- Manual public assertion: 1/2/3/4+ image milestones render the expected layouts and lightbox keyboard controls work.

#### 7. Wrong vs Correct

Wrong:

```tsx
{milestone.image && <img src={milestone.image} alt={milestone.title} />}
```

Correct:

```tsx
<MilestoneGallery images={milestone.images} title={milestone.title} />
```

### Scenario: Personal Photo Library Contract

#### 1. Scope / Trigger
- Trigger: adding or changing the personal photo library across SQL, Supabase fetchers, hash routing, admin upload/editing, public About strip, and full gallery rendering.

#### 2. Signatures
- DB: `public.photos(id uuid, caption text not null default '', image text not null default '', sort_order int not null default 0, created_at timestamptz)`.
- Frontend type: `Photo { id: string; caption?: string; image: string }`.
- Fetcher: `fetchPhotos(): Promise<Photo[]>`.
- Route: `DetailKind.gallery` maps to `#/thu-vien-anh` and is ID-less.

#### 3. Contracts
- `fetchPhotos()` returns Supabase photos ordered by `sort_order` ascending.
- Unlike default site content, photo library fetch failures, missing Supabase config, empty rows, or rows without `image` return `[]`.
- Public About renders the "Khoảnh khắc" strip only when `photos.length > 0`; direct gallery route renders a gentle empty state when the table is empty.
- Admin uploads use the existing `site-images` bucket, `ImageCropperModal`, and `uploadImageBlob()` path; new rows should receive a lower `sort_order` so they appear first.
- Photo captions are optional and appear in hover overlays and `Lightbox` captions.

#### 4. Validation & Error Matrix
- Non-image file -> show the shared admin image-file validation error and do not open the cropper.
- File larger than 10MB -> show the shared admin size validation error and do not upload.
- Supabase not configured -> show the shared Supabase connection error and do not upload.
- Missing or empty `image` -> fetcher filters the row out.
- Empty `photos` table -> About strip stays hidden; gallery page shows empty state.

#### 5. Good/Base/Bad Cases
- Good: five mixed portrait/square/landscape uploads appear at the front of admin, About strip, gallery masonry, and lightbox with captions.
- Base: one photo renders in About and gallery, and opens in lightbox without next/previous controls.
- Bad: falling back to stock/default photos when Supabase is empty makes the personal library look populated when admin has not uploaded anything.

#### 6. Tests Required
- `npm.cmd run build`, `npm.cmd run lint`, and `git diff --check` must pass.
- Manual admin assertion: select multiple files, crop each, save captions, reorder, delete, and reload.
- Manual public assertion: About strip hides when empty, shows up to 8 photos when populated, `#/thu-vien-anh` masonry opens the correct lightbox index.
- SQL assertion: rerun `supabase-setup.sql`; `photos` table and public-read/auth-write policies exist without seeded rows.

#### 7. Wrong vs Correct

Wrong:

```tsx
const photos = data.length ? data : defaultPhotos;
```

Correct:

```tsx
if (error || !data || data.length === 0) return [];
```

---

## Common Mistakes

<!-- Component-related mistakes your team has made -->

- Adding a clickable public element without `.focus-ring`.
- Adding new microcopy with `text-[8px]`, `text-[9px]`, or `text-[10px]`.
- Relying on native browser required-field popovers instead of the in-app
  inline form error pattern.
- Reintroducing milestone `image` after the gallery migration instead of using
  `images?: string[]` plus the fetcher legacy fallback.
