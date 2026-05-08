<script lang="ts">
	import { onDestroy } from "svelte";
	import { Input } from "$lib/components/ui/input";
	import Square15 from "$lib/components/loaders/square/square-15.svelte";

	type UploadState = "idle" | "uploading" | "complete";

	const timeouts: number[] = [];

	let fileName = $state("");
	let uploadState = $state<UploadState>("idle");

	onDestroy(() => {
		for (const timeout of timeouts) {
			window.clearTimeout(timeout);
		}
	});

	function handleFileChange(event: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		const selectedFile = event.currentTarget.files?.[0];

		if (!selectedFile) {
			return;
		}

		fileName = selectedFile.name;
		uploadState = "uploading";

		const timeout = window.setTimeout(() => {
			uploadState = "complete";
		}, 1800);

		timeouts.push(timeout);
	}
</script>

<div class="mx-auto w-xl space-y-4">
	<div class="space-y-2">
		<label class="text-sm font-medium" for="upload">Upload asset</label>
		<Input
			id="upload"
			type="file"
			accept=".zip,.png,.csv"
			disabled={uploadState === "uploading"}
			onchange={handleFileChange}
		/>
	</div>

	<div class="rounded-xl border border-border p-4">
		{#if uploadState === "idle"}
			<p class="text-sm text-muted-foreground">
				Select a file to simulate an upload and show the loader at row level.
			</p>
		{:else}
			<div class="flex items-center justify-between gap-3">
				<div>
					<p class="font-medium">{fileName}</p>
					<p class="mt-1 text-sm text-muted-foreground">
						{#if uploadState === "uploading"}
							Pushing bytes to storage...
						{:else}
							Upload complete. Ready for processing.
						{/if}
					</p>
				</div>

				{#if uploadState === "uploading"}
					<div class="flex items-center gap-2">
						<Square15 size={20} dotSize={3} speed={1.15} />
						<span class="text-sm text-muted-foreground">Uploading</span>
					</div>
				{:else}
					<span class="text-sm text-muted-foreground">Uploaded</span>
				{/if}
			</div>
		{/if}
	</div>
</div>
