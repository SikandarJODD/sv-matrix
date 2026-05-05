<script lang="ts">
	import { Command as CommandPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";
	import * as InputGroup from "$lib/components/ui/input-group/index.js";
	import { HugeiconsIcon } from "@hugeicons/svelte"
	import { SearchIcon } from '@hugeicons/core-free-icons';

	let {
		ref = $bindable(null),
		class: className,
		value = $bindable(""),
		...restProps
	}: CommandPrimitive.InputProps = $props();
</script>

<div data-slot="command-input-wrapper" class="p-1 pb-0">
	<InputGroup.Root class="bg-input/30 h-9">
		<CommandPrimitive.Input
			{value}
			data-slot="command-input"
			class={cn(
				"w-full text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
				className
			)}
			{...restProps}
		>
			{#snippet child({ props })}
				<InputGroup.Input {...props} bind:value bind:ref />
			{/snippet}
		</CommandPrimitive.Input>
		<InputGroup.Addon>
			<HugeiconsIcon icon={SearchIcon} strokeWidth={2} class="size-4 shrink-0 opacity-50" />
		</InputGroup.Addon>
	</InputGroup.Root>
</div>
