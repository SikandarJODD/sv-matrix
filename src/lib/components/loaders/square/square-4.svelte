<script lang="ts">
	import DotMatrixBase from "$lib/components/dot-matrix/dot-matrix-base.svelte";
	import {
		middleRingAntiClockwiseNormFromIndex,
		middleRingAntiClockwiseOrderValue,
		outerRingClockwiseNormFromIndex,
		outerRingClockwiseOrderValue,
	} from "$lib/components/dot-matrix/geometry.js";
	import type {
		DotAnimationResolver,
		DotMatrixCommonProps,
	} from "$lib/components/dot-matrix/types.js";
	import {
		createDotMatrixPhaseController,
		createReducedMotionQuery,
	} from "$lib/hooks/dot-matrix/index.js";

	export type SquareFourProps = DotMatrixCommonProps;

	// Porting pattern:
	// keep the wrapper logic identical, and swap only the ring-specific resolver math.
	const animationResolver: DotAnimationResolver = ({
		isActive,
		index,
		row,
		col,
		reducedMotion,
		phase,
	}) => {
		if (!isActive) {
			return { className: "dmx-inactive" };
		}

		const isCenter = row === 2 && col === 2;
		if (isCenter) {
			return { className: "dmx-inactive" };
		}

		const outerOrder = outerRingClockwiseOrderValue(index);
		if (outerOrder >= 0) {
			const outerNorm = outerRingClockwiseNormFromIndex(index);
			const style = {
				"--dmx-outer-order": outerOrder,
			};

			if (reducedMotion || phase === "idle") {
				return {
					style: {
						...style,
						opacity: 0.2 + outerNorm * 0.72,
					},
				};
			}

			return { className: "dmx-outer-snake", style };
		}

		const middleOrder = middleRingAntiClockwiseOrderValue(index);
		const middleNorm = middleRingAntiClockwiseNormFromIndex(index);
		const style = {
			"--dmx-middle-order": middleOrder,
		};

		if (reducedMotion || phase === "idle") {
			return {
				style: {
					...style,
					opacity: 0.2 + middleNorm * 0.72,
				},
			};
		}

		return { className: "dmx-middle-snake", style };
	};

	let {
		onmouseenter,
		onmouseleave,
		speed = 1,
		pattern = "full",
		animated = true,
		hoverAnimated = false,
		size = 29,
		dotSize = 5,
		...restProps
	}: SquareFourProps = $props();

	const reducedMotionQuery = createReducedMotionQuery();
	const reducedMotion = $derived(reducedMotionQuery.current);
	const phaseController = createDotMatrixPhaseController({
		animated: () => Boolean(animated && !reducedMotion),
		hoverAnimated: () => Boolean(hoverAnimated && !reducedMotion),
		speed: () => speed,
	});

	function handleMouseEnter(event: MouseEvent & { currentTarget: EventTarget & HTMLDivElement }) {
		phaseController.onMouseEnter();
		onmouseenter?.(event);
	}

	function handleMouseLeave(event: MouseEvent & { currentTarget: EventTarget & HTMLDivElement }) {
		phaseController.onMouseLeave();
		onmouseleave?.(event);
	}
</script>

<DotMatrixBase
	{speed}
	{pattern}
	{animated}
	{hoverAnimated}
	{size}
	{dotSize}
	phase={phaseController.phase}
	{reducedMotion}
	{animationResolver}
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
	{...restProps}
/>
