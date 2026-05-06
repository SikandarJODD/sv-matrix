import { getItemByPath, navigationSections } from '$lib/content/matrix-navigation';
import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageLoad } from './$types';

const getStartedItems = navigationSections.find((section) => section.id === 'get-started')?.items ?? [];

export const prerender = true;

export const entries: EntryGenerator = () =>
	getStartedItems.map((item) => ({
		slug: item.href.split('/').pop() ?? ''
	}));

export const load: PageLoad = ({ params }) => {
	const item = getItemByPath(`/docs/${params.slug}`);

	if (!item || item.section !== 'get-started') {
		throw error(404, 'Page not found');
	}

	return {
		item
	};
};
