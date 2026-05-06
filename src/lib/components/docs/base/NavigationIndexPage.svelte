<script lang="ts">
	import type { MatrixNavSection } from '$lib/content/matrix-navigation';
	import { H1, H2, Paragraph } from '$lib/components/docs/markdown/index';
	import SEOComponent from './SEO.svelte';

	let {
		title,
		description,
		sections
	}: {
		title: string;
		description: string;
		sections: MatrixNavSection[];
	} = $props();
</script>

<SEOComponent title={title} description={description} />

<div class="space-y-6 md:space-y-8">
	<section>
		<H1 id="introduction">{title}</H1>
		<div class="mt-3 max-w-2xl">
			<Paragraph>{description}</Paragraph>
		</div>
	</section>

	{#each sections as section (section.id)}
		<section>
			<H2 id={section.id}>{section.title}</H2>
			<ul class="mt-4 space-y-3">
				{#each section.items as item (item.id)}
					<li>
						<a class="hover:text-foreground text-foreground/80 transition-colors" href={item.href}>
							<span class="font-medium">{item.title}</span>
							{#if item.description}
								<span class="text-foreground/55 mt-1 block text-sm">{item.description}</span>
							{/if}
						</a>
					</li>
				{/each}
			</ul>
		</section>
	{/each}
</div>
