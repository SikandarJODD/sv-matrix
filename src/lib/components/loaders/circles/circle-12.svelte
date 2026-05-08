<script lang="ts">
	import DotMatrixBase from "$lib/components/dot-matrix/dot-matrix-base.svelte";
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

	export type Circle12Props = DotMatrixCommonProps;

	const STEP_COUNT = 36;
	const BASE_OPACITY = 0.06;
	const MID_OPACITY = 0.3;
	const ARC_OPACITY = 0.96;

	let {
		onmouseenter,
		onmouseleave,
		speed = 1,
		pattern = "full",
		animated = true,
		hoverAnimated = false,
		...restProps
	}: Circle12Props = $props();

	const reducedMotionQuery = createReducedMotionQuery();
	const reducedMotion = $derived(reducedMotionQuery.current);
	const phaseController = createDotMatrixPhaseController({
		animated: () => Boolean(animated && !reducedMotion),
		hoverAnimated: () => Boolean(hoverAnimated && !reducedMotion),
		speed: () => speed,
	});

	const arcStep = createSteppedCycle({
		active: () => !reducedMotion && phaseController.phase !== "idle",
		cycleMsBase: () => 1700,
		steps: () => STEP_COUNT,
		speed: () => speed,
	});

	const animationResolver = $derived.by((): DotAnimationResolver => {
		const currentStep = arcStep.current;
		const motionDisabled = reducedMotion;

		return ({ isActive, row, col, phase }) => {
			if (!isActive || !isWithinCircularMask(row, col)) {
				return { className: "dmx-inactive" };
			}

			const x = col - 2;
			const y = row - 2;
			const ring = Math.sqrt(x * x + y * y);
			const angle = Math.atan2(y, x);
			const stepIndex = motionDisabled || phase === "idle" ? 0 : currentStep;
			const stepBand = Math.floor((stepIndex / STEP_COUNT) * 8) % 8;
			const targetAngle = stepBand * (Math.PI / 4);
			const angleDelta = Math.acos(Math.cos(angle - targetAngle));
			const beam = Math.max(0, 1 - angleDelta / 0.42);
			const oppositeBeam = Math.max(
				0,
				1 - Math.acos(Math.cos(angle - (targetAngle + Math.PI))) / 0.62
			);
			const spokePulse = Math.max(0, 1 - Math.abs(Math.abs(x) - Math.abs(y)) / 0.35);
			const ringTier = ring < 1 ? 0 : ring < 2 ? 1 : 2;

			let opacity = BASE_OPACITY;

			if (beam > 0.78 && ringTier >= 1) {
				opacity = ARC_OPACITY;
			} else if (beam > 0.48) {
				opacity = 0.62;
			} else if (oppositeBeam > 0.52 && ringTier === 2) {
				opacity = MID_OPACITY;
			} else if (spokePulse > 0.9 && ringTier > 0) {
				opacity = MID_OPACITY;
			}

			if (x === 0 && y === 0) {
				return { style: { opacity: Math.max(opacity, 0.26) } };
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
