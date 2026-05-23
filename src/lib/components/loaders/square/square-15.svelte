<script lang="ts">
	import DotMatrixBase from "$lib/components/dot-matrix/dot-matrix-base.svelte";
	import type {
		DotAnimationResolver,
		DotMatrixCommonProps,
	} from "$lib/components/dot-matrix/types.js";
	import {
		createCycleProgress,
		createDotMatrixPhaseController,
		createReducedMotionQuery,
	} from "$lib/hooks/dot-matrix/index.js";

	export type Square15Props = DotMatrixCommonProps;

	const BASE_OPACITY = 0.08;
	const STRAND_OPACITY = 1;
	const BRIDGE_OPACITY = 0.58;
	const NEAR_STRAND_OPACITY = 0.24;
	const STRAND_LOOPS = 2;

	let {
		onmouseenter,
		onmouseleave,
		speed = 1.25,
		pattern = "full",
		animated = true,
		hoverAnimated = false,
		size = 29,
		dotSize = 5,
		...restProps
	}: Square15Props = $props();

	const reducedMotionQuery = createReducedMotionQuery();
	const reducedMotion = $derived(reducedMotionQuery.current);
	const phaseController = createDotMatrixPhaseController({
		animated: () => Boolean(animated && !reducedMotion),
		hoverAnimated: () => Boolean(hoverAnimated && !reducedMotion),
		speed: () => speed,
	});

	const cycleProgress = createCycleProgress({
		active: () => !reducedMotion && phaseController.phase !== "idle",
		cycleMsBase: () => 1600,
		speed: () => speed,
	});

	const animationResolver = $derived.by((): DotAnimationResolver => {
		const animPhase = cycleProgress.current;
		const motionDisabled = reducedMotion;

		return ({ isActive, row, col, phase }) => {
			if (!isActive) {
				return { className: "dmx-inactive" };
			}

			const progress = motionDisabled || phase === "idle" ? 0 : animPhase;
			const rowPhase = progress * STRAND_LOOPS * 2 * Math.PI + row * 1.24;
			const left = Math.round(1 + Math.sin(rowPhase));
			const right = 4 - left;
			const bridgeOn = Math.cos(rowPhase * 2) > 0.82;

			if (col === left || col === right) {
				return { style: { opacity: STRAND_OPACITY } };
			}

			if (bridgeOn && col > left && col < right) {
				return { style: { opacity: BRIDGE_OPACITY } };
			}

			if (Math.abs(col - left) === 1 || Math.abs(col - right) === 1) {
				return { style: { opacity: NEAR_STRAND_OPACITY } };
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
