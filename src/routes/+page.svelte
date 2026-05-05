<script lang="ts">
	import SquareTwo from '$lib/components/loaders/square/square-2.svelte';
</script>

<div class="flex h-[90vh] items-center justify-center">
	<div class="flex flex-col items-center gap-4">
		<!-- <SquareTwo  /> -->
		<SquareTwo dotSize={4} cellPadding={1} boxSize={50} />
	</div>
</div>
