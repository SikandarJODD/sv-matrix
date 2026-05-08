import { circleItems } from "$lib/content/matrix-navigation";
import type { Component } from "svelte";

import Circle1 from "./circle-1.svelte";
import Circle2 from "./circle-2.svelte";
import Circle3 from "./circle-3.svelte";
import Circle4 from "./circle-4.svelte";
import Circle5 from "./circle-5.svelte";
import Circle6 from "./circle-6.svelte";
import Circle7 from "./circle-7.svelte";
import Circle8 from "./circle-8.svelte";
import Circle9 from "./circle-9.svelte";
import Circle10 from "./circle-10.svelte";
import Circle11 from "./circle-11.svelte";
import Circle12 from "./circle-12.svelte";
import Circle13 from "./circle-13.svelte";
import Circle14 from "./circle-14.svelte";
import Circle15 from "./circle-15.svelte";
import Circle16 from "./circle-16.svelte";
import Circle17 from "./circle-17.svelte";
import Circle18 from "./circle-18.svelte";
import Circle19 from "./circle-19.svelte";
import Circle20 from "./circle-20.svelte";

type LoaderShowcaseItem = {
	id: string;
	href: string;
	title: string;
	preview: Component;
};

const circlePreviews = [
	Circle1,
	Circle2,
	Circle3,
	Circle4,
	Circle5,
	Circle6,
	Circle7,
	Circle8,
	Circle9,
	Circle10,
	Circle11,
	Circle12,
	Circle13,
	Circle14,
	Circle15,
	Circle16,
	Circle17,
	Circle18,
	Circle19,
	Circle20,
];

export const data: LoaderShowcaseItem[] = circleItems.map((item, index) => ({
	id: item.id,
	href: item.href,
	title: item.title,
	preview: circlePreviews[index],
}));

export default data;
