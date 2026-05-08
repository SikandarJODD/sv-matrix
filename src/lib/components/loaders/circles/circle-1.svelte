<script lang="ts">
	import DotMatrixBase from '$lib/components/dot-matrix/dot-matrix-base.svelte';
	import { isWithinCircularMask } from '$lib/components/dot-matrix/geometry.js';
	import type {
		DotAnimationResolver,
		DotMatrixCommonProps
	} from '$lib/components/dot-matrix/types.js';
	import {
		createCycleProgress,
		createDotMatrixPhaseController,
		createReducedMotionQuery
	} from '$lib/hooks/dot-matrix/index.js';

	export type Circle1Props = DotMatrixCommonProps;

	const BASE_OPACITY = 0.08;
	const STRAND_OPACITY = 1;
	const NEAR_STRAND_OPACITY = 0.24;
	const STEP_COUNT = 20;
	const HELIX_LOOP_RADIANS = (Math.PI * 2) / (STEP_COUNT - 1);

	let {
		onmouseenter,
		onmouseleave,
		speed = 1,
		pattern = 'full',
		animated = true,
		hoverAnimated = false,
		...restProps
	}: Circle1Props = $props();

	const reducedMotionQuery = createReducedMotionQuery();
	const reducedMotion = $derived(reducedMotionQuery.current);
	const phaseController = createDotMatrixPhaseController({
		animated: () => Boolean(animated && !reducedMotion),
		hoverAnimated: () => Boolean(hoverAnimated && !reducedMotion),
		speed: () => speed
	});

	const cycleProgress = createCycleProgress({
		active: () => !reducedMotion && phaseController.phase !== 'idle',
		cycleMsBase: () => 1700,
		speed: () => speed
	});

	const animationResolver = $derived.by((): DotAnimationResolver => {
		const animPhase = cycleProgress.current;
		const motionDisabled = reducedMotion;

		return ({ isActive, row, col, phase }) => {
			if (!isActive || !isWithinCircularMask(row, col)) {
				return { className: 'dmx-inactive' };
			}

			const t = motionDisabled || phase === 'idle' ? 0 : animPhase * STEP_COUNT;
			const diagonalAxis = row + col;
			const phaseOffset = t * HELIX_LOOP_RADIANS + diagonalAxis * 0.82;
			const strandPerpendicular = Math.round(2 * Math.sin(phaseOffset));
			const cellPerpendicular = col - row;
			const distanceFromStrand = Math.abs(cellPerpendicular - strandPerpendicular);

			if (distanceFromStrand === 0) {
				return { style: { opacity: STRAND_OPACITY } };
			}

			if (distanceFromStrand === 1) {
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
	phase={phaseController.phase}
	{reducedMotion}
	{animationResolver}
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
	{...restProps}
/>
