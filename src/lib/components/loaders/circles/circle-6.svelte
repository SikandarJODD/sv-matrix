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

	export type Circle6Props = DotMatrixCommonProps;

	const BASE_OPACITY = 0.08;
	const ORBIT_OPACITY = 0.96;
	const NEAR_ORBIT_OPACITY = 0.34;

	let {
		onmouseenter,
		onmouseleave,
		speed = 1,
		pattern = "full",
		animated = true,
		hoverAnimated = false,
		...restProps
	}: Circle6Props = $props();

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
		const orbitPhase = cycleProgress.current;
		const motionDisabled = reducedMotion;

		return ({ isActive, row, col, phase }) => {
			if (!isActive || !isWithinCircularMask(row, col)) {
				return { className: "dmx-inactive" };
			}

			const x = col - 2;
			const y = row - 2;
			const t = motionDisabled || phase === "idle" ? 0 : orbitPhase * Math.PI * 2;
			const angle = Math.atan2(y, x);
			const ring = Math.sqrt(x * x + y * y);
			const angularPhase =
				((angle - t * 0.95 + Math.PI * 4) % (Math.PI * 2)) / ((Math.PI * 2) / 3);
			const sectorPos = angularPhase - Math.floor(angularPhase);
			const sectorPulse = Math.max(0, 1 - Math.abs(sectorPos - 0.5) * 2);
			const ringPhase = 0.5 + 0.5 * Math.cos(ring * 3.2 + t * 1.7);
			const score = 0.74 * sectorPulse + 0.26 * ringPhase;

			let opacity = BASE_OPACITY;

			if (score > 0.84) {
				opacity = ORBIT_OPACITY;
			} else if (score > 0.63) {
				opacity = 0.62;
			} else if (score > 0.44) {
				opacity = NEAR_ORBIT_OPACITY;
			}

			if (x === 0 && y === 0) {
				return { style: { opacity: Math.max(opacity, NEAR_ORBIT_OPACITY) } };
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

