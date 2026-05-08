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

	export type Circle18Props = DotMatrixCommonProps;

	const BASE_OPACITY = 0.07;
	const MID_OPACITY = 0.33;
	const HIGH_OPACITY = 0.95;

	let {
		onmouseenter,
		onmouseleave,
		speed = 1,
		pattern = 'full',
		animated = true,
		hoverAnimated = false,
		...restProps
	}: Circle18Props = $props();

	const reducedMotionQuery = createReducedMotionQuery();
	const reducedMotion = $derived(reducedMotionQuery.current);
	const phaseController = createDotMatrixPhaseController({
		animated: () => Boolean(animated && !reducedMotion),
		hoverAnimated: () => Boolean(hoverAnimated && !reducedMotion),
		speed: () => speed
	});

	const cycleProgress = createCycleProgress({
		active: () => !reducedMotion && phaseController.phase !== 'idle',
		cycleMsBase: () => 1550,
		speed: () => speed
	});

	const animationResolver = $derived.by((): DotAnimationResolver => {
		const animProgress = cycleProgress.current;
		const motionDisabled = reducedMotion;

		return ({ isActive, row, col, phase }) => {
			if (!isActive || !isWithinCircularMask(row, col)) {
				return { className: 'dmx-inactive' };
			}

			const t = motionDisabled || phase === 'idle' ? 0 : Math.floor(animProgress * 6);
			const pulseRow = t % 3;
			const topRow = pulseRow;
			const bottomRow = 4 - pulseRow;
			const isPairCol = col === 1 || col === 3;

			let opacity = BASE_OPACITY;

			if ((row === topRow || row === bottomRow) && isPairCol) {
				opacity = HIGH_OPACITY;
			} else if ((row === topRow || row === bottomRow) && col === 2) {
				opacity = 0.58;
			} else if ((row === 2 || col === 2) && !isPairCol) {
				opacity = MID_OPACITY;
			} else if (isPairCol) {
				opacity = 0.22;
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
