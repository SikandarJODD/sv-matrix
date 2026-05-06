<script lang="ts">
	import { onDestroy } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import Square6 from '$lib/components/loaders/square/square-6.svelte';

	const timeouts: number[] = [];

	let isProcessing = $state(false);
	let isPaid = $state(false);

	onDestroy(() => {
		for (const timeout of timeouts) {
			window.clearTimeout(timeout);
		}
	});

	function processPayment() {
		if (isProcessing || isPaid) {
			return;
		}

		isProcessing = true;

		const timeout = window.setTimeout(() => {
			isProcessing = false;
			isPaid = true;
		}, 2500);

		timeouts.push(timeout);
	}
</script>

<div class="mx-auto w-md space-y-4">
	<div class="rounded-xl border bg-muted/30 p-4">
		<div class="flex items-center justify-between gap-3">
			<div>
				<p class="font-medium">Pro annual plan</p>
				<p class="mt-1 text-sm text-muted-foreground">Priority support and unlimited automations</p>
			</div>
			<p class="text-xl font-semibold">$48</p>
		</div>
	</div>

	<Button class="w-full" size="lg" disabled={isProcessing || isPaid} onclick={processPayment}>
		{#if isProcessing}
			<Square6 size={18} dotSize={2} speed={1.15} />
			Authorizing payment
		{:else if isPaid}
			Payment received
		{:else}
			Pay now
		{/if}
	</Button>

	<div class="min-h-8 text-sm">
		{#if isProcessing}
			<p class="text-muted-foreground">
				The action is locked while the payment provider confirms the charge.
			</p>
		{:else if isPaid}
			<p class="text-muted-foreground">
				Success. The order is complete and the workspace has been upgraded.
			</p>
		{:else}
			<p class="text-muted-foreground">
				Use a localized action loader instead of a full-screen checkout blocker.
			</p>
		{/if}
	</div>
</div>
