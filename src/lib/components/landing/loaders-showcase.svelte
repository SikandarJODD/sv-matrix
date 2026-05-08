<script lang="ts">
	import { data as squares } from "../loaders/square/data";
	import { data as circles } from "$lib/components/loaders/circles/data";
	import { data as triangles } from "$lib/components/loaders/triangle/data";
	import { data as hex } from "$lib/components/loaders/hex/data";

	let items = [...squares, ...circles, ...triangles, ...hex];
</script>

<section
	class="mx-auto w-full max-w-7xl animate-in px-4 pt-10 pb-16 delay-400 duration-300 ease-out fill-mode-backwards blur-in fade-in md:mt-14 md:mb-24 md:px-6"
>
	<div class="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-5">
		{#each items as item (item.id)}
			{@const ShowcaseComponent = item.preview}
			<a
				href={item.href}
				aria-label={`Open ${item.title} details`}
				class="group relative aspect-square overflow-hidden rounded-[2rem] bg-secondary text-foreground ring-foreground/10 transition-all duration-200 ease-out hover:-translate-y-1 hover:border-white/10 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none dark:bg-secondary/10 dark:shadow-[0_24px_80px_rgba(0,0,0,0.28)]"
			>
				<!-- <div
					aria-hidden="true"
					class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_45%)] opacity-70 transition-opacity duration-200 group-hover:opacity-100"
				></div> -->

				<div
					class="absolute inset-x-0 top-1/2 flex translate-y-[-58%] items-center justify-center px-6"
				>
					<ShowcaseComponent />
				</div>

				<div class="absolute inset-x-0 bottom-5 px-4 text-center">
					<span
						class="font-geist-pixel-grid text-sm tracking-wide text-foreground/80 md:text-sm"
					>
						{item.title}
					</span>
				</div>
			</a>
		{/each}
	</div>
</section>
