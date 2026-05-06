import { getItemByPath, navigationSections } from '$lib/content/matrix-navigation';
import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageLoad } from './$types';

const circleItems = navigationSections.find((section) => section.id === 'circles')?.items ?? [];

export const prerender = true;

export const entries: EntryGenerator = () =>
	circleItems.map((item) => ({
		id: item.href.split('/').pop() ?? ''
	}));

export const load: PageLoad = ({ params }) => {
	const item = getItemByPath(`/components/circles/${params.id}`);

	if (!item || item.section !== 'circles') {
		throw error(404, 'Circle not found');
	}

	return {
		item
	};
};
