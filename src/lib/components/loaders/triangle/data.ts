import { triangleItems } from "$lib/content/matrix-navigation";
import type { Component } from "svelte";

import Triangle1 from "./triangle-1.svelte";
import Triangle2 from "./triangle-2.svelte";
import Triangle3 from "./triangle-3.svelte";
import Triangle4 from "./triangle-4.svelte";
import Triangle5 from "./triangle-5.svelte";
import Triangle6 from "./triangle-6.svelte";
import Triangle7 from "./triangle-7.svelte";
import Triangle8 from "./triangle-8.svelte";
import Triangle9 from "./triangle-9.svelte";
import Triangle10 from "./triangle-10.svelte";
import Triangle11 from "./triangle-11.svelte";
import Triangle12 from "./triangle-12.svelte";
import Triangle13 from "./triangle-13.svelte";
import Triangle14 from "./triangle-14.svelte";
import Triangle15 from "./triangle-15.svelte";
import Triangle16 from "./triangle-16.svelte";
import Triangle17 from "./triangle-17.svelte";
import Triangle18 from "./triangle-18.svelte";
import Triangle19 from "./triangle-19.svelte";
import Triangle20 from "./triangle-20.svelte";

type LoaderShowcaseItem = {
	id: string;
	href: string;
	title: string;
	preview: Component;
};

const trianglePreviews = [
	Triangle1,
	Triangle2,
	Triangle3,
	Triangle4,
	Triangle5,
	Triangle6,
	Triangle7,
	Triangle8,
	Triangle9,
	Triangle10,
	Triangle11,
	Triangle12,
	Triangle13,
	Triangle14,
	Triangle15,
	Triangle16,
	Triangle17,
	Triangle18,
	Triangle19,
	Triangle20,
];

export const data: LoaderShowcaseItem[] = triangleItems.map((item, index) => ({
	id: item.id,
	href: item.href,
	title: item.title,
	preview: trianglePreviews[index],
}));

export default data;
