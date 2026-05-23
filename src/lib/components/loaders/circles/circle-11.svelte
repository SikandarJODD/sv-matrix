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

	export type Circle11Props = DotMatrixCommonProps;

	const BASE_OPACITY = 0.07;
	const MID_OPACITY = 0.3;
	const HIGH_OPACITY = 0.95;

	let {
		onmouseenter,
		onmouseleave,
		speed = 1,
		pattern = "full",
		animated = true,
		hoverAnimated = false,
		...restProps
	}: Circle11Props = $props();

	const reducedMotionQuery = createReducedMotionQuery();
	const reducedMotion = $derived(reducedMotionQuery.current);
	const phaseController = createDotMatrixPhaseController({
		animated: () => Boolean(animated && !reducedMotion),
		hoverAnimated: () => Boolean(hoverAnimated && !reducedMotion),
		speed: () => speed,
	});

	const cycleProgress = createCycleProgress({
		active: () => !reducedMotion && phaseController.phase !== "idle",
		cycleMsBase: () => 1850,
		speed: () => speed,
	});

	const animationResolver = $derived.by((): DotAnimationResolver => {
		const lunarPhase = cycleProgress.current;
		const motionDisabled = reducedMotion;

		return ({ isActive, row, col, phase }) => {
			if (!isActive || !isWithinCircularMask(row, col)) {
				return { className: "dmx-inactive" };
			}

			const x = col - 2;
			const y = row - 2;
			const ring = Math.sqrt(x * x + y * y);
			const t = motionDisabled || phase === "idle" ? 0 : lunarPhase * Math.PI * 2;
			const angle = Math.atan2(y, x);
			const moonCenterX = Math.cos(t) * 0.7;
			const moonCenterY = Math.sin(t) * 0.7;
			const body = Math.hypot(x - moonCenterX, y - moonCenterY);
			const cutCenterX = moonCenterX + Math.cos(t) * 0.82;
			const cutCenterY = moonCenterY + Math.sin(t) * 0.82;
			const cut = Math.hypot(x - cutCenterX, y - cutCenterY);
			const rim = Math.max(0, 1 - Math.abs(body - 1.55) / 0.35);
			const halo = Math.max(0, 1 - Math.acos(Math.cos(angle - t)) / 0.9);

			let opacity = BASE_OPACITY;

			if (body < 1.55 && cut > 1.05) {
				opacity = HIGH_OPACITY;
			} else if (rim > 0.5) {
				opacity = MID_OPACITY + rim * 0.22;
			} else if (halo > 0.68 && ring > 1.2) {
				opacity = MID_OPACITY;
			}

			return { style: { opacity: Math.min(HIGH_OPACITY, opacity) } };
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
