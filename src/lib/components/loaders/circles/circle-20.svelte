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

	export type Circle20Props = DotMatrixCommonProps;

	const BASE_OPACITY = 0.07;
	const MID_OPACITY = 0.34;
	const HIGH_OPACITY = 0.95;

	const GLYPHS: ReadonlyArray<ReadonlySet<string>> = [
		new Set(['1,1', '2,1', '3,1', '1,3', '2,3', '3,3']),
		new Set(['1,1', '2,1', '3,1', '2,2', '1,3', '3,3']),
		new Set(['1,1', '1,2', '1,3', '3,1', '3,2', '3,3']),
		new Set(['1,1', '2,1', '3,1', '1,3', '2,2', '3,3']),
		new Set(['1,1', '2,2', '3,3', '1,3', '3,1']),
		new Set(['2,1', '1,2', '2,2', '3,2', '2,3'])
	];

	let {
		onmouseenter,
		onmouseleave,
		speed = 1,
		pattern = 'full',
		animated = true,
		hoverAnimated = false,
		...restProps
	}: Circle20Props = $props();

	const reducedMotionQuery = createReducedMotionQuery();
	const reducedMotion = $derived(reducedMotionQuery.current);
	const phaseController = createDotMatrixPhaseController({
		animated: () => Boolean(animated && !reducedMotion),
		hoverAnimated: () => Boolean(hoverAnimated && !reducedMotion),
		speed: () => speed
	});

	const cycleProgress = createCycleProgress({
		active: () => !reducedMotion && phaseController.phase !== 'idle',
		cycleMsBase: () => 1500,
		speed: () => speed
	});

	const animationResolver = $derived.by((): DotAnimationResolver => {
		const animProgress = cycleProgress.current;
		const motionDisabled = reducedMotion;

		return ({ isActive, row, col, phase }) => {
			if (!isActive || !isWithinCircularMask(row, col)) {
				return { className: 'dmx-inactive' };
			}

			const t =
				motionDisabled || phase === 'idle' ? 0 : Math.floor(animProgress * GLYPHS.length) % GLYPHS.length;
			const active = GLYPHS[t];
			const previous = GLYPHS[(t + GLYPHS.length - 1) % GLYPHS.length];
			const key = `${row},${col}`;

			let opacity = BASE_OPACITY;

			if (active?.has(key)) {
				opacity = HIGH_OPACITY;
			} else if (previous?.has(key)) {
				opacity = MID_OPACITY;
			} else if (row === 2 && col === 2) {
				opacity = 0.2;
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
