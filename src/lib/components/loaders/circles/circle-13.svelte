<script lang="ts">
	import CircleMatrixBase from "./circle-base.svelte";
	import { isWithinCircularMask } from "$lib/components/dot-matrix/geometry.js";
	import type {
		DotAnimationResolver,
		DotMatrixCommonProps,
	} from "$lib/components/dot-matrix/types.js";
	import {
		createDotMatrixPhaseController,
		createReducedMotionQuery,
		createSteppedCycle,
	} from "$lib/hooks/dot-matrix/index.js";

	export type Circle13Props = DotMatrixCommonProps;

	const STEP_COUNT = 28;
	const BASE_OPACITY = 0.07;
	const STRAND_OPACITY = 0.95;
	const NEAR_STRAND_OPACITY = 0.5;
	const BRIDGE_OPACITY = 0.3;

	let {
		onmouseenter,
		onmouseleave,
		speed = 1,
		pattern = "full",
		animated = true,
		hoverAnimated = false,
		...restProps
	}: Circle13Props = $props();

	const reducedMotionQuery = createReducedMotionQuery();
	const reducedMotion = $derived(reducedMotionQuery.current);
	const phaseController = createDotMatrixPhaseController({
		animated: () => Boolean(animated && !reducedMotion),
		hoverAnimated: () => Boolean(hoverAnimated && !reducedMotion),
		speed: () => speed,
	});

	const strandStep = createSteppedCycle({
		active: () => !reducedMotion && phaseController.phase !== "idle",
		cycleMsBase: () => 1750,
		steps: () => STEP_COUNT,
		speed: () => speed,
	});

	const animationResolver = $derived.by((): DotAnimationResolver => {
		const currentStep = strandStep.current;
		const motionDisabled = reducedMotion;

		return ({ isActive, row, col, phase }) => {
			if (!isActive || !isWithinCircularMask(row, col)) {
				return { className: "dmx-inactive" };
			}

			const x = col - 2;
			const y = row - 2;
			const t =
				motionDisabled || phase === "idle" ? 0 : (currentStep / STEP_COUNT) * Math.PI * 2;
			const strandOffset = Math.sin(y * 1.35 + t * 1.3) * 1.15;
			const leftStrand = -strandOffset;
			const rightStrand = strandOffset;
			const leftDistance = Math.abs(x - leftStrand);
			const rightDistance = Math.abs(x - rightStrand);
			const strandDistance = Math.min(leftDistance, rightDistance);
			const bridgeOn = Math.cos(y * 2 + t * 2.1) > 0.55;
			const isBetweenStrands =
				x > Math.min(leftStrand, rightStrand) && x < Math.max(leftStrand, rightStrand);

			let opacity = BASE_OPACITY;

			if (strandDistance < 0.34) {
				opacity = STRAND_OPACITY;
			} else if (strandDistance < 0.8) {
				opacity = NEAR_STRAND_OPACITY;
			} else if (bridgeOn && isBetweenStrands) {
				opacity = BRIDGE_OPACITY;
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
