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

	export type Circle10Props = DotMatrixCommonProps;

	const TICK_MOD = 10;
	const BASE_OPACITY = 0.06;
	const LOW_OPACITY = 0.2;
	const MID_OPACITY = 0.48;
	const HIGH_OPACITY = 0.94;

	function moduloDistance(a: number, b: number, mod: number): number {
		const raw = Math.abs(a - b);
		return Math.min(raw, mod - raw);
	}

	let {
		onmouseenter,
		onmouseleave,
		speed = 1,
		pattern = 'full',
		animated = true,
		hoverAnimated = false,
		...restProps
	}: Circle10Props = $props();

	const reducedMotionQuery = createReducedMotionQuery();
	const reducedMotion = $derived(reducedMotionQuery.current);
	const phaseController = createDotMatrixPhaseController({
		animated: () => Boolean(animated && !reducedMotion),
		hoverAnimated: () => Boolean(hoverAnimated && !reducedMotion),
		speed: () => speed
	});

	const cycleProgress = createCycleProgress({
		active: () => !reducedMotion && phaseController.phase !== 'idle',
		cycleMsBase: () => 1600,
		speed: () => speed
	});

	const animationResolver = $derived.by((): DotAnimationResolver => {
		const animProgress = cycleProgress.current;
		const motionDisabled = reducedMotion;

		return ({ isActive, row, col, phase }) => {
			if (!isActive || !isWithinCircularMask(row, col)) {
				return { className: 'dmx-inactive' };
			}

			const x = col - 2;
			const y = row - 2;
			const ring = Math.round(Math.sqrt(x * x + y * y));
			const tick =
				motionDisabled || phase === 'idle' ? 0 : Math.floor(animProgress * TICK_MOD) % TICK_MOD;
			const cellCode = (row * 3 + col * 5 + ring * 2) % TICK_MOD;
			const distance = moduloDistance(cellCode, tick, TICK_MOD);
			const parityGate = (row + col + tick) % 2 === 0;

			let opacity = BASE_OPACITY;

			if (distance === 0) {
				opacity = HIGH_OPACITY;
			} else if (distance === 1) {
				opacity = MID_OPACITY;
			} else if (distance === 2 || parityGate) {
				opacity = LOW_OPACITY;
			}

			if (x === 0 && y === 0) {
				return { style: { opacity: Math.max(opacity, MID_OPACITY) } };
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
