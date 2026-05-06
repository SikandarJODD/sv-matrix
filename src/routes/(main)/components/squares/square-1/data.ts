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

export const meta: ComponentMeta = {
	id: 'square-1',
	title: 'Neon Drift'
};

const seo: SEO = {
	title: 'Neon Drift Loader',
	description: 'Neon Drift Loader component for svelte',
	keywords: ['Svelte', 'Neon Drift', 'Loader']
};

let examples: Example[]=[
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
]

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
	examples
};
