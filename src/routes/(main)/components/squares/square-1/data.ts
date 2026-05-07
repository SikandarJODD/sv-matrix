import type { InstallComponentDocs, PropsTable, ComponentDoc } from '$lib/types/structure';
import Preview from './examples/preview.svelte';
import PreviewCode from './examples/preview.svelte?raw';
import type { Example } from '$lib/types/examples';
import GlowExample from './examples/glow-example.svelte';
import GlowExampleRaw from './examples/glow-example.svelte?raw';
import OpacitySpeedExample from './examples/opacity-speed-example.svelte';
import FixedGapBoxExample from './examples/fixed-gap-box-example.svelte';
import PatternLookExample from './examples/pattern-look-example.svelte';
import OpacitySpeedExampleRaw from './examples/opacity-speed-example.svelte?raw';
import FixedGapBoxExampleRaw from './examples/fixed-gap-box-example.svelte?raw';
import PatternLookExampleRaw from './examples/pattern-look-example.svelte?raw';
import ChatExample from './use-cases/chat-example.svelte';
import ChatExampleRaw from './use-cases/chat-example.svelte?raw';
import AiChatExample from './use-cases/ai-chat-example.svelte';
import AiChatExampleRaw from './use-cases/ai-chat-example.svelte?raw';
import ApiFetchExample from './use-cases/api-fetch-example.svelte';
import ApiFetchExampleRaw from './use-cases/api-fetch-example.svelte?raw';
import FormSubmitExample from './use-cases/form-submit-example.svelte';
import FormSubmitExampleRaw from './use-cases/form-submit-example.svelte?raw';
import FileUploadExample from './use-cases/file-upload-example.svelte';
import FileUploadExampleRaw from './use-cases/file-upload-example.svelte?raw';
import ServerActionExample from './use-cases/server-action-example.svelte';
import ServerActionExampleRaw from './use-cases/server-action-example.svelte?raw';
import PaymentProcessingExample from './use-cases/payment-processing-example.svelte';
import PaymentProcessingExampleRaw from './use-cases/payment-processing-example.svelte?raw';
import Square1Raw from '$lib/components/loaders/square/square-1.svelte?raw';

let examples: Example[] = [
	{
		name: 'Glow Effect',
		preview: GlowExample,
		code: {
			filename: 'glow-example.svelte',
			filecode: GlowExampleRaw,
			lang: 'svelte'
		}
	},
	{
		name: 'Opacity & Speed',
		preview: OpacitySpeedExample,
		code: {
			filename: 'opacity-speed-example.svelte',
			filecode: OpacitySpeedExampleRaw,
			lang: 'svelte'
		}
	},
	{
		name: 'Fixed Gap Box',
		preview: FixedGapBoxExample,
		code: {
			filename: 'fixed-gap-box-example.svelte',
			filecode: FixedGapBoxExampleRaw,
			lang: 'svelte'
		}
	},
	{
		name: 'Pattern Look',
		preview: PatternLookExample,
		code: {
			filename: 'pattern-look-example.svelte',
			filecode: PatternLookExampleRaw,
			lang: 'svelte'
		}
	}
];

const widePreviewClass = 'min-h-[30rem] items-stretch justify-start p-0 bg-muted/10';
const compactPreviewClass = 'min-h-[24rem] items-stretch justify-start';

let useCases: Example[] = [
	{
		name: 'Chat',
		preview: ChatExample,
		previewClass: 'min-h-[30rem] items-stretch justify-start p-0 bg-muted/30 mb-0 py-0',
		code: {
			filename: 'chat-example.svelte',
			filecode: ChatExampleRaw,
			lang: 'svelte'
		}
	},
	{
		name: 'AI Chat',
		preview: AiChatExample,
		previewClass: widePreviewClass,
		code: {
			filename: 'ai-chat-example.svelte',
			filecode: AiChatExampleRaw,
			lang: 'svelte'
		}
	},
	{
		name: 'API Response While Fetching',
		preview: ApiFetchExample,
		previewClass: widePreviewClass,
		code: {
			filename: 'api-fetch-example.svelte',
			filecode: ApiFetchExampleRaw,
			lang: 'svelte'
		}
	},
	{
		name: 'Form Submission',
		preview: FormSubmitExample,
		previewClass: compactPreviewClass,
		code: {
			filename: 'form-submit-example.svelte',
			filecode: FormSubmitExampleRaw,
			lang: 'svelte'
		}
	},
	{
		name: 'File Upload',
		preview: FileUploadExample,
		previewClass: compactPreviewClass,
		code: {
			filename: 'file-upload-example.svelte',
			filecode: FileUploadExampleRaw,
			lang: 'svelte'
		}
	},
	{
		name: 'Button Click to Server Action',
		preview: ServerActionExample,
		previewClass: compactPreviewClass,
		code: {
			filename: 'server-action-example.svelte',
			filecode: ServerActionExampleRaw,
			lang: 'svelte'
		}
	},
	{
		name: 'Payment Processing',
		preview: PaymentProcessingExample,
		previewClass: compactPreviewClass,
		code: {
			filename: 'payment-processing-example.svelte',
			filecode: PaymentProcessingExampleRaw,
			lang: 'svelte'
		}
	}
];

const props: PropsTable[] = [
	{
		name: 'SquareOneProps',
		desc: 'Primary loader props. Defaults shown here are the effective defaults applied by square-1.svelte.',
		props: [
			{
				name: 'size',
				type: 'number',
				default: '37',
				description: 'Overall matrix span in pixels before any optional wrapper scaling.'
			},
			{
				name: 'dotSize',
				type: 'number',
				default: '5',
				description: 'Pixel size for each individual dot in the 5x5 matrix.'
			},
			{
				name: 'speed',
				type: 'number',
				default: '1.1',
				description: 'Animation speed multiplier. Values above 1 run faster.'
			},
			{
				name: 'pattern',
				type: '"diamond" | "full" | "outline" | "rose" | "cross" | "rings"',
				default: '"full"',
				description: 'Chooses which cells in the 5x5 matrix are active.'
			},
			{
				name: 'animated',
				type: 'boolean',
				default: 'true',
				description: 'Enables the default loading animation when reduced motion is not active.'
			},
			{
				name: 'hoverAnimated',
				type: 'boolean',
				default: 'false',
				description: 'Switches animation control to hover interactions instead of always running.'
			},
			{
				name: 'color',
				type: 'string',
				default: '"currentColor"',
				description: 'Sets the root CSS color used by active dots.'
			},
			{
				name: 'muted',
				type: 'boolean',
				default: 'false',
				description: 'Applies the muted dot-matrix visual treatment.'
			},
			{
				name: 'bloom',
				type: 'boolean',
				default: 'false',
				description: 'Adds glow to brighter active dots after opacity remapping.'
			},
			{
				name: 'halo',
				type: 'number',
				default: '0',
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
		]
	}
];

const installBlock: InstallComponentDocs = {
	installCode: [
		{
			filename: 'square-1.svelte',
			filecode: Square1Raw,
			lang: 'svelte',
			isExpand: true
		}
	],
	folderStructure: `src/
	└── lib/
		└── components/
			└── loaders/
				└── squares/
					└── square-1.svelte`
};

export const data: ComponentDoc = {
	id: 'square-1',
	title: 'Square One',
	description:
		'The original and most versatile dot-matrix style loader in the SV Matrix collection. Square One features a 5x5 grid of dots that can be customized with various patterns, animation styles, and visual effects to create a wide range of loading indicators suitable for different contexts.',
	category: 'loaders',
	seo: {
		title: 'Square One - SV Matrix Loader Component',
		description:
			'Discover Square One, the versatile dot-matrix loader from SV Matrix. Customize patterns, animations, and effects to create unique loading indicators for your Svelte projects.',
		keywords: ['svelte loader', 'dot matrix', 'square one', 'customizable loading indicator']
	},
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
