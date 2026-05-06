import type { ComponentDoc, ComponentMeta, InstallComponentDocs } from '$lib/types/structure';
import type { SEO } from '$lib/types/seo';
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

export const meta: ComponentMeta = {
	id: 'square-1',
	title: 'Neon Drift'
};

const seo: SEO = {
	title: 'Neon Drift Loader',
	description: 'Neon Drift Loader component for svelte',
	keywords: ['Svelte', 'Neon Drift', 'Loader']
};

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

const installBlock: InstallComponentDocs = {
	installCode: [],
	folderStructure: `src/
	└── lib/
		└── components/
			└── loaders/
				└── squares/
					└── square-1.svelte`
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
	useCases
};
