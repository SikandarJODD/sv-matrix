<script lang="ts">
	import SquareTwo from '$lib/components/loaders/square/square-two.svelte';
</script>

<div class="flex h-[90vh] items-center justify-center">
	<div class="flex flex-col items-center gap-4">
		<SquareTwo aria-label="Square two loader" boxSize={72} />
	</div>
</div>
