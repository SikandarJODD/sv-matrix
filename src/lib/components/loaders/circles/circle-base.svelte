<script lang="ts">
	import DotMatrixBase from "$lib/components/dot-matrix/dot-matrix-base.svelte";
	import type {
		DotAnimationResolver,
		DotMatrixCommonProps,
		DotMatrixPhase,
	} from "$lib/components/dot-matrix/types.js";

	interface CircleMatrixBaseProps extends DotMatrixCommonProps {
		phase?: DotMatrixPhase;
		reducedMotion?: boolean;
		animationResolver?: DotAnimationResolver;
		activeIndexes?: Iterable<number>;
		gridSize?: number;
	}

	let { size = 33, dotSize = 5, ...restProps }: CircleMatrixBaseProps = $props();
</script>

<DotMatrixBase {size} {dotSize} {...restProps} />

