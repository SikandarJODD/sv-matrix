<script lang="ts">
	import { page } from '$app/state';
	import { MetaTags } from 'svelte-meta-tags';
	type Props = {
		title: string;
		description: string;
		keywords?: string[];
		images?: {
			url: string;
			width?: number;
			height?: number;
			alt?: string;
		}[];
	};
	let {
		title,
		description,
		keywords,
		images = [
			{
				url: 'https://sv-matrix.vercel.app/og.png',
				alt: 'Svelte Dot Matrix Loaders'
			}
		]
	}: Props = $props();

	let canonical = $derived(page.url.origin);
	// $inspect("Canonical URL:", canonical);
	/*
    [
			{
				url: "https://www.example.ie/og-image-01.jpg",
				width: 800,
				height: 600,
				alt: "Og Image Alt",
			},
			{
				url: "https://www.example.ie/og-image-02.jpg",
				width: 900,
				height: 800,
				alt: "Og Image Alt Second",
			},
			{ url: "https://www.example.ie/og-image-03.jpg" },
			{ url: "https://www.example.ie/og-image-04.jpg" },
		]
    */
</script>

<MetaTags
	{title}
	titleTemplate="%s - Svelte Dot Matrix"
	{keywords}
	{description}
	{canonical}
	openGraph={{
		url: canonical,
		title: title,
		description: description,
		images: images,
		siteName: 'Svelte Dot Matrix'
	}}
	twitter={{
		creator: '@Sikandar_Bhide',
		site: '@Sikandar_Bhide',
		cardType: 'summary_large_image',
		title: title,
		description: description,
		// image: images && images[0] ? images[0].url : "https://sv-matrix.vercel.app/svelte.svg",
		imageAlt: images && images[0] ? images[0].alt : 'Svelte Dot Matrix Loaders'
	}}
/>
