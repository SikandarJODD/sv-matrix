import { circleItems } from '$lib/content/matrix-navigation';
import type { Component } from 'svelte';

import Circle1 from './circle-1.svelte';
import Circle2 from './circle-2.svelte';
import Circle3 from './circle-3.svelte';
import Circle4 from './circle-4.svelte';
import Circle5 from './circle-5.svelte';
import Circle6 from './circle-6.svelte';
import Circle7 from './circle-7.svelte';
import Circle8 from './circle-8.svelte';


type LoaderShowcaseItem = {
	id: string;
	href: string;
	title: string;
	preview: Component;
};

const circlePreviews = [Circle1, Circle2, Circle3, Circle4, Circle5, Circle6, Circle7, Circle8];

export const data: LoaderShowcaseItem[] = circleItems.map((item, index) => ({
	id: item.id,
	href: item.href,
	title: item.title,
	preview: circlePreviews[index]
}));

export default data;
