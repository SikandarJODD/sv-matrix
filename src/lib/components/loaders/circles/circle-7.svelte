<script lang="ts">
	import DotMatrixBase from "$lib/components/dot-matrix/dot-matrix-base.svelte";
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

	export type Circle7Props = DotMatrixCommonProps;

	const BASE_OPACITY = 0.08;
	const GATE_OPACITY = 0.92;

	let {
		onmouseenter,
		onmouseleave,
		speed = 1,
		pattern = "full",
		animated = true,
		hoverAnimated = false,
		...restProps
	}: Circle7Props = $props();

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
		const bloomPhase = cycleProgress.current;
		const motionDisabled = reducedMotion;

		return ({ isActive, row, col, phase }) => {
			if (!isActive || !isWithinCircularMask(row, col)) {
				return { className: "dmx-inactive" };
			}

			const x = col - 2;
			const y = row - 2;
			const t = motionDisabled || phase === "idle" ? 0 : bloomPhase * Math.PI * 2;
			const ring = Math.sqrt(x * x + y * y);
			const angle = Math.atan2(y, x);
			const petalWave = 0.5 + 0.5 * Math.cos(5 * angle - t * 1.7);
			const ringWave = 0.5 + 0.5 * Math.cos(ring * 3.3 - t * 1.2);
			const chordWave = 0.5 + 0.5 * Math.cos((x + y) * 1.6 + t * 1.35);
			const petalGate = Math.pow(petalWave, 2.2);
			const blend = 0.68 * petalGate + 0.22 * ringWave + 0.1 * chordWave;
			const opacity = BASE_OPACITY + (GATE_OPACITY - BASE_OPACITY) * blend;

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

<DotMatrixBase
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
