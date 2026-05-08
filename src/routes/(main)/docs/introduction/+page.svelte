<script lang="ts">
	import SEOComponent from "$lib/components/docs/base/SEO.svelte";
	import { H1, H2, Link, Paragraph, Strong } from "$lib/components/docs/markdown";
</script>

<SEOComponent
	title="Introduction"
	description="A short overview of Svelte Dot Matrix Loaders and the original project it was ported from."
	keywords={["svelte loaders", "dot matrix loaders", "svelte dot matrix", "loader docs"]}
/>

<div class="space-y-8 md:space-y-10">
	<section>
		<H1 id="introduction">Svelte Dot Matrix Loaders</H1>
		<div class="mt-3 max-w-2xl">
			<Paragraph>
				Svelte Dot Matrix Loaders is a collection of dot-matrix style loaders for Svelte. It
				is built around reusable loading components and a shared runtime for the square
				loader family.
			</Paragraph>
			<Paragraph>
				This project is a Svelte port of the original <Strong>Dot Matrix</Strong>.
				<br />
				Start with <Link href="/docs/setup">Setup</Link> to get the base and your first loader
				running.
			</Paragraph>
		</div>
	</section>

	<section>
		<H2 id="credits">Credits</H2>
		<div class="mt-4 grid gap-4 md:grid-cols-2">
			<div class="relative rounded-lg border border-border bg-card p-5">
				<div
					class="absolute top-0 right-10 h-px w-50 bg-linear-to-r from-transparent via-white/50 to-transparent"
				></div>
				<div
					class="absolute bottom-0 left-10 h-px w-50 bg-linear-to-r from-transparent via-white/50 to-transparent"
				></div>
				<p class="text-sm text-muted-foreground">Original Author</p>
				<p class="mt-2 text-lg font-medium text-foreground">Shawn</p>
				<p class="mt-2 text-sm text-muted-foreground">
					Twitter:
					<Link href="https://x.com/zzzzshawn" target="_blank" rel="noopener noreferrer">
						@zzzzshawn
					</Link>
				</p>
			</div>

			<div class="relative rounded-lg border border-border bg-card p-5">
				<p class="text-sm text-muted-foreground">Port By</p>
				<p class="mt-2 text-lg font-medium text-foreground">Bhide Svelte</p>
				<p class="mt-2 text-sm text-muted-foreground">
					Twitter:
					<Link
						href="https://x.com/Sikandar_Bhide"
						target="_blank"
						rel="noopener noreferrer"
					>
						@Sikandar_Bhide
					</Link>
				</p>
			</div>
		</div>
	</section>
</div>
