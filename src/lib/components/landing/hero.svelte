<script lang="ts">
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import { Button } from '$lib/components/ui/button';
</script>

<section class="mx-auto w-full max-w-6xl overflow-hidden pt-16 pb-10 md:pb-0">
	<div aria-hidden="true" class="absolute inset-0 size-full overflow-hidden">
		<div
			class="absolute inset-0 isolate -z-10 bg-[radial-gradient(60%_80%_at_20%_0%,color-mix(in_oklab,var(--foreground)_10%,transparent),transparent)] lg:bg-[radial-gradient(20%_80%_at_20%_0%,color-mix(in_oklab,var(--foreground)_10%,transparent),transparent)]"
		></div>
	</div>

	<div class="relative z-10 flex max-w-3xl flex-col gap-5 px-4 md:px-0">
		<a
			class="group flex w-fit animate-in items-center gap-3 rounded-full border bg-card p-1 shadow-xs transition-all delay-0 delay-100 duration-500 ease-out fill-mode-backwards slide-in-from-bottom-10 fade-in"
			href="/components/squares/square-18"
		>
			<div class="rounded-full border bg-card px-1.5 py-0.5 shadow-sm">
				<p class="font-mono text-xs lowercase">new</p>
			</div>

			<span class="text-xs">Checkout New Loaders</span>
			<span class="block h-5 border-l"></span>

			<div class="pr-1">
				<ArrowRight
					class="size-3 -translate-x-0.5 duration-150 ease-out group-hover:translate-x-0.5"
				/>
			</div>
		</a>

		<h1
			class="animate-in font-geist-pixel-circle text-4xl leading-tight font-medium text-balance text-foreground delay-200 duration-500 ease-out fill-mode-backwards slide-in-from-bottom-10 fade-in md:text-6xl"
		>
			Svelte Dot Matrix
		</h1>

		<p
			class="animate-in font-geist-pixel-circle text-sm tracking-wider text-muted-foreground delay-200 duration-500 ease-out fill-mode-backwards slide-in-from-bottom-10 fade-in sm:text-lg md:text-2xl"
		>
			50+ free and open-source loaders, <br /> Built with Svelte, TypeScript, Tailwind CSS
		</p>

		<div
			class="flex w-fit animate-in items-center justify-center gap-3 pt-2 delay-300 duration-500 ease-out fill-mode-backwards slide-in-from-bottom-10 fade-in"
		>
			<Button href="/components/squares/square-1" size="lg" class='px-3'>
				View Loaders
			</Button>
			<Button href="/docs/setup" size="lg" variant="outline" class='px-3'>Setup guide</Button>
		</div>
	</div>
</section>
