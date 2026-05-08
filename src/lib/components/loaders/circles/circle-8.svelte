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

	export type Circle8Props = DotMatrixCommonProps;

	const BASE_OPACITY = 0.08;
	const PULSE_CORE = 0.95;
	const PULSE_RING = 0.44;

	let {
		onmouseenter,
		onmouseleave,
		speed = 1,
		pattern = 'full',
		animated = true,
		hoverAnimated = false,
		...restProps
	}: Circle8Props = $props();

	const reducedMotionQuery = createReducedMotionQuery();
	const reducedMotion = $derived(reducedMotionQuery.current);
	const phaseController = createDotMatrixPhaseController({
		animated: () => Boolean(animated && !reducedMotion),
		hoverAnimated: () => Boolean(hoverAnimated && !reducedMotion),
		speed: () => speed
	});

	const cycleProgress = createCycleProgress({
		active: () => !reducedMotion && phaseController.phase !== 'idle',
		cycleMsBase: () => 1400,
		speed: () => speed
	});

	const animationResolver = $derived.by((): DotAnimationResolver => {
		const pulsePhase = cycleProgress.current;
		const motionDisabled = reducedMotion;

		return ({ isActive, row, col, phase }) => {
			if (!isActive || !isWithinCircularMask(row, col)) {
				return { className: 'dmx-inactive' };
			}

			const x = col - 2;
			const y = row - 2;
			const radius = Math.hypot(x, y);
			const beat = motionDisabled || phase === 'idle' ? 0 : Math.sin(pulsePhase * Math.PI * 2);
			const spike = motionDisabled || phase === 'idle' ? 0 : Math.sin(pulsePhase * Math.PI * 4);
			const pulse = Math.max(0, beat) + Math.max(0, spike) * 0.55;

			if (radius < 0.55) {
				return { style: { opacity: Math.min(1, 0.35 + pulse * PULSE_CORE) } };
			}

			if (radius < 1.65) {
				return { style: { opacity: 0.16 + pulse * PULSE_RING } };
			}

			return { style: { opacity: BASE_OPACITY + pulse * 0.08 } };
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
