<script lang="ts">
	import { H1, H2, Paragraph } from '$lib/components/docs/markdown/index';
	import type { PlaceholderPageContent } from '$lib/content/matrix-placeholder-content';
	import type { MatrixNavItem } from '$lib/content/matrix-navigation';
	import SEOComponent from './SEO.svelte';

	let {
		item,
		content
	}: {
		item: MatrixNavItem;
		content: PlaceholderPageContent;
	} = $props();
</script>

<SEOComponent
	title={content.seo.title}
	description={content.seo.description}
	keywords={content.seo.keywords}
/>

<div class="space-y-6 md:space-y-8">
	<section>
		<H1 id="introduction">{item.title}</H1>
		<div class="mt-3 max-w-2xl">
			<Paragraph>{item.description ?? content.message}</Paragraph>
		</div>
	</section>

	<section>
		<H2 id="status">Status</H2>
		<div class="mt-3 max-w-2xl">
			<Paragraph>{content.message}</Paragraph>
		</div>
	</section>

	{#if content.highlights.length > 0}
		<section>
			<H2 id="included">Included</H2>
			<ul class="text-foreground/80 mt-3 list-disc space-y-2 pl-5">
				{#each content.highlights as highlight}
					<li>{highlight}</li>
				{/each}
			</ul>
		</section>
	{/if}
</div>
