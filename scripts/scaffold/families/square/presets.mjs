// @ts-check

/**
 * @typedef {{
 *   key: string;
 *   fileName: string;
 *   displayName: string;
 *   importName: string;
 *   templateFile: string;
 *   previewClass?: string;
 * }} DocPreset
 */

/**
 * @typedef {{
 *   name: string;
 *   type: string;
 *   description: string;
 *   defaultValue?: string;
 * }} PropRow
 */

export const squareFamilyConfig = {
	familyId: 'square',
	componentDir: 'src/lib/components/loaders/square',
	docsDir: 'src/routes/(main)/components/squares',
	richDocsFile: 'src/lib/content/squares.ts',
	sourceIndexFile: 'src/lib/components/loaders/square/data.ts',
	registryFile: 'registry.json',
	templateDir: 'scripts/scaffold/families/square/shared',
	defaultExamples: ['glow', 'opacity-speed', 'fixed-gap-box', 'pattern-look'],
	defaultUseCases: [
		'chat',
		'ai-chat',
		'api-fetch',
		'form-submit',
		'file-upload',
		'server-action',
		'payment-processing'
	]
};

/** @type {readonly DocPreset[]} */
export const squareExamplePresets = [
	{
		key: 'glow',
		fileName: 'glow-example.svelte',
		displayName: 'Glow Effect',
		importName: 'GlowExample',
		templateFile: 'examples/glow-example.svelte.template'
	},
	{
		key: 'opacity-speed',
		fileName: 'opacity-speed-example.svelte',
		displayName: 'Opacity & Speed',
		importName: 'OpacitySpeedExample',
		templateFile: 'examples/opacity-speed-example.svelte.template'
	},
	{
		key: 'fixed-gap-box',
		fileName: 'fixed-gap-box-example.svelte',
		displayName: 'Fixed Gap Box',
		importName: 'FixedGapBoxExample',
		templateFile: 'examples/fixed-gap-box-example.svelte.template'
	},
	{
		key: 'pattern-look',
		fileName: 'pattern-look-example.svelte',
		displayName: 'Pattern Look',
		importName: 'PatternLookExample',
		templateFile: 'examples/pattern-look-example.svelte.template'
	}
];

/** @type {readonly DocPreset[]} */
export const squareUseCasePresets = [
	{
		key: 'chat',
		fileName: 'chat-example.svelte',
		displayName: 'Chat',
		importName: 'ChatExample',
		templateFile: 'use-cases/chat-example.svelte.template',
		previewClass: 'min-h-[30rem] items-stretch justify-start p-0 bg-muted/30 mb-0 py-0'
	},
	{
		key: 'ai-chat',
		fileName: 'ai-chat-example.svelte',
		displayName: 'AI Chat',
		importName: 'AiChatExample',
		templateFile: 'use-cases/ai-chat-example.svelte.template',
		previewClass: 'min-h-[30rem] items-stretch justify-start p-0 bg-muted/10'
	},
	{
		key: 'api-fetch',
		fileName: 'api-fetch-example.svelte',
		displayName: 'API Response While Fetching',
		importName: 'ApiFetchExample',
		templateFile: 'use-cases/api-fetch-example.svelte.template',
		previewClass: 'min-h-[30rem] items-stretch justify-start p-0 bg-muted/10'
	},
	{
		key: 'form-submit',
		fileName: 'form-submit-example.svelte',
		displayName: 'Form Submission',
		importName: 'FormSubmitExample',
		templateFile: 'use-cases/form-submit-example.svelte.template',
		previewClass: 'min-h-[24rem] items-stretch justify-start'
	},
	{
		key: 'file-upload',
		fileName: 'file-upload-example.svelte',
		displayName: 'File Upload',
		importName: 'FileUploadExample',
		templateFile: 'use-cases/file-upload-example.svelte.template',
		previewClass: 'min-h-[24rem] items-stretch justify-start'
	},
	{
		key: 'server-action',
		fileName: 'server-action-example.svelte',
		displayName: 'Button Click to Server Action',
		importName: 'ServerActionExample',
		templateFile: 'use-cases/server-action-example.svelte.template',
		previewClass: 'min-h-[24rem] items-stretch justify-start'
	},
	{
		key: 'payment-processing',
		fileName: 'payment-processing-example.svelte',
		displayName: 'Payment Processing',
		importName: 'PaymentProcessingExample',
		templateFile: 'use-cases/payment-processing-example.svelte.template',
		previewClass: 'min-h-[24rem] items-stretch justify-start'
	}
];

/** @type {readonly PropRow[]} */
export const squareCommonProps = [
	{
		name: 'size',
		type: 'number',
		description: 'Overall matrix span in pixels before any optional wrapper scaling.'
	},
	{
		name: 'dotSize',
		type: 'number',
		description: 'Pixel size for each individual dot in the 5x5 matrix.'
	},
	{
		name: 'speed',
		type: 'number',
		description: 'Animation speed multiplier. Values above 1 run faster.'
	},
	{
		name: 'pattern',
		type: '"diamond" | "full" | "outline" | "rose" | "cross" | "rings"',
		description: 'Chooses which cells in the 5x5 matrix are active.'
	},
	{
		name: 'animated',
		type: 'boolean',
		description: 'Enables the default loading animation when reduced motion is not active.'
	},
	{
		name: 'hoverAnimated',
		type: 'boolean',
		description: 'Switches animation control to hover interactions instead of always running.'
	},
	{
		name: 'color',
		type: 'string',
		defaultValue: '"currentColor"',
		description: 'Sets the root CSS color used by active dots.'
	},
	{
		name: 'muted',
		type: 'boolean',
		defaultValue: 'false',
		description: 'Applies the muted dot-matrix visual treatment.'
	},
	{
		name: 'bloom',
		type: 'boolean',
		defaultValue: 'false',
		description: 'Adds glow to brighter active dots after opacity remapping.'
	},
	{
		name: 'halo',
		type: 'number',
		defaultValue: '0',
		description: 'Applies a uniform halo intensity from 0 to 1 across active dots.'
	},
	{
		name: 'dotClass',
		type: 'string',
		description: 'Extra class name applied to each rendered dot.'
	},
	{
		name: 'opacityBase',
		type: 'number',
		description: 'Overrides the low-end opacity remap target.'
	},
	{
		name: 'opacityMid',
		type: 'number',
		description: 'Overrides the mid-point opacity remap target.'
	},
	{
		name: 'opacityPeak',
		type: 'number',
		description: 'Overrides the peak opacity remap target before full opacity.'
	},
	{
		name: 'cellPadding',
		type: 'number',
		description:
			'Explicit gap between dots. When omitted, layout derives spacing from size and dotSize.'
	},
	{
		name: 'boxSize',
		type: 'number',
		description: 'Wraps the matrix in a fixed square box and scales the matrix to fit.'
	},
	{
		name: 'minSize',
		type: 'number',
		description: 'Minimum outer size for the rendered root or wrapper.'
	}
];

/** @type {readonly PropRow[]} */
export const squareForwardedProps = [
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
		defaultValue: '"status"',
		description: 'Accessible role for the loader.'
	},
	{
		name: 'aria-label',
		type: 'string',
		defaultValue: '"Loading"',
		description: 'Accessible label for screen readers.'
	},
	{
		name: 'aria-live',
		type: 'string',
		defaultValue: '"polite"',
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
];
