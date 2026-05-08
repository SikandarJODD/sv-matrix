<script lang="ts">
	import { page } from "$app/state";
	import SEOComponent from "$lib/components/docs/base/SEO.svelte";
	import { CodeSpan, H1, H2, Paragraph } from "$lib/components/docs/markdown";
	import type { CodeBlock } from "$lib/components/ui/code";
	import { PreviewComponent } from "$lib/components/ui/preview-component";
	import { PMCommand } from "$lib/components/ui/pm-command";
	import { Separator } from "$lib/components/ui/separator";
	import Square1 from "$lib/components/loaders/square/square-1.svelte";
	import { PersistedState } from "runed";
	import type { Agent } from "package-manager-detector";

	const usageCode: CodeBlock = {
		filename: "example.svelte",
		filecode: [
			'<script lang="ts">',
			"\timport Square1 from '$lib/components/loaders/square-1.svelte';",
			"</scr" + "ipt>",
			"",
			"<Square1 />",
		].join("\n"),
		lang: "svelte",
	};

	const jsrepoPreviewLines = [
		"Retrieved manifest from @sv/loaders",
		"",
		"Which items would you like to add?",
		"",
		"Search:",
		"[ ] dot-matrix // base components for all loaders",
		"[ ] square-1",
		"[ ] square-2",
		"[ ] square-3",
		"[ ] square-4",
		"[ ] square-5",
		"...",
	];
	const jsrepoPreview = jsrepoPreviewLines.join("\n");

	type FolderSectionTone = "main" | "hooks" | "styles" | "core";
	type FolderLine = {
		tree: string;
		label: string;
		comment?: string;
		tone?: FolderSectionTone;
	};

	const folderStructure: FolderLine[] = [
		{ tree: "", label: "src/" },
		{ tree: "└─ ", label: "lib/" },
		{ tree: "   ├─ ", label: "components/" },
		{
			tree: "   │  ├─ ",
			label: "loaders/",
		},
		{
			tree: "   │  │  └─ ",
			label: "square-1.svelte",
			comment: "main component",
			tone: "main",
		},
		{
			tree: "   │  └─ ",
			label: "dot-matrix/",
			comment: "shared runtime",
			tone: "core",
		},
		{ tree: "   │     ├─ ", label: "dot-matrix.svelte" },
		{ tree: "   │     ├─ ", label: "dot-matrix-base.svelte" },
		{ tree: "   │     ├─ ", label: "geometry.ts" },
		{ tree: "   │     ├─ ", label: "types.ts" },
		{ tree: "   │     └─ ", label: "..." },
		{ tree: "   ├─ ", label: "hooks/" },
		{
			tree: "   │  └─ ",
			label: "dot-matrix/",
			comment: "hooks",
			tone: "hooks",
		},
		{ tree: "   │     ├─ ", label: "index.ts" },
		{ tree: "   │     ├─ ", label: "phase-controller.svelte.ts" },
		{ tree: "   │     ├─ ", label: "reduced-motion.ts" },
		{ tree: "   │     └─ ", label: "..." },
		{ tree: "   └─ ", label: "styles/" },
		{
			tree: "      └─ ",
			label: "dot-matrix.css",
			comment: "styles",
			tone: "styles",
		},
	];

	let agent = new PersistedState<Agent>("user-package-manager", "pnpm");

	function folderCommentClass(tone?: FolderSectionTone): string {
		if (tone === "main") return "text-orange-400";
		if (tone === "hooks") return "text-sky-400";
		if (tone === "styles") return "text-violet-400";
		if (tone === "core") return "text-emerald-400";
		return "text-muted-foreground";
	}
</script>

<SEOComponent
	title="Setup"
	description="Install loaders with jsrepo or shadcn-svelte, review the generated folder structure, and render your first example."
	keywords={[
		"setup",
		"svelte dot matrix",
		"square-1",
		"loader installation",
		"jsrepo",
		"shadcn-svelte",
	]}
/>

<div class="space-y-8 md:space-y-10">
	<section>
		<H1 id="setup">Setup</H1>
		<div class="mt-3 max-w-2xl">
			<Paragraph>
				Install from the <CodeSpan>@sv/loaders</CodeSpan> registry with either
				<CodeSpan>jsrepo</CodeSpan> or <CodeSpan>shadcn-svelte</CodeSpan>. Both flows
				install the same shared <CodeSpan>dot-matrix</CodeSpan> foundation plus the loader you
				pick.
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
				args={["jsrepo", "add", "--registry", "@sv/loaders"]}
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
				<CodeSpan>dot-matrix</CodeSpan> installs the shared base components for every loader.
				After that, pick any square loader you want to bring into your project.
			</Paragraph>
		</div>
	</section>

	<section>
		<H2 id="install-with-shadcn-svelte">Install With shadcn-svelte</H2>
		<div class="mt-3 max-w-2xl">
			<Paragraph>
				We use <CodeSpan>shadcn-svelte</CodeSpan> only for component distribution.
			</Paragraph>
		</div>

		<div class="mt-4">
			<PMCommand
				command="execute"
				args={["shadcn-svelte@latest", "add", `${page.url.origin}/r/dot-matrix.json`]}
				bind:agent={agent.current}
			/>
		</div>
	</section>

	<section>
		<H2 id="folder-structure">Folder Structure</H2>
		<div class="mt-3 max-w-2xl">
			<Paragraph>
				After installing <CodeSpan>dot-matrix</CodeSpan> and <CodeSpan>square-1</CodeSpan>,
				your project will be organized into a small loader entry point, shared runtime
				files, hooks, and one shared stylesheet.
			</Paragraph>
		</div>

		<div class="mt-6 overflow-hidden rounded-lg border border-border bg-secondary/50">
			<div class="flex items-center justify-between border-b border-border px-4 py-2">
				<p class="text-sm font-medium text-foreground">Installed File Layout</p>
				<p class="font-mono text-xs text-muted-foreground">src/lib</p>
			</div>
			<div class="space-y-1 overflow-x-auto p-4 font-mono text-sm leading-7 text-foreground">
				{#each folderStructure as line}
					<div class="whitespace-pre">
						<span class="text-amber-200/80">{line.tree}</span>{line.label}
						{#if line.comment}
							<span class={["ml-3", folderCommentClass(line.tone)]}
								>// {line.comment}</span
							>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</section>

	<Separator class="bg-border/80" />

	<section>
		<H2 id="usage">Usage</H2>
		<div class="mt-3 max-w-2xl">
			<Paragraph>
				Once setup is done, import the loader and render it anywhere you need a simple
				loading state.
			</Paragraph>
		</div>

		<PreviewComponent code={usageCode} showRetry={false} class="min-h-[18rem] bg-muted/10">
			<div class="text-primary">
				<Square1 />
			</div>
		</PreviewComponent>

		<div class="mt-4 max-w-2xl">
			<Paragraph>
				Neon Drift Loader would be installed as <CodeSpan
					>src/lib/components/loaders/square-1.svelte</CodeSpan
				>.
				<br />
				You can tune props like <CodeSpan>size</CodeSpan>, <CodeSpan>dotSize</CodeSpan>, and
				<CodeSpan>speed</CodeSpan> and many more.
			</Paragraph>
		</div>
	</section>
</div>
