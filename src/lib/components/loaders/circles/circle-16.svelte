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

	export type Circle16Props = DotMatrixCommonProps;

	const STEP_COUNT = 25;
	const BASE_OPACITY = 0.07;
	const MID_OPACITY = 0.32;
	const HIGH_OPACITY = 0.95;

	let {
		onmouseenter,
		onmouseleave,
		speed = 1,
		pattern = "full",
		animated = true,
		hoverAnimated = false,
		...restProps
	}: Circle16Props = $props();

	const reducedMotionQuery = createReducedMotionQuery();
	const reducedMotion = $derived(reducedMotionQuery.current);
	const phaseController = createDotMatrixPhaseController({
		animated: () => Boolean(animated && !reducedMotion),
		hoverAnimated: () => Boolean(hoverAnimated && !reducedMotion),
		speed: () => speed,
	});

	const cycleProgress = createCycleProgress({
		active: () => !reducedMotion && phaseController.phase !== "idle",
		cycleMsBase: () => 1700,
		speed: () => speed,
	});

	const animationResolver = $derived.by((): DotAnimationResolver => {
		const animProgress = cycleProgress.current;
		const motionDisabled = reducedMotion;

		return ({ isActive, row, col, phase }) => {
			if (!isActive || !isWithinCircularMask(row, col)) {
				return { className: "dmx-inactive" };
			}

			const t =
				motionDisabled || phase === "idle"
					? 0
					: Math.floor(animProgress * STEP_COUNT) % STEP_COUNT;
			const activeRow = t % 5;
			const activeBrailleCol = Math.floor((t / 5) * 2) % 2;
			const railCol = activeBrailleCol === 0 ? 1 : 3;
			const nearCol = 2;
			const rowDistance = Math.abs(row - activeRow);

			let opacity = BASE_OPACITY;

			if (col === railCol && rowDistance === 0) {
				opacity = HIGH_OPACITY;
			} else if (col === railCol && rowDistance === 1) {
				opacity = MID_OPACITY;
			} else if (col === nearCol && rowDistance === 0) {
				opacity = 0.52;
			} else if ((col === 1 || col === 3) && rowDistance === 2) {
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

