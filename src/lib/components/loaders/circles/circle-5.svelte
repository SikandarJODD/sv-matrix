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

	export type Circle5Props = DotMatrixCommonProps;

	const BASE_OPACITY = 0.08;
	const BLADE_OPACITY = 0.94;
	const HALO_OPACITY = 0.34;

	let {
		onmouseenter,
		onmouseleave,
		speed = 1,
		pattern = "full",
		animated = true,
		hoverAnimated = false,
		...restProps
	}: Circle5Props = $props();

	const reducedMotionQuery = createReducedMotionQuery();
	const reducedMotion = $derived(reducedMotionQuery.current);
	const phaseController = createDotMatrixPhaseController({
		animated: () => Boolean(animated && !reducedMotion),
		hoverAnimated: () => Boolean(hoverAnimated && !reducedMotion),
		speed: () => speed,
	});

	const cycleProgress = createCycleProgress({
		active: () => !reducedMotion && phaseController.phase !== "idle",
		cycleMsBase: () => 1650,
		speed: () => speed,
	});

	const animationResolver = $derived.by((): DotAnimationResolver => {
		const pinwheelPhase = cycleProgress.current;
		const motionDisabled = reducedMotion;

		return ({ isActive, row, col, phase }) => {
			if (!isActive || !isWithinCircularMask(row, col)) {
				return { className: "dmx-inactive" };
			}

			const x = col - 2;
			const y = row - 2;
			const radius = Math.hypot(x, y);
			const angle = Math.atan2(y, x);
			const theta = (motionDisabled || phase === "idle" ? 0 : pinwheelPhase) * Math.PI * 2;
			const pinwheel = Math.cos(angle * 4 - theta * 2.2);
			const radialGate = Math.sin(radius * 2.1 - theta * 1.25);

			if (radius < 0.6) {
				return { style: { opacity: 0.66 } };
			}

			if (pinwheel > 0.48 && radialGate > -0.25) {
				return { style: { opacity: BLADE_OPACITY } };
			}

			if (pinwheel > 0.1) {
				return { style: { opacity: HALO_OPACITY } };
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

