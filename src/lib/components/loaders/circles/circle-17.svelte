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

	export type Circle17Props = DotMatrixCommonProps;

	const BASE_OPACITY = 0.07;
	const MID_OPACITY = 0.34;
	const HIGH_OPACITY = 0.95;
	const CHECKER_STEPS = 4;

	let {
		onmouseenter,
		onmouseleave,
		speed = 1,
		pattern = "full",
		animated = true,
		hoverAnimated = false,
		...restProps
	}: Circle17Props = $props();

	const reducedMotionQuery = createReducedMotionQuery();
	const reducedMotion = $derived(reducedMotionQuery.current);
	const phaseController = createDotMatrixPhaseController({
		animated: () => Boolean(animated && !reducedMotion),
		hoverAnimated: () => Boolean(hoverAnimated && !reducedMotion),
		speed: () => speed,
	});

	const cycleProgress = createCycleProgress({
		active: () => !reducedMotion && phaseController.phase !== "idle",
		cycleMsBase: () => 1500,
		speed: () => speed,
	});

	const animationResolver = $derived.by((): DotAnimationResolver => {
		const animProgress = cycleProgress.current;
		const motionDisabled = reducedMotion;

		return ({ isActive, row, col, phase }) => {
			if (!isActive || !isWithinCircularMask(row, col)) {
				return { className: "dmx-inactive" };
			}

			const holdStill = motionDisabled || phase === "idle";
			const t = holdStill ? 0 : Math.floor(animProgress * CHECKER_STEPS) % CHECKER_STEPS;
			const parity = (row + col + t) % 2;
			const brailleBias = col === 1 || col === 3;
			const centerBias = row === 2 || col === 2;

			let opacity = BASE_OPACITY;

			if (parity === 0 && brailleBias) {
				opacity = HIGH_OPACITY;
			} else if (parity === 0 || centerBias) {
				opacity = MID_OPACITY;
			} else if (brailleBias) {
				opacity = 0.24;
			}

			return { style: { opacity } };
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
