<script lang="ts">
	import { page } from '$app/state';
	import SEOComponent from '$lib/components/docs/base/SEO.svelte';
	import { CodeSpan, H1, H2, Paragraph } from '$lib/components/docs/markdown';
	import type { CodeBlock } from '$lib/components/ui/code';
	import { PreviewComponent } from '$lib/components/ui/preview-component';
	import { PMCommand } from '$lib/components/ui/pm-command';
	import Square1 from '$lib/components/loaders/square/square-1.svelte';
	import { PersistedState } from 'runed';
	import type { Agent } from 'package-manager-detector';
	import PmCommand from '$lib/components/ui/pm-command/pm-command.svelte';

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

	let agent = new PersistedState<Agent>('user-package-manager', 'pnpm');
</script>

<SEOComponent
	title="Setup"
	description="Install the shared dot-matrix base, add Square 1, and render your first loader."
	keywords={['setup', 'svelte dot matrix', 'square-1', 'loader installation']}
/>

<div class="space-y-8 md:space-y-10">
	<section>
		<H1 id="setup">Setup</H1>
		<div class="mt-3 max-w-2xl">
			<Paragraph>
				Install the shared <CodeSpan>dot-matrix</CodeSpan> base first. Then add
				<CodeSpan>square-1</CodeSpan> as your first loader.
			</Paragraph>
		</div>
	</section>

	<section>
		<H2 id="install-dot-matrix">Install the Dot Matrix Base</H2>
		<div class="mt-3 max-w-2xl">
			<Paragraph>This is the shared foundation used by all loaders.</Paragraph>
		</div>

		<div class="mt-4">
			<PmCommand
				command="add"
				args={['shadcn-svelte@latest', 'add', `${page.url.origin}/r/dot-matrix.json`]}
				bind:agent={agent.current}
			/>
		</div>
		<div class="mt-4">
			<Paragraph>
				This will install <CodeSpan>dot-matrix</CodeSpan> folder inside <CodeSpan
					>src/lib/components</CodeSpan
				> and its dependencies, including <CodeSpan>clsx</CodeSpan>.
			</Paragraph>
		</div>
	</section>

	<section>
		<H2 id="install-square-1">Install Neon Drift Loader</H2>
		<div class="mt-3 max-w-2xl">
			<Paragraph>
				After the base is in place, add <CodeSpan>square-1</CodeSpan> loader.
			</Paragraph>
		</div>

		<div class="mt-4">
			<PmCommand
				command="add"
				args={['shadcn-svelte@latest', 'add', `${page.url.origin}/r/square-1.json`]}
				bind:agent={agent.current}
			/>
		</div>
	</section>

	<section>
		<H2 id="usage">Usage</H2>
		<div class="mt-3 max-w-2xl">
			<Paragraph>
				Import the loader and render it anywhere you need a simple loading state.
			</Paragraph>
		</div>

		<PreviewComponent code={usageCode} showRetry={false} class="min-h-[18rem] bg-muted/10">
			<div class="text-primary">
				<Square1 />
			</div>
		</PreviewComponent>

		<div class="mt-4 max-w-2xl">
			<Paragraph>
				Neon Drift Loader would be installed inside <CodeSpan>src/lib/components/loaders/square-1</CodeSpan> folder.
				<br />
				You can tune props like <CodeSpan>size</CodeSpan>, <CodeSpan>dotSize</CodeSpan>, and
				<CodeSpan>speed</CodeSpan> and many more.
			</Paragraph>
		</div>
	</section>
</div>
