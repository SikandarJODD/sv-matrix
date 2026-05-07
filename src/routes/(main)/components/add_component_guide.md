# Add Component Guide

Use this guide when you are adding a new component entry such as `square-19` or starting a new family such as `circles/circle-1`.

## Case 1: Add `square-19`

### Required files

1. Add the loader source:
   `src/lib/components/loaders/square/square-19.svelte`
2. Add the doc package:
   `src/routes/(main)/components/squares/square-19/`
3. Add the registry item:
   `registry.json`
4. Add the centralized metadata and doc registration:
   `src/lib/content/squares.ts`

### Centralized metadata work

Update `src/lib/content/squares.ts` in three places:

1. Add a `squareCatalog` entry for `square-19`.
2. Add the import in `square-doc-imports`.
3. Add the map entry in `square-doc-map`.

This is what powers:

- detail page title/description/seo
- search
- sidebar
- prev/next navigation
- landing showcase labels

### What updates automatically once `squares.ts` is correct

You do not need separate manual edits for these consumers:

- `src/lib/content/matrix-navigation.ts`
- `src/lib/components/landing/loaders-showcase.svelte`
- `src/lib/components/loaders/square/data.ts`

They already derive square items from `squareSourceItems` in `src/lib/content/squares.ts`.

### Square checklist

1. Source component exists at `src/lib/components/loaders/square/square-19.svelte`.
2. Doc package exists at `src/routes/(main)/components/squares/square-19/`.
3. `squareCatalog` includes the final name and description.
4. `square-doc-imports` includes `square-19`.
5. `square-doc-map` includes `square-19`.
6. `registry.json` includes a `square-19` block.
7. Search/sidebar/prev-next show the new square label.

## Case 2: Add `circles/circle-1` as a placeholder

The current circles family is placeholder-only.

The existing route files are:

- [src/routes/(main)/components/circles/[id]/+page.ts](/s:/advance_svelte/sv-matrix/src/routes/(main)/components/circles/[id]/+page.ts)
- [src/routes/(main)/components/circles/[id]/+page.svelte](/s:/advance_svelte/sv-matrix/src/routes/(main)/components/circles/[id]/+page.svelte)

Those pages read from `circleItems` in `src/lib/content/matrix-navigation.ts`.

### To add a placeholder entry

1. Add a new item to `circleItems` in `src/lib/content/matrix-navigation.ts`.
2. Set:
   - `id`
   - `title`
   - `href`
   - `description`
   - `section: 'circles'`
   - `kind: 'component'`
3. Leave `placeholder: true` if the page should still render through the placeholder flow.

That is enough to make the item appear in:

- sidebar
- search
- prev/next navigation
- `/components/circles/<id>`

## Case 3: Add a real new family

If circles should behave like squares instead of placeholder pages, the repo needs a family-level pipeline.

### Minimum architecture to add

1. Add source components under a family folder such as:
   `src/lib/components/loaders/circle/`
2. Add a family content module such as:
   `src/lib/content/circles.ts`
3. Add:
   - a family catalog
   - source item aggregation
   - page-data builder
   - SEO generation
4. Replace hard-coded `circleItems` in `src/lib/content/matrix-navigation.ts` with items derived from that family content module.
5. Replace the placeholder page flow in `src/routes/(main)/components/circles/[id]/+page.svelte` with a real docs page flow using `ComponentDocPage`.
6. Add a route `load` function that resolves the family page data by id, similar in spirit to how squares are built from centralized content.
7. Add registry entries in `registry.json`.

### If the new family needs authored docs packages

Add a docs folder per component, for example:

```text
src/routes/(main)/components/circles/circle-1/
  data.ts
  docs.md
  examples/
  use-cases/
  llms.txt/
```

Use the square docs package shape as the reference, but keep the family metadata centralized in a family content file rather than duplicating it into each local `data.ts`.

## Files to think about for any new family

When you add a new family, review all of these:

1. `src/lib/content/<family>.ts`
2. `src/lib/content/matrix-navigation.ts`
3. `src/lib/components/loaders/<family>/`
4. `src/routes/(main)/components/<family>/`
5. `registry.json`
6. Any generator/scaffold scripts under `scripts/`

## Script maintenance note

If you add or change a family workflow, also review scaffold tooling.

For squares, the current script entrypoints are:

- `pnpm create:square`
- `pnpm create:squares`

Their implementation lives in:

- `scripts/create-square.mjs`
- `scripts/scaffold/families/square/presets.mjs`

If the architecture changes, update the scripts in the same PR so docs and automation stay aligned.
