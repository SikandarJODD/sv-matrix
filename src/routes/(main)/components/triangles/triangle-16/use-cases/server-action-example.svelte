<script lang="ts">
	import { onDestroy } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import Triangle16 from '$lib/components/loaders/triangle/triangle-16.svelte';

	const timeouts: number[] = [];

	let isRunning = $state(false);
	let hasCompleted = $state(false);

	onDestroy(() => {
		for (const timeout of timeouts) {
			window.clearTimeout(timeout);
		}
	});

	function runServerAction() {
		if (isRunning) {
			return;
		}

		isRunning = true;
		hasCompleted = false;

		const timeout = window.setTimeout(() => {
			isRunning = false;
			hasCompleted = true;
		}, 3000);

		timeouts.push(timeout);
	}
</script>

<div class="mx-auto w-xl">
	<div class="rounded-xl border border-border p-4">
		<div class="flex items-start justify-between gap-3">
			<div>
				<p class="font-medium">Resend workspace invitation</p>
				<p class="mt-1 text-sm text-muted-foreground">
					Triggers a server action to send a fresh invite email.
				</p>
			</div>
			<Button variant="outline" onclick={runServerAction} disabled={isRunning}>Resend invite</Button>
		</div>

		<div class="mt-4 flex min-h-8 items-center gap-2 text-sm">
			{#if isRunning}
				<Triangle16 size={18} dotSize={2} speed={1.2} />
				<span class="text-muted-foreground">Running server action...</span>
			{:else if hasCompleted}
				<span class="text-muted-foreground">
					Invite sent. The new link was delivered successfully.
				</span>
			{:else}
				<span class="text-muted-foreground">Idle until the user clicks the action.</span>
			{/if}
		</div>
	</div>
</div>
