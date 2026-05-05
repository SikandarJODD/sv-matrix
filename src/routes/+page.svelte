<script lang="ts">
	import SquareTwo from '$lib/components/loaders/square/square-2.svelte';

	const fontSpecimens = [
		{
			name: 'Circle',
			className: 'font-geist-pixel-circle',
			fileName: 'GeistPixel-Circle.woff2',
			preview: 'PIXEL CIRCLE 0123456789'
		},
		{
			name: 'Grid',
			className: 'font-geist-pixel-grid',
			fileName: 'GeistPixel-Grid.woff2',
			preview: 'PIXEL GRID 0123456789'
		},
		{
			name: 'Line',
			className: 'font-geist-pixel-line',
			fileName: 'GeistPixel-Line.woff2',
			preview: 'PIXEL LINE 0123456789'
		},
		{
			name: 'Square',
			className: 'font-geist-pixel-square',
			fileName: 'GeistPixel-Square.woff2',
			preview: 'PIXEL SQUARE 0123456789'
		},
		{
			name: 'Triangle',
			className: 'font-geist-pixel-triangle',
			fileName: 'GeistPixel-Triangle.woff2',
			preview: 'PIXEL TRIANGLE 0123456789'
		}
	] as const;
</script>

<div class="min-h-screen bg-background text-foreground">
	<div class="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-10 md:px-10 md:py-14">
		<section
			class="grid gap-8 rounded-3xl border border-border/70 bg-card/60 p-6 shadow-sm backdrop-blur md:grid-cols-[1.15fr_0.85fr] md:p-8"
		>
			<div class="space-y-4">
				<p class="text-xs uppercase tracking-[0.35em] text-muted-foreground">Font Preview</p>
				<h1 class="max-w-2xl text-4xl font-semibold tracking-tight md:text-5xl">
					Geist Pixel is loaded from
					<code class="rounded bg-muted px-2 py-1 text-sm">static/fonts</code>
				</h1>
				<p class="max-w-xl text-sm leading-7 text-muted-foreground md:text-base">
					Each specimen card below applies one of the five font utilities from
					<code class="rounded bg-muted px-2 py-1 text-xs">layout.css</code>, so you can
					verify the variants visually in one place.
				</p>
				<div class="flex flex-wrap gap-3 text-xs text-muted-foreground">
					<span class="rounded-full border border-border bg-background px-3 py-1.5"
						>font-display: swap</span
					>
					<span class="rounded-full border border-border bg-background px-3 py-1.5"
						>Tailwind theme vars</span
					>
					<span class="rounded-full border border-border bg-background px-3 py-1.5"
						>5 font variants</span
					>
				</div>
			</div>

			<div
				class="flex min-h-56 items-center justify-center rounded-2xl border border-dashed border-border/70 bg-background/80 p-6"
			>
				<div class="flex flex-col items-center gap-4">
					<p class="text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
						Existing loader
					</p>
					<SquareTwo dotSize={4} cellPadding={1} boxSize={50} />
				</div>
			</div>
		</section>

		<section class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
			{#each fontSpecimens as specimen (specimen.name)}
				<article class="rounded-3xl border border-border/70 bg-card p-5 shadow-sm">
					<div class="mb-4 flex items-start justify-between gap-4">
						<div>
							<p class="text-xs uppercase tracking-[0.28em] text-muted-foreground">
								{specimen.name}
							</p>
							<h2 class="mt-2 text-lg font-medium">{specimen.fileName}</h2>
						</div>
						<code class="rounded bg-muted px-2 py-1 text-xs">.{specimen.className}</code>
					</div>

					<div class="rounded-2xl border border-border/60 bg-background p-4">
						<p class={[specimen.className, 'text-2xl leading-tight md:text-3xl']}>
							{specimen.preview}
						</p>
						<p class={[specimen.className, 'mt-3 text-sm tracking-wide text-muted-foreground']}>
							THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG
						</p>
						<p class="mt-4 text-xs leading-6 text-muted-foreground">
							Utility in use:
							<code class="rounded bg-muted px-2 py-1 text-[11px]">
								class=&quot;{specimen.className}&quot;
							</code>
						</p>
					</div>
				</article>
			{/each}
		</section>

		<section class="rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
			<p class="text-sm leading-7 text-muted-foreground">
				The generic
				<code class="rounded bg-muted px-2 py-1 text-xs">font-geist-pixel</code>
				alias in
				<code class="rounded bg-muted px-2 py-1 text-xs">layout.css</code>
				currently points to the Square variant.
			</p>
		</section>
	</div>
</div>
