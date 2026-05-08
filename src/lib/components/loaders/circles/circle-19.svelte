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

	export type Circle19Props = DotMatrixCommonProps;

	const BASE_OPACITY = 0.07;
	const MID_OPACITY = 0.34;
	const HIGH_OPACITY = 0.95;

	const ORBIT_POINTS: ReadonlyArray<readonly [number, number]> = [
		[1, 1],
		[1, 2],
		[1, 3],
		[2, 3],
		[3, 3],
		[3, 2],
		[3, 1],
		[2, 1]
	];

	let {
		onmouseenter,
		onmouseleave,
		speed = 1,
		pattern = 'full',
		animated = true,
		hoverAnimated = false,
		...restProps
	}: Circle19Props = $props();

	const reducedMotionQuery = createReducedMotionQuery();
	const reducedMotion = $derived(reducedMotionQuery.current);
	const phaseController = createDotMatrixPhaseController({
		animated: () => Boolean(animated && !reducedMotion),
		hoverAnimated: () => Boolean(hoverAnimated && !reducedMotion),
		speed: () => speed
	});

	const cycleProgress = createCycleProgress({
		active: () => !reducedMotion && phaseController.phase !== 'idle',
		cycleMsBase: () => 1280,
		speed: () => speed
	});

	const animationResolver = $derived.by((): DotAnimationResolver => {
		const orbitPhase = cycleProgress.current;
		const motionDisabled = reducedMotion;

		return ({ isActive, row, col, phase }) => {
			if (!isActive || !isWithinCircularMask(row, col)) {
				return { className: 'dmx-inactive' };
			}

			const t =
				motionDisabled || phase === 'idle'
					? 0
					: Math.floor(orbitPhase * ORBIT_POINTS.length) % ORBIT_POINTS.length;
			const [headRow, headCol] = ORBIT_POINTS[t] ?? [1, 1];
			const [tailRow, tailCol] =
				ORBIT_POINTS[(t + ORBIT_POINTS.length - 1) % ORBIT_POINTS.length] ?? [1, 1];

			let opacity = BASE_OPACITY;

			if (row === headRow && col === headCol) {
				opacity = HIGH_OPACITY;
			} else if (row === tailRow && col === tailCol) {
				opacity = 0.62;
			} else if ((col === 1 || col === 3) && (row === 1 || row === 2 || row === 3)) {
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
