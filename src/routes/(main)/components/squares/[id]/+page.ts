import { getItemByPath, navigationSections } from '$lib/content/matrix-navigation';
import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageLoad } from './$types';

const squareItems = navigationSections.find((section) => section.id === 'squares')?.items ?? [];

export const prerender = true;

export const entries: EntryGenerator = () =>
	squareItems.map((item) => ({
		id: item.href.split('/').pop() ?? ''
	}));

export const load: PageLoad = ({ params }) => {
	const item = getItemByPath(`/components/squares/${params.id}`);

	if (!item || item.section !== 'squares') {
		throw error(404, 'Square not found');
	}

	return {
		id: params.id
	};
};
