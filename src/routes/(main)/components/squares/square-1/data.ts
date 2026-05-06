import type { ComponentDoc, ComponentMeta, InstallComponentDocs } from '$lib/types/structure';
import type { SEO } from '$lib/types/seo';
import Preview from './examples/preview.svelte';
import PreviewCode from './examples/preview.svelte?raw';

export const meta: ComponentMeta = {
	id: 'square-1',
	title: 'Neon Drift'
};

const seo: SEO = {
	title: 'Neon Drift Loader',
	description: 'Neon Drift Loader component for svelte',
	keywords: ['Svelte', 'Neon Drift', 'Loader']
};

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
	}
};
