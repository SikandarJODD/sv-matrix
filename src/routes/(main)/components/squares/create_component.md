# Square Component Doc Template

Use this file when creating a new square doc package under `src/routes/(main)/components/squares/<square-id>/`.

## Goal

Create a `data.ts` file that matches the `square-1` structure and always includes a `props` section.

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

## data.ts scaffold

```ts
import type {
	ComponentDoc,
	ComponentMeta,
	InstallComponentDocs,
	PropsTable
} from '$lib/types/structure';
import type { SEO } from '$lib/types/seo';
import type { Example } from '$lib/types/examples';

import Preview from './examples/preview.svelte';
import PreviewCode from './examples/preview.svelte?raw';

import <ComponentRawName>Raw from '$lib/components/loaders/square/<square-id>.svelte?raw';

export const meta: ComponentMeta = {
	id: '<square-id>',
	title: '<Square Title>'
};

const seo: SEO = {
	title: '<Square Title> Loader',
	description: '<Short SEO description>',
	keywords: ['Svelte', 'Loader', 'Square', '<Square Title>']
};

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
			},
			{
				name: 'dotSize',
				type: 'number',
				default: '<default-dot-size>',
				description: 'Pixel size for each rendered dot.'
			},
			{
				name: 'speed',
				type: 'number',
				default: '<default-speed>',
				description: 'Animation speed multiplier.'
			},
			{
				name: 'pattern',
				type: '"diamond" | "full" | "outline" | "rose" | "cross" | "rings"',
				default: '"<default-pattern>"',
				description: 'Active-cell pattern used by the loader.'
			},
			{
				name: 'animated',
				type: 'boolean',
				default: '<true-or-false>',
				description: 'Runs the default animation when reduced motion is not active.'
			},
			{
				name: 'hoverAnimated',
				type: 'boolean',
				default: '<true-or-false>',
				description: 'Triggers animation from hover instead of always-on playback.'
			},
			{
				name: 'color',
				type: 'string',
				default: '"currentColor"',
				description: 'Root CSS color used by active dots.'
			},
			{
				name: 'muted',
				type: 'boolean',
				default: 'false',
				description: 'Applies the muted visual treatment.'
			},
			{
				name: 'bloom',
				type: 'boolean',
				default: 'false',
				description: 'Adds glow to brighter dots.'
			},
			{
				name: 'halo',
				type: 'number',
				default: '0',
				description: 'Uniform glow strength from 0 to 1.'
			},
			{
				name: 'dotClass',
				type: 'string',
				description: 'Extra class applied to every dot.'
			},
			{
				name: 'opacityBase',
				type: 'number',
				description: 'Low-end opacity remap override.'
			},
			{
				name: 'opacityMid',
				type: 'number',
				description: 'Mid-point opacity remap override.'
			},
			{
				name: 'opacityPeak',
				type: 'number',
				description: 'High-end opacity remap override.'
			},
			{
				name: 'cellPadding',
				type: 'number',
				description: 'Explicit gap between dots.'
			},
			{
				name: 'boxSize',
				type: 'number',
				description: 'Fixed outer square size used to scale the matrix.'
			},
			{
				name: 'minSize',
				type: 'number',
				description: 'Minimum rendered size for the root or wrapper.'
			}
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
			},
			{
				name: 'style',
				type: 'string',
				description: 'Inline styles applied to the root element.'
			},
			{
				name: 'role',
				type: 'string',
				default: '"status"',
				description: 'Accessible role for the loader.'
			},
			{
				name: 'aria-label',
				type: 'string',
				default: '"Loading"',
				description: 'Accessible label for screen readers.'
			},
			{
				name: 'aria-live',
				type: 'string',
				default: '"polite"',
				description: 'Announcement politeness level.'
			},
			{
				name: 'ref',
				type: 'HTMLDivElement | null',
				description: 'Bindable root element reference.'
			},
			{
				name: 'onmouseenter',
				type: '(event: MouseEvent & { currentTarget: EventTarget & HTMLDivElement }) => void',
				description: 'Optional mouse-enter callback.'
			},
			{
				name: 'onmouseleave',
				type: '(event: MouseEvent & { currentTarget: EventTarget & HTMLDivElement }) => void',
				description: 'Optional mouse-leave callback.'
			}
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

export const data: ComponentDoc = {
	...meta,
	installBlock,
	seo,
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

## Rules

1. If the component aliases `DotMatrixCommonProps`, keep the shared prop rows and only update the effective defaults that are overridden inside the component.
2. If the component adds new public props, add them to the first props table above the forwarded HTML props block.
3. Keep prop names in Svelte form, for example `class`, `aria-label`, `onmouseenter`.
4. Make the `default` column reflect the real runtime default, not the type-level optionality.
5. Keep `props` in the exported `data` object, otherwise the docs page will not render the Props section.
