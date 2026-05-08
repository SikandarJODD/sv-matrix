<script lang="ts">
	import CircleMatrixBase from "./circle-base.svelte";
	import { isWithinCircularMask } from "$lib/components/dot-matrix/geometry.js";
	import type {
		DotAnimationResolver,
		DotMatrixCommonProps,
	} from "$lib/components/dot-matrix/types.js";
	import {
		createCycleProgress,
		createDotMatrixPhaseController,
		createReducedMotionQuery,
	} from "$lib/hooks/dot-matrix/index.js";

	export type Circle4Props = DotMatrixCommonProps;

	const BASE_OPACITY = 0.08;
	const SWEEP_OPACITY = 0.96;
	const NEAR_SWEEP_OPACITY = 0.36;
	const RING_OPACITY = 0.22;

	let {
		onmouseenter,
		onmouseleave,
		speed = 1,
		pattern = "full",
		animated = true,
		hoverAnimated = false,
		...restProps
	}: Circle4Props = $props();

	const reducedMotionQuery = createReducedMotionQuery();
	const reducedMotion = $derived(reducedMotionQuery.current);
	const phaseController = createDotMatrixPhaseController({
		animated: () => Boolean(animated && !reducedMotion),
		hoverAnimated: () => Boolean(hoverAnimated && !reducedMotion),
		speed: () => speed,
	});

	const cycleProgress = createCycleProgress({
		active: () => !reducedMotion && phaseController.phase !== "idle",
		cycleMsBase: () => 1800,
		speed: () => speed,
	});

	const animationResolver = $derived.by((): DotAnimationResolver => {
		const sweepPhase = cycleProgress.current;
		const motionDisabled = reducedMotion;

		return ({ isActive, row, col, phase }) => {
			if (!isActive || !isWithinCircularMask(row, col)) {
				return { className: "dmx-inactive" };
			}

			const centerRow = row - 2;
			const centerCol = col - 2;
			const radius = Math.hypot(centerRow, centerCol);
			const theta = (motionDisabled || phase === "idle" ? 0 : sweepPhase) * Math.PI * 2;
			const sweepX = Math.cos(theta);
			const sweepY = Math.sin(theta);
			const projection = centerCol * sweepX + centerRow * sweepY;
			const perpendicular = Math.abs(centerCol * sweepY - centerRow * sweepX);

			if (radius < 0.5) {
				return { style: { opacity: 0.62 } };
			}

			if (projection > 0.3 && perpendicular < 0.55) {
				return { style: { opacity: SWEEP_OPACITY } };
			}

			if (projection > 0 && perpendicular < 1.15) {
				return { style: { opacity: NEAR_SWEEP_OPACITY } };
			}

			if (radius > 1.6 && radius < 2.3) {
				return { style: { opacity: RING_OPACITY } };
			}

			return { style: { opacity: BASE_OPACITY } };
		};
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

<CircleMatrixBase
	{speed}
	{pattern}
	{animated}
	{hoverAnimated}
	phase={phaseController.phase}
	{reducedMotion}
	{animationResolver}
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
	{...restProps}
/>

