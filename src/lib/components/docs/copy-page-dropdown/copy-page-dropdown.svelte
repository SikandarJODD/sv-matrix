<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import * as ButtonGroup from '$lib/components/ui/button-group';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { getPrevNext } from '$lib/content/matrix-navigation';
	import { cn } from '$lib/utils';
	import * as Kbd from '$lib/components/ui/kbd';
	import {
		OpenIn,
		OpenInContent,
		OpenInSeparator,
		OpenInChatGPT,
		OpenInClaude,
		OpenInScira,
		OpenInT3
	} from '$lib/components/ui/open-in-chat';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { CopyMarkdown } from '$lib/components/ui/copy-markdown';
	import MarkdownIcon from '$lib/components/icons/markdown.svelte';
	import { ChevronDown, ChevronLeft, ChevronRight, ExternalLink } from '@lucide/svelte';

	interface Props {
		componentName: string;
		llmsTxtUrl: string;
		class?: string;
	}

	let { componentName, llmsTxtUrl, class: className }: Props = $props();

	// Create the query for AI assistants
	$inspect(llmsTxtUrl, 'llmsTxtUrl');
	let query = $derived(`Read ${llmsTxtUrl} and help me understand the ${componentName} component`);

	let navigation = $derived(getPrevNext(page.url.pathname));
	let previousLabel = $derived(
		navigation.prev ? `Previous: ${navigation.prev.title}` : 'Previous page'
	);
	let nextLabel = $derived(navigation.next ? `Next: ${navigation.next.title}` : 'Next page');
</script>

<div class={cn('flex items-center gap-2', className)}>
	<ButtonGroup.Root>
		<CopyMarkdown {llmsTxtUrl} />
		<OpenIn {query}>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button {...props} variant="secondary" size="sm" class="px-2">
						<ChevronDown class="size-4" />
					</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<OpenInContent align="end">
				<OpenInChatGPT />
				<OpenInClaude />
				<OpenInScira />
				<OpenInT3 />
				<OpenInSeparator />
				<DropdownMenu.Item class="gap-2">
					<a
						href={llmsTxtUrl}
						target="_blank"
						rel="noopener"
						class="flex w-full items-center gap-2"
					>
						<MarkdownIcon class="size-4" />
						<span class="flex-1">Open as Markdown</span>
						<ExternalLink class="size-4" />
					</a>
				</DropdownMenu.Item>
			</OpenInContent>
		</OpenIn>
	</ButtonGroup.Root>

	<div class="ml-auto flex items-center gap-1">
		{#if navigation.prev || navigation.next}
			<Tooltip.Provider delayDuration={0}>
				{#if navigation.prev}
					<Tooltip.Root>
						<Tooltip.Trigger>
							{#snippet child({ props })}
								<Button
									{...props}
									href={navigation.prev?.href}
									variant="secondary"
									size="icon-sm"
									class="shrink-0"
									aria-label={previousLabel}
								>
									<ChevronLeft class="size-4" />
								</Button>
							{/snippet}
						</Tooltip.Trigger>
						<Tooltip.Content side='bottom'>
							Press <Kbd.Root>←</Kbd.Root>
						</Tooltip.Content>
					</Tooltip.Root>
				{/if}

				{#if navigation.next}
					<Tooltip.Root>
						<Tooltip.Trigger>
							{#snippet child({ props })}
								<Button
									{...props}
									href={navigation.next?.href}
									variant="secondary"
									size="icon-sm"
									class="shrink-0"
									aria-label={nextLabel}
								>
									<ChevronRight class="size-4" />
								</Button>
							{/snippet}
						</Tooltip.Trigger>
						<Tooltip.Content side='bottom'>
							Press <Kbd.Root>→</Kbd.Root>
						</Tooltip.Content>
					</Tooltip.Root>
				{/if}
			</Tooltip.Provider>
		{/if}
	</div>
</div>
