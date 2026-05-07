# Square Component Doc Guide

Use this file when creating or updating a square doc package under `src/routes/(main)/components/squares/<square-id>/`.

For family-level work such as adding `square-19`, wiring a new registry entry, or creating a new family like circles, also read [add_component_guide.md](</s:/advance_svelte/sv-matrix/src/routes/(main)/components/add_component_guide.md>).

## Current square architecture

Square docs are split into two layers:

1. Local square content lives in `src/routes/(main)/components/squares/<square-id>/data.ts`.
2. Canonical square metadata lives in `src/lib/content/squares.ts`.

That means the local `data.ts` file is not the source of truth for:

- title
- description
- seo
- sidebar/search labels

Those now come from `squareCatalog` in `src/lib/content/squares.ts`.

## What belongs where

### Put this in local `data.ts`

- `id`
- `preview`
- `previewCode`
- `installBlock`
- `examples`
- `useCases`
- `props`

### Put this in `src/lib/content/squares.ts`

- square display name
- square short description
- generated SEO
- registration in `square-doc-imports`
- registration in `square-doc-map`

## Expected folder shape

```text
src/routes/(main)/components/squares/<square-id>/
  data.ts
  docs.md
  examples/
    preview.svelte
    <example-name>.svelte
  use-cases/
    <use-case-name>.svelte
  llms.txt/
    +server.ts
```

## Local `data.ts` scaffold

```ts
import type { InstallComponentDocs, PropsTable, SquareDocContent } from '$lib/types/structure';
import type { Example } from '$lib/types/examples';

import Preview from './examples/preview.svelte';
import PreviewCode from './examples/preview.svelte?raw';

import <ComponentRawName>Raw from '$lib/components/loaders/square/<square-id>.svelte?raw';

const examples: Example[] = [
	// import each example component and its ?raw source,
	// then register it here
];

const useCases: Example[] = [
	// import each use-case component and its ?raw source,
	// then register it here
];

const props: PropsTable[] = [
	{
		name: '<Props Type Name>',
		desc: 'Primary loader props. Defaults must match the actual component file.',
		props: [
			{
				name: 'size',
				type: 'number',
				default: '<default-size>',
				description: 'Overall matrix span in pixels before wrapper scaling.'
			}
			// add the rest of the public props here
		]
	},
	{
		name: 'Forwarded HTMLDivElement Props',
		desc: 'Common root-level attributes forwarded through `...restProps`.',
		props: [
			{
				name: 'class',
				type: 'string',
				description: 'Classes applied to the root element.'
			}
			// add the rest of the forwarded HTML props here
		]
	}
];

const installBlock: InstallComponentDocs = {
	installCode: [
		{
			filename: '<square-id>.svelte',
			filecode: <ComponentRawName>Raw,
			lang: 'svelte',
			isExpand: true
		}
	],
	folderStructure: `src/
  lib/
    components/
      loaders/
        square/
          <square-id>.svelte`
};

export const data: SquareDocContent = {
	id: '<square-id>',
	installBlock,
	preview: Preview,
	previewCode: {
		filename: 'preview.svelte',
		filecode: PreviewCode,
		lang: 'svelte'
	},
	examples,
	useCases,
	props
};
```

## Metadata step you must not skip

After creating the local doc package, update `src/lib/content/squares.ts`:

1. Add the new square to `squareCatalog`.
2. Add the new import inside `square-doc-imports`.
3. Add the new map entry inside `square-doc-map`.

Without those three edits, the new square will not be part of:

- page metadata
- search
- sidebar
- prev/next navigation
- landing showcase labels

## Props rules

1. If the component aliases `DotMatrixCommonProps`, keep the shared prop rows and only change the defaults actually overridden by the component.
2. If the component adds new public props, add them to the first props table before the forwarded HTML props block.
3. Keep prop names in Svelte form such as `class`, `aria-label`, and `onmouseenter`.
4. Make the `default` column match the real runtime default, not type-level optionality.
5. Keep `props` in the exported `data` object or the docs page will lose the Props section.

## Example checklist

Before finishing a new square doc package:

1. Confirm `preview.svelte` renders the intended component state.
2. Confirm every example and use-case imports both the Svelte component and its `?raw` source.
3. Confirm `installBlock.installCode` points to the correct loader source file.
4. Confirm the local `data.ts` exports `SquareDocContent`, not `ComponentDoc`.
5. Confirm `src/lib/content/squares.ts` has the matching catalog entry and registrations.

## Automation note

The repo still has `pnpm create:square` and `pnpm create:squares`, but the canonical square metadata now lives in `src/lib/content/squares.ts`.

Before relying on those scripts, review:

- `scripts/create-square.mjs`
- `scripts/scaffold/families/square/presets.mjs`
- `src/lib/content/squares.ts`

If the generated output still assumes local `meta` or `seo` ownership, fix the generated files manually before commit.
