<script lang="ts">
	import LoadingDots from './loading-dots.svelte';
	import { cn } from '$lib/utils.js';
	import type { ChatBubbleMessageProps } from './types';
	import { fade } from 'svelte/transition';

	let {
		ref = $bindable(null),
		typing = false,
		typingIndicator,
		class: className,
		children,
		...rest
	}: ChatBubbleMessageProps = $props();
</script>

<div
	{...rest}
	bind:this={ref}
	class={cn(
		"order-2 rounded-lg bg-secondary p-4 text-sm group-data-[variant='received']/chat-bubble:rounded-bl-none group-data-[variant='sent']/chat-bubble:order-1 group-data-[variant='sent']/chat-bubble:rounded-br-none group-data-[variant='sent']/chat-bubble:bg-primary group-data-[variant='sent']/chat-bubble:text-primary-foreground",
		className
	)}
	in:fade|global
>
	{#if typing}
		<div class="flex size-full place-items-center justify-center">
			{#if typingIndicator}
				{@render typingIndicator()}
			{:else}
				<LoadingDots />
			{/if}
		</div>
	{:else}
		{@render children?.()}
	{/if}
</div>
