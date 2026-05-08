import { hexItems } from "$lib/content/matrix-navigation";
import type { Component } from "svelte";

import Hex1 from "./hex-1.svelte";
import Hex2 from "./hex-2.svelte";
import Hex3 from "./hex-3.svelte";
import Hex4 from "./hex-4.svelte";
import Hex5 from "./hex-5.svelte";
import Hex6 from "./hex-6.svelte";
import Hex7 from "./hex-7.svelte";
import Hex8 from "./hex-8.svelte";
import Hex9 from "./hex-9.svelte";
import Hex10 from "./hex-10.svelte";

type LoaderShowcaseItem = {
	id: string;
	href: string;
	title: string;
	preview: Component;
};

const hexPreviews = [Hex1, Hex2, Hex3, Hex4, Hex5, Hex6, Hex7, Hex8, Hex9, Hex10];

export const data: LoaderShowcaseItem[] = hexItems.map((item, index) => ({
	id: item.id,
	href: item.href,
	title: item.title,
	preview: hexPreviews[index],
}));

export default data;
