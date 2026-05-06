import type {
	ComponentDoc,
	ComponentMeta,
	InstallComponentDocs,
	PropsTable
} from '$lib/types/structure';
import type { Example } from '$lib/types/examples';
import type { SEO } from '$lib/types/seo';
import Preview from './examples/preview.svelte';
import PreviewCode from './examples/preview.svelte?raw';
import GlowExample from './examples/glow-example.svelte';
import GlowExampleRaw from './examples/glow-example.svelte?raw';
import OpacitySpeedExample from './examples/opacity-speed-example.svelte';
import OpacitySpeedExampleRaw from './examples/opacity-speed-example.svelte?raw';
import FixedGapBoxExample from './examples/fixed-gap-box-example.svelte';
import FixedGapBoxExampleRaw from './examples/fixed-gap-box-example.svelte?raw';
import PatternLookExample from './examples/pattern-look-example.svelte';
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
import Square17Raw from '$lib/components/loaders/square/square-17.svelte?raw';

export const meta: ComponentMeta = {
	id: "square-17",
	title: "Square 17",
	description: "Square 17 square loader component."
};

const seo: SEO = {
	title: "Square 17 Loader",
	description: "Square 17 square loader component.",
	keywords: ["Svelte", "Square 17", "Loader", "Square"]
};

const examples: Example[] = [
	{
		name: "Glow Effect",
		preview: GlowExample,
		code: {
			filename: "glow-example.svelte",
			filecode: GlowExampleRaw,
			lang: 'svelte'
		}
	},
	{
		name: "Opacity & Speed",
		preview: OpacitySpeedExample,
		code: {
			filename: "opacity-speed-example.svelte",
			filecode: OpacitySpeedExampleRaw,
			lang: 'svelte'
		}
	},
	{
		name: "Fixed Gap Box",
		preview: FixedGapBoxExample,
		code: {
			filename: "fixed-gap-box-example.svelte",
			filecode: FixedGapBoxExampleRaw,
			lang: 'svelte'
		}
	},
	{
		name: "Pattern Look",
		preview: PatternLookExample,
		code: {
			filename: "pattern-look-example.svelte",
			filecode: PatternLookExampleRaw,
			lang: 'svelte'
		}
	}
];

const useCases: Example[] = [
	{
		name: "Chat",
		preview: ChatExample,
		previewClass: "min-h-[30rem] items-stretch justify-start p-0 bg-muted/30 mb-0 py-0",
		code: {
			filename: "chat-example.svelte",
			filecode: ChatExampleRaw,
			lang: 'svelte'
		}
	},
	{
		name: "AI Chat",
		preview: AiChatExample,
		previewClass: "min-h-[30rem] items-stretch justify-start p-0 bg-muted/10",
		code: {
			filename: "ai-chat-example.svelte",
			filecode: AiChatExampleRaw,
			lang: 'svelte'
		}
	},
	{
		name: "API Response While Fetching",
		preview: ApiFetchExample,
		previewClass: "min-h-[30rem] items-stretch justify-start p-0 bg-muted/10",
		code: {
			filename: "api-fetch-example.svelte",
			filecode: ApiFetchExampleRaw,
			lang: 'svelte'
		}
	},
	{
		name: "Form Submission",
		preview: FormSubmitExample,
		previewClass: "min-h-[24rem] items-stretch justify-start",
		code: {
			filename: "form-submit-example.svelte",
			filecode: FormSubmitExampleRaw,
			lang: 'svelte'
		}
	},
	{
		name: "File Upload",
		preview: FileUploadExample,
		previewClass: "min-h-[24rem] items-stretch justify-start",
		code: {
			filename: "file-upload-example.svelte",
			filecode: FileUploadExampleRaw,
			lang: 'svelte'
		}
	},
	{
		name: "Button Click to Server Action",
		preview: ServerActionExample,
		previewClass: "min-h-[24rem] items-stretch justify-start",
		code: {
			filename: "server-action-example.svelte",
			filecode: ServerActionExampleRaw,
			lang: 'svelte'
		}
	},
	{
		name: "Payment Processing",
		preview: PaymentProcessingExample,
		previewClass: "min-h-[24rem] items-stretch justify-start",
		code: {
			filename: "payment-processing-example.svelte",
			filecode: PaymentProcessingExampleRaw,
			lang: 'svelte'
		}
	}
];

const props: PropsTable[] = [
	{
		name: "Square17Props",
		desc: "Primary loader props. Defaults shown here are the effective defaults applied by square-17.svelte.",
		props: [
			{
				name: "size",
				type: "number",
				default: "36",
				description: "Overall matrix span in pixels before any optional wrapper scaling."
			},
			{
				name: "dotSize",
				type: "number",
				default: "5",
				description: "Pixel size for each individual dot in the 5x5 matrix."
			},
			{
				name: "speed",
				type: "number",
				default: "2.5",
				description: "Animation speed multiplier. Values above 1 run faster."
			},
			{
				name: "pattern",
				type: "\"diamond\" | \"full\" | \"outline\" | \"rose\" | \"cross\" | \"rings\"",
				default: "\"full\"",
				description: "Chooses which cells in the 5x5 matrix are active."
			},
			{
				name: "animated",
				type: "boolean",
				default: "true",
				description: "Enables the default loading animation when reduced motion is not active."
			},
			{
				name: "hoverAnimated",
				type: "boolean",
				default: "false",
				description: "Switches animation control to hover interactions instead of always running."
			},
			{
				name: "color",
				type: "string",
				default: "\"currentColor\"",
				description: "Sets the root CSS color used by active dots."
			},
			{
				name: "muted",
				type: "boolean",
				default: "false",
				description: "Applies the muted dot-matrix visual treatment."
			},
			{
				name: "bloom",
				type: "boolean",
				default: "false",
				description: "Adds glow to brighter active dots after opacity remapping."
			},
			{
				name: "halo",
				type: "number",
				default: "0",
				description: "Applies a uniform halo intensity from 0 to 1 across active dots."
			},
			{
				name: "dotClass",
				type: "string",
				description: "Extra class name applied to each rendered dot."
			},
			{
				name: "opacityBase",
				type: "number",
				description: "Overrides the low-end opacity remap target."
			},
			{
				name: "opacityMid",
				type: "number",
				description: "Overrides the mid-point opacity remap target."
			},
			{
				name: "opacityPeak",
				type: "number",
				description: "Overrides the peak opacity remap target before full opacity."
			},
			{
				name: "cellPadding",
				type: "number",
				description: "Explicit gap between dots. When omitted, layout derives spacing from size and dotSize."
			},
			{
				name: "boxSize",
				type: "number",
				description: "Wraps the matrix in a fixed square box and scales the matrix to fit."
			},
			{
				name: "minSize",
				type: "number",
				description: "Minimum outer size for the rendered root or wrapper."
			}
		]
	},
	{
		name: 'Forwarded HTMLDivElement Props',
		desc: 'Common root-level attributes forwarded through `...restProps`.',
		props: [
			{
				name: "class",
				type: "string",
				description: "Classes applied to the root element."
			},
			{
				name: "style",
				type: "string",
				description: "Inline styles applied to the root element."
			},
			{
				name: "role",
				type: "string",
				default: "\"status\"",
				description: "Accessible role for the loader."
			},
			{
				name: "aria-label",
				type: "string",
				default: "\"Loading\"",
				description: "Accessible label for screen readers."
			},
			{
				name: "aria-live",
				type: "string",
				default: "\"polite\"",
				description: "Announcement politeness level."
			},
			{
				name: "ref",
				type: "HTMLDivElement | null",
				description: "Bindable root element reference."
			},
			{
				name: "onmouseenter",
				type: "(event: MouseEvent & { currentTarget: EventTarget & HTMLDivElement }) => void",
				description: "Optional mouse-enter callback."
			},
			{
				name: "onmouseleave",
				type: "(event: MouseEvent & { currentTarget: EventTarget & HTMLDivElement }) => void",
				description: "Optional mouse-leave callback."
			}
		]
	}
];

const installBlock: InstallComponentDocs = {
	installCode: [
		{
			filename: "square-17.svelte",
			filecode: Square17Raw,
			lang: 'svelte',
			isExpand: true
		}
	],
	folderStructure: "src/\n  lib/\n    components/\n      loaders/\n        square/\n          square-17.svelte"
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
