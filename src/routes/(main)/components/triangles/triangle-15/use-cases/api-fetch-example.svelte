<script lang="ts">
	import { onDestroy } from "svelte";
	import { Button } from "$lib/components/ui/button";
	import Triangle15 from "$lib/components/loaders/triangle/triangle-15.svelte";

	type Metrics = {
		latency: string;
		successRate: string;
		queueDepth: string;
		updatedAt: string;
	};

	const timeouts: number[] = [];

	let isLoading = $state(false);
	let metrics = $state<Metrics>({
		latency: "182 ms",
		successRate: "99.91%",
		queueDepth: "14 jobs",
		updatedAt: "1 minute ago",
	});

	onDestroy(() => {
		for (const timeout of timeouts) {
			window.clearTimeout(timeout);
		}
	});

	function refreshMetrics() {
		if (isLoading) {
			return;
		}

		isLoading = true;

		const timeout = window.setTimeout(() => {
			metrics = {
				latency: "146 ms",
				successRate: "99.97%",
				queueDepth: "6 jobs",
				updatedAt: "just now",
			};
			isLoading = false;
		}, 1500);

		timeouts.push(timeout);
	}
</script>

<div class="mx-auto mt-10 h-full w-xl">
	<div class="rounded-xl border border-border bg-muted/30 p-3">
		<div class="mb-2 flex items-center justify-between gap-2">
			<p class="font-medium">Gateway health</p>
			<div class="flex items-center gap-2">
				<Button variant="outline" onclick={refreshMetrics} disabled={isLoading}
					>Refresh</Button
				>
			</div>
		</div>

		{#if isLoading}
			<div class="flex min-h-32 flex-col items-center justify-center gap-3 text-center">
				<Triangle15 />
				<p class="text-sm text-muted-foreground">Fetching the latest response metrics...</p>
			</div>
		{:else}
			<div class="grid gap-3 sm:grid-cols-3">
				<div class="rounded-lg border bg-background p-3">
					<p class="text-xs text-muted-foreground">Latency</p>
					<p class="mt-2 text-lg font-semibold">{metrics.latency}</p>
				</div>
				<div class="rounded-lg border bg-background p-3">
					<p class="text-xs text-muted-foreground">Success rate</p>
					<p class="mt-2 text-lg font-semibold">{metrics.successRate}</p>
				</div>
				<div class="rounded-lg border bg-background p-3">
					<p class="text-xs text-muted-foreground">Queue depth</p>
					<p class="mt-2 text-lg font-semibold">{metrics.queueDepth}</p>
				</div>
			</div>
		{/if}
	</div>
</div>
