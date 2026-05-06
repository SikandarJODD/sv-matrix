import type { SEO } from '$lib/types/seo';
import type { MatrixNavItem } from './matrix-navigation';

export type PlaceholderPageContent = {
	seo: SEO;
	message: string;
	highlights: string[];
};

const placeholderContentByPath: Record<string, PlaceholderPageContent> = {
	'/docs/introduction': {
		seo: {
			title: 'Introduction',
			description: 'Introduction page for the shared sv-matrix docs navigation.'
		},
		message: 'This page is the first Get Started placeholder and will become the high-level entry point for the docs.',
		highlights: [
			'Introduce the library structure and naming.',
			'Explain how the docs, search, and sidebar relate to each other.',
			'Point readers to the Setup and Usage pages next.'
		]
	},
	'/docs/setup': {
		seo: {
			title: 'Setup',
			description: 'Setup page for the shared sv-matrix docs navigation.'
		},
		message: 'This placeholder marks where installation and local setup guidance will live.',
		highlights: [
			'Document install prerequisites.',
			'Explain how to run the project locally.',
			'Cover the minimum project setup for trying loaders.'
		]
	},
	'/docs/usage': {
		seo: {
			title: 'Usage',
			description: 'Usage page for the shared sv-matrix docs navigation.'
		},
		message: 'This placeholder marks where usage patterns and copy-paste guidance will live.',
		highlights: [
			'Show how to browse loader pages.',
			'Explain how to copy source into another project.',
			'Describe the navigation flow into component pages.'
		]
	},
	'/components/circles/circle-1': {
		seo: {
			title: 'Circle 1',
			description: 'Placeholder page for the first circle loader.'
		},
		message: 'This is a temporary circle placeholder so the shared registry has working links before circle components are added.',
		highlights: [
			'Reserve the route for the first circle loader.',
			'Keep sidebar, search, and prev/next aligned with the future content tree.'
		]
	},
	'/components/circles/circle-2': {
		seo: {
			title: 'Circle 2',
			description: 'Placeholder page for the second circle loader.'
		},
		message: 'This is a temporary circle placeholder so the shared registry can already model the next component family.',
		highlights: [
			'Reserve the route for the second circle loader.',
			'Keep the shared navigation order complete for future circle docs.'
		]
	}
};

export function getPlaceholderPageContent(item: MatrixNavItem): PlaceholderPageContent {
	return (
		placeholderContentByPath[item.href] ?? {
			seo: {
				title: item.title,
				description: item.description ?? `${item.title} placeholder page.`
			},
			message: item.description ?? `${item.title} is not fully documented yet.`,
			highlights: []
		}
	);
}
