<script lang="ts">
	import { DotMatrix, type DotMatrixPattern } from '$lib/components/dot-matrix/index.js';

	const patterns: DotMatrixPattern[] = ['full', 'diamond', 'outline', 'cross', 'rings', 'rose'];

	const sizeExamples = [
		{
			label: 'Compact',
			props: { size: 22, dotSize: 3, cellPadding: 1 }
		},
		{
			label: 'Balanced',
			props: { size: 30, dotSize: 4, cellPadding: 2 }
		},
		{
			label: 'Scaled Box',
			props: { size: 24, dotSize: 3, boxSize: 56, minSize: 56 }
		}
	] as const;
	const cardBase =
		'border-border/70 bg-card/70 rounded-[1.75rem] border px-5 py-5 shadow-[0_24px_80px_rgba(10,15,27,0.08)] backdrop-blur';
</script>

<svelte:head>
	<title>Dot Matrix Demo</title>
</svelte:head>

<div class="demo-shell">
	<section class="hero">
		<div class="hero-copy">
			<p class="eyebrow">Dot Matrix</p>
			<h1>Svelte 5 port with split helpers, runes, and staged animation presets.</h1>
			<p class="lead">
				The public surface is a single <code>DotMatrix</code> component. This page exercises static mode,
				hover mode, pattern masking, opacity remapping, and wrapper scaling.
			</p>
		</div>

		<div class="hero-preview">
			<div class={cardBase}>
				<DotMatrix aria-label="Default dot matrix preview" size={36} dotSize={4} boxSize={88} />
			</div>
			<div class={cardBase}>
				<DotMatrix
					aria-label="Blooming dot matrix preview"
					size={36}
					dotSize={4}
					boxSize={88}
					bloom={true}
					halo={0.5}
					opacityBase={0.12}
					opacityMid={0.38}
					opacityPeak={1}
				/>
			</div>
		</div>
	</section>

	<section class="grid">
		<article class={cardBase}>
			<h2>Default</h2>
			<p>Continuous path-wave animation with the default full pattern.</p>
			<div class="showcase-row">
				<DotMatrix aria-label="Default loading animation" size={28} dotSize={3} boxSize={64} />
			</div>
		</article>

		<article class={cardBase}>
			<h2>Static</h2>
			<p>Phase controller stays idle while the pattern remains visible.</p>
			<div class="showcase-row">
				<DotMatrix
					aria-label="Static dot matrix"
					animation="none"
					animated={false}
					pattern="diamond"
					size={28}
					dotSize={3}
					boxSize={64}
				/>
			</div>
		</article>

		<article class={cardBase}>
			<h2>Hover</h2>
			<p>Animation stays quiet until pointer entry, then resets on leave.</p>
			<div class="showcase-row">
				<DotMatrix
					aria-label="Hover activated dot matrix"
					animated={false}
					hoverAnimated={true}
					pattern="cross"
					size={28}
					dotSize={3}
					boxSize={64}
				/>
			</div>
		</article>
	</section>

	<section class={cardBase}>
		<div class="section-heading">
			<div>
				<p class="eyebrow">Patterns</p>
				<h2>Masking and inactive cells</h2>
			</div>
			<p>Inactive cells stay hidden while CSS animations remain attached only to active dots.</p>
		</div>

		<div class="pattern-grid">
			{#each patterns as pattern (pattern)}
				<div class="pattern-card">
					<DotMatrix
						aria-label={`${pattern} pattern`}
						{pattern}
						size={28}
						dotSize={3}
						boxSize={68}
					/>
					<p>{pattern}</p>
				</div>
			{/each}
		</div>
	</section>

	<section class={cardBase}>
		<div class="section-heading">
			<div>
				<p class="eyebrow">Sizing</p>
				<h2>Intrinsic layout and wrapper scaling</h2>
			</div>
			<p>
				The same renderer handles intrinsic matrix sizing, explicit cell padding, and scaled outer
				boxes.
			</p>
		</div>

		<div class="size-grid">
			{#each sizeExamples as example (example.label)}
				<div class="pattern-card">
					<DotMatrix aria-label={example.label} {...example.props} />
					<p>{example.label}</p>
				</div>
			{/each}
		</div>
	</section>

	<section class="grid">
		<article class={cardBase}>
			<h2>Bloom</h2>
			<p>Selective glow only appears once remapped opacity crosses the bloom threshold.</p>
			<div class="showcase-row">
				<DotMatrix
					aria-label="Bloom threshold example"
					size={30}
					dotSize={3}
					boxSize={72}
					bloom={true}
					opacityBase={0.1}
					opacityMid={0.28}
					opacityPeak={0.92}
				/>
			</div>
		</article>

		<article class={cardBase}>
			<h2>Halo</h2>
			<p>A uniform halo widens the drop-shadow falloff across all active dots.</p>
			<div class="showcase-row">
				<DotMatrix
					aria-label="Halo example"
					size={30}
					dotSize={3}
					boxSize={72}
					halo={0.7}
					pattern="rings"
				/>
			</div>
		</article>

		<article class={cardBase}>
			<h2>Muted</h2>
			<p>Muted mode keeps the pattern readable while suppressing bloom intensity.</p>
			<div class="showcase-row">
				<DotMatrix
					aria-label="Muted example"
					size={30}
					dotSize={3}
					boxSize={72}
					muted={true}
					pattern="outline"
				/>
			</div>
		</article>
	</section>
</div>

<style>
	/* :global(body) {
		background:
			radial-gradient(circle at top, rgba(254, 234, 199, 0.28), transparent 28rem),
			linear-gradient(180deg, rgba(255, 252, 245, 0.98), rgba(250, 244, 235, 1));
	} */

	.demo-shell {
		--border-border: rgba(33, 37, 41, 0.12);
		--bg-card: rgba(255, 255, 255, 0.78);
		max-width: 72rem;
		margin: 0 auto;
		padding: 4.5rem 1.25rem 5rem;
		display: grid;
		gap: 1.5rem;
		color: rgb(30, 34, 40);
	}

	.hero {
		display: grid;
		grid-template-columns: minmax(0, 1.4fr) minmax(18rem, 0.9fr);
		gap: 1.5rem;
		align-items: stretch;
	}

	.hero-copy,
	.hero-preview,
	.grid,
	.pattern-grid,
	.size-grid,
	.showcase-row {
		display: grid;
	}

	.hero-copy {
		gap: 1rem;
		padding: 1.25rem 0.25rem;
	}

	.hero-copy h1,
	h2,
	p {
		margin: 0;
	}

	.hero-copy h1 {
		font-size: clamp(2.3rem, 5vw, 4.4rem);
		line-height: 0.95;
		letter-spacing: -0.05em;
		max-width: 12ch;
	}

	.lead {
		max-width: 52ch;
		font-size: 1rem;
		line-height: 1.65;
		color: rgba(30, 34, 40, 0.74);
	}

	.eyebrow {
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: rgba(30, 34, 40, 0.56);
	}

	.hero-preview {
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}

	.grid {
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1.25rem;
	}

	.pattern-grid {
		grid-template-columns: repeat(6, minmax(0, 1fr));
		gap: 1rem;
		margin-top: 1.25rem;
	}

	.size-grid {
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
		margin-top: 1.25rem;
	}

	.pattern-card,
	.showcase-row {
		place-items: center;
		text-align: center;
	}

	.pattern-card {
		gap: 0.85rem;
		padding: 1rem;
		border-radius: 1.35rem;
		background: rgba(255, 255, 255, 0.58);
		border: 1px solid rgba(33, 37, 41, 0.08);
	}

	.pattern-card p,
	.showcase-row p,
	article p,
	.section-heading > p {
		color: rgba(30, 34, 40, 0.68);
		line-height: 1.55;
	}

	.showcase-row {
		min-height: 7.25rem;
	}

	.section-heading {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		align-items: end;
	}

	code {
		font-family: inherit;
		font-size: 0.92em;
		padding: 0.16rem 0.42rem;
		border-radius: 999px;
		background: rgba(30, 34, 40, 0.08);
	}

	@media (max-width: 900px) {
		.hero,
		.grid,
		.pattern-grid,
		.size-grid {
			grid-template-columns: 1fr;
		}

		.hero-preview {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.section-heading {
			flex-direction: column;
			align-items: start;
		}
	}

	@media (max-width: 640px) {
		.demo-shell {
			padding-top: 3rem;
		}

		.hero-preview {
			grid-template-columns: 1fr;
		}
	}
</style>
