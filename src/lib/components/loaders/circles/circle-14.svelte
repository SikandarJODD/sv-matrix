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

	export type Circle14Props = DotMatrixCommonProps;

	const BASE_OPACITY = 0.07;
	const RUNG_OPACITY = 0.95;
	const SIDE_OPACITY = 0.56;
	const GHOST_OPACITY = 0.28;

	let {
		onmouseenter,
		onmouseleave,
		speed = 1,
		pattern = 'full',
		animated = true,
		hoverAnimated = false,
		...restProps
	}: Circle14Props = $props();

	const reducedMotionQuery = createReducedMotionQuery();
	const reducedMotion = $derived(reducedMotionQuery.current);
	const phaseController = createDotMatrixPhaseController({
		animated: () => Boolean(animated && !reducedMotion),
		hoverAnimated: () => Boolean(hoverAnimated && !reducedMotion),
		speed: () => speed
	});

	const cycleProgress = createCycleProgress({
		active: () => !reducedMotion && phaseController.phase !== 'idle',
		cycleMsBase: () => 1650,
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
			const phaseStep = motionDisabled || phase === 'idle' ? 0 : Math.floor(animProgress * 10);
			const activeRow = (phaseStep + 5) % 5;
			const rowDistance = Math.abs(row - activeRow);
			const swing = Math.sin((phaseStep / 10) * Math.PI * 2 + y * 0.9);
			const leftAnchor = Math.round(1 + swing);
			const rightAnchor = 4 - leftAnchor;

			let opacity = BASE_OPACITY;

			if (row === activeRow && col >= leftAnchor && col <= rightAnchor) {
				opacity = RUNG_OPACITY;
			} else if ((col === leftAnchor || col === rightAnchor) && rowDistance <= 1) {
				opacity = SIDE_OPACITY;
			} else if ((col === leftAnchor || col === rightAnchor) && rowDistance === 2) {
				opacity = GHOST_OPACITY;
			}

			if (x === 0 && y === 0 && rowDistance <= 1) {
				return { style: { opacity: Math.max(opacity, SIDE_OPACITY) } };
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
