<script lang="ts">
	import SEOComponent from '$lib/components/docs/base/SEO.svelte';
	import { CodeSpan, H1, H2, Paragraph } from '$lib/components/docs/markdown';
	import type { CodeBlock } from '$lib/components/ui/code';
	import { PreviewComponent } from '$lib/components/ui/preview-component';
	import { PMCommand } from '$lib/components/ui/pm-command';
	import { Separator } from '$lib/components/ui/separator';
	import Square1 from '$lib/components/loaders/square/square-1.svelte';
	import { PersistedState } from 'runed';
	import type { Agent } from 'package-manager-detector';

	const usageCode: CodeBlock = {
		filename: 'example.svelte',
		filecode: [
			'<script lang="ts">',
			"\timport Square1 from '$lib/components/loaders/square-1.svelte';",
			'</scr' + 'ipt>',
			'',
			'<Square1 />'
		].join('\n'),
		lang: 'svelte'
	};

	const jsrepoPreviewLines = [
		'Retrieved manifest from @sv/loaders',
		'',
		'Which items would you like to add?',
		'',
		'Search:',
		'[ ] dot-matrix // base components for all loaders',
		'[ ] square-1',
		'[ ] square-2',
		'[ ] square-3',
		'[ ] square-4',
		'[ ] square-5',
		'...'
	];
	const jsrepoPreview = jsrepoPreviewLines.join('\n');

	let agent = new PersistedState<Agent>('user-package-manager', 'pnpm');
</script>

<SEOComponent
	title="Setup"
	description="Install loaders from the jsrepo registry, pick dot-matrix plus a loader, and render your first example."
	keywords={['setup', 'svelte dot matrix', 'square-1', 'loader installation', 'jsrepo']}
/>

<div class="space-y-8 md:space-y-10">
	<section>
		<H1 id="setup">Setup</H1>
		<div class="mt-3 max-w-2xl">
			<Paragraph>
				Install from the <CodeSpan>@sv/loaders</CodeSpan> registry with
				<CodeSpan>jsrepo</CodeSpan>. Select <CodeSpan>dot-matrix</CodeSpan> plus any loader, then press
				Enter to add them to your project.
			</Paragraph>
		</div>
	</section>

	<section>
		<H2 id="install-with-jsrepo">Install With jsrepo</H2>
		<div class="mt-3 max-w-2xl">
			<Paragraph>
				If you're following the example below, choose <CodeSpan>dot-matrix</CodeSpan> and
				<CodeSpan>square-1</CodeSpan> from the picker.
			</Paragraph>
		</div>

		<div class="mt-4">
			<PMCommand
				command="execute"
				args={['jsrepo', 'add', '--registry', '@sv/loaders']}
				bind:agent={agent.current}
			/>
		</div>

		<div class="mt-6 overflow-hidden rounded-lg border border-border bg-secondary/50">
			<div class="flex items-center justify-between border-b border-border px-4 py-2">
				<div class="flex items-center gap-2">
					<div class="size-2 rounded-full bg-primary"></div>
					<p class="text-sm font-medium text-foreground">Registry Picker Preview</p>
				</div>
				<p class="font-mono text-xs text-muted-foreground">@sv/loaders</p>
			</div>
			<div class="overflow-x-auto p-4">
				<pre class="font-mono text-sm leading-7 text-primary">{jsrepoPreview}</pre>
			</div>
		</div>

		<div class="mt-4 max-w-2xl">
			<Paragraph>
				<CodeSpan>dot-matrix</CodeSpan> installs the shared base components for every loader. After that,
				pick any square loader you want to bring into your project.
			</Paragraph>
		</div>
	</section>

	<Separator class="bg-border/80" />

	<section>
		<H2 id="usage">Usage</H2>
		<div class="mt-3 max-w-2xl">
			<Paragraph>
				Once setup is done, import the loader and render it anywhere you need a simple loading
				state.
			</Paragraph>
		</div>

		<PreviewComponent code={usageCode} showRetry={false} class="min-h-[18rem] bg-muted/10">
			<div class="text-primary">
				<Square1 />
			</div>
		</PreviewComponent>

		<div class="mt-4 max-w-2xl">
			<Paragraph>
				Neon Drift Loader would be installed inside <CodeSpan
					>src/lib/components/loaders/square-1</CodeSpan
				> folder.
				<br />
				You can tune props like <CodeSpan>size</CodeSpan>, <CodeSpan>dotSize</CodeSpan>, and
				<CodeSpan>speed</CodeSpan> and many more.
			</Paragraph>
		</div>
	</section>
</div>
