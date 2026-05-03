<script lang="ts">
	import SquareBloomGlow from '$lib/components/loaders/square/square-bloom-glow.svelte';
	import SquareFixGapBoxSlot from '$lib/components/loaders/square/square-fix-gap-box-slot.svelte';
	import SquareOne from '$lib/components/loaders/square/square-one.svelte';
	import SquareOpacitySpeed from '$lib/components/loaders/square/square-opacity-speed.svelte';
	import SquarePatternLook from '$lib/components/loaders/square/square-pattern-look.svelte';
</script>

<div class="flex h-[90vh] items-center justify-center">
	<div class="flex flex-col items-center gap-4">
		<!-- <SquareOne aria-label="Square one loader" boxSize={72} /> -->
		<!-- <SquareBloomGlow /> -->
		<!-- <SquareOpacitySpeed /> -->
		<SquareFixGapBoxSlot />
		<!-- <SquarePatternLook /> -->
		<!-- <p class="text-sm text-muted-foreground">Dot Matrix Square One</p> -->
	</div>
</div>
