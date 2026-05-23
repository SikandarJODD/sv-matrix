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

	export type Circle9Props = DotMatrixCommonProps;

	const STEP_COUNT = 36;
	const BASE_OPACITY = 0.07;
	const MID_OPACITY = 0.28;
	const STAR_OPACITY = 0.96;
	const CARDINAL_CENTERS = [0, Math.PI / 2, Math.PI, -Math.PI / 2] as const;

	let {
		onmouseenter,
		onmouseleave,
		speed = 1,
		pattern = "full",
		animated = true,
		hoverAnimated = false,
		...restProps
	}: Circle9Props = $props();

	const reducedMotionQuery = createReducedMotionQuery();
	const reducedMotion = $derived(reducedMotionQuery.current);
	const phaseController = createDotMatrixPhaseController({
		animated: () => Boolean(animated && !reducedMotion),
		hoverAnimated: () => Boolean(hoverAnimated && !reducedMotion),
		speed: () => speed,
	});

	const beaconStep = createSteppedCycle({
		active: () => !reducedMotion && phaseController.phase !== "idle",
		cycleMsBase: () => 1900,
		steps: () => STEP_COUNT,
		speed: () => speed,
	});

	const animationResolver = $derived.by((): DotAnimationResolver => {
		const currentStep = beaconStep.current;
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
			const beaconIndex =
				Math.floor((stepIndex / STEP_COUNT) * CARDINAL_CENTERS.length) %
				CARDINAL_CENTERS.length;
			const activeCenter = CARDINAL_CENTERS[beaconIndex] ?? 0;
			const oppositeCenter =
				CARDINAL_CENTERS[(beaconIndex + 2) % CARDINAL_CENTERS.length] ?? Math.PI;
			const distanceToActive = Math.acos(Math.cos(angle - activeCenter));
			const distanceToOpposite = Math.acos(Math.cos(angle - oppositeCenter));
			const activeBeam = Math.max(0, 1 - distanceToActive / 0.5);
			const oppositeBeam = Math.max(0, 1 - distanceToOpposite / 0.65);
			const ringTier = Math.round(ring);

			let opacity = BASE_OPACITY;

			if (activeBeam > 0.8 && ringTier >= 2) {
				opacity = STAR_OPACITY;
			} else if (activeBeam > 0.45 && ringTier >= 1) {
				opacity = 0.62;
			} else if (oppositeBeam > 0.5 && ringTier >= 1) {
				opacity = MID_OPACITY;
			}

			if (x === 0 && y === 0) {
				return { style: { opacity: Math.max(opacity, 0.24) } };
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
