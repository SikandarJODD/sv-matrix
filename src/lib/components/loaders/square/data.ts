import { squareItems } from '$lib/content/matrix-navigation';
import type { Component } from 'svelte';

import Square1 from './square-1.svelte';
import Square2 from './square-2.svelte';
import Square3 from './square-3.svelte';
import Square4 from './square-4.svelte';
import Square5 from './square-5.svelte';
import Square6 from './square-6.svelte';
import Square7 from './square-7.svelte';
import Square8 from './square-8.svelte';
import Square9 from './square-9.svelte';
import Square10 from './square-10.svelte';
import Square11 from './square-11.svelte';
import Square12 from './square-12.svelte';
import Square13 from './square-13.svelte';
import Square14 from './square-14.svelte';
import Square15 from './square-15.svelte';
import Square16 from './square-16.svelte';
import Square17 from './square-17.svelte';
import Square18 from './square-18.svelte';
import Square19 from './square-19.svelte';
import Square20 from './square-20.svelte';

type LoaderShowcaseItem = {
	id: string;
	href: string;
	title: string;
	preview: Component;
};

const squarePreviews = [
	Square1,
	Square2,
	Square3,
	Square4,
	Square5,
	Square6,
	Square7,
	Square8,
	Square9,
	Square10,
	Square11,
	Square12,
	Square13,
	Square14,
	Square15,
	Square16,
	Square17,
	Square18,
	Square19,
	Square20
];

export const data: LoaderShowcaseItem[] = squareItems.map((item, index) => ({
	id: item.id,
	href: item.href,
	title: item.title,
	preview: squarePreviews[index]
}));

export default data;
