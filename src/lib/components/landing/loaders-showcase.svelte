<script lang="ts">
	import type { Component } from 'svelte';
	import { getSquarePageData, squareSourceItems } from '$lib/content/squares';

	type LoaderShowcaseItem = {
		id: string;
		href: string;
		title: string;
		preview: Component;
	};

	const showcaseItems = squareSourceItems
		.map((item) => {
			const pageData = getSquarePageData(item.id);

			return {
				id: pageData?.id ?? item.id,
				href: `/components/squares/${pageData?.id ?? item.id}`,
				title: pageData?.title ?? item.name,
				preview: pageData?.preview
			};
		})
		.filter((item): item is LoaderShowcaseItem => item.preview !== undefined);
</script>

<section class="mx-auto w-full max-w-7xl px-4 pb-16 pt-10 md:px-6 md:mb-24 md:mt-14">
	<div class="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-5">
		{#each showcaseItems as item (item.id)}
		{@const ShowcaseComponent = item.preview}
			<a
				href={item.href}
				aria-label={`Open ${item.title} details`}
				class="dark:bg-secondary/10 bg-secondary text-foreground ring-foreground/10 focus-visible:ring-ring/50 group relative aspect-square overflow-hidden rounded-[2rem] border border-white/5 dark:shadow-[0_24px_80px_rgba(0,0,0,0.28)] transition-all duration-200 ease-out hover:-translate-y-1 hover:border-white/10 focus-visible:outline-none focus-visible:ring-[3px]"
			>
				<div
					aria-hidden="true"
					class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_45%)] opacity-70 transition-opacity duration-200 group-hover:opacity-100"
				></div>

				<div class="absolute inset-x-0 top-1/2 flex translate-y-[-58%] items-center justify-center px-6">
					<ShowcaseComponent />
				</div>

				<div class="absolute inset-x-0 bottom-5 px-4 text-center">
					<span class="font-geist-pixel-grid text-sm tracking-wide text-foreground/80 md:text-sm">
						{item.title}
					</span>
				</div>
			</a>
		{/each}
	</div>
</section>
