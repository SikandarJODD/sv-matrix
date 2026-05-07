<script lang="ts">
	import { onDestroy } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import Square20 from '$lib/components/loaders/square/square-20.svelte';

	const timeouts: number[] = [];

	let company = $state('Northstar Labs');
	let email = $state('pm@northstar.dev');
	let notes = $state('Please enable the new dashboard loader for all async detail views.');
	let isSubmitting = $state(false);
	let isSubmitted = $state(false);

	onDestroy(() => {
		for (const timeout of timeouts) {
			window.clearTimeout(timeout);
		}
	});

	function submitForm() {
		if (isSubmitting) {
			return;
		}

		isSubmitting = true;
		isSubmitted = false;

		const timeout = window.setTimeout(() => {
			isSubmitting = false;
			isSubmitted = true;
		}, 1500);

		timeouts.push(timeout);
	}

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		submitForm();
	}
</script>

<form class="mx-auto mt-10 w-xl space-y-4" onsubmit={handleSubmit}>
	<div class="grid gap-4 md:grid-cols-2">
		<div class="space-y-2">
			<label class="text-sm font-medium" for="company">Company</label>
			<Input id="company" bind:value={company} disabled={isSubmitting} />
		</div>
		<div class="space-y-2">
			<label class="text-sm font-medium" for="email">Contact email</label>
			<Input id="email" bind:value={email} type="email" disabled={isSubmitting} />
		</div>
	</div>
	<div class="space-y-2">
		<label class="text-sm font-medium" for="notes">Request details</label>
		<Textarea id="notes" bind:value={notes} rows={4} disabled={isSubmitting} />
	</div>

	<div class="flex items-center justify-between gap-3">
		<p class="text-sm text-muted-foreground">
			{#if isSubmitted}
				Request submitted. The product team will review it next.
			{:else}
				The loader stays tied to the action instead of blocking the whole form.
			{/if}
		</p>
		<Button type="submit" disabled={isSubmitting}>
			{#if isSubmitting}
				<Square20 size={18} dotSize={2} speed={1.2} />
				Submitting
			{:else}
				Submit request
			{/if}
		</Button>
	</div>
</form>
