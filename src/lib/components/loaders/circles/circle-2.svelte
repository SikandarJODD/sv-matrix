<script lang="ts">
	import DotMatrixBase from '$lib/components/dot-matrix/dot-matrix-base.svelte';
	import { isWithinCircularMask, rowMajorIndex } from '$lib/components/dot-matrix/geometry.js';
	import type {
		DotAnimationResolver,
		DotMatrixCommonProps
	} from '$lib/components/dot-matrix/types.js';
	import {
		createDotMatrixPhaseController,
		createReducedMotionQuery
	} from '$lib/hooks/dot-matrix/index.js';

	export type Circle2Props = DotMatrixCommonProps;

	const RING_PATH: readonly number[] = [
		rowMajorIndex(0, 1),
		rowMajorIndex(0, 2),
		rowMajorIndex(0, 3),
		rowMajorIndex(1, 4),
		rowMajorIndex(2, 4),
		rowMajorIndex(3, 4),
		rowMajorIndex(4, 3),
		rowMajorIndex(4, 2),
		rowMajorIndex(4, 1),
		rowMajorIndex(3, 0),
		rowMajorIndex(2, 0),
		rowMajorIndex(1, 0)
	];

	const LOOP_LEN = RING_PATH.length;
	const BASE_OPACITY = 0.08;
	const CORE_OPACITY = 0.18;

	let {
		onmouseenter,
		onmouseleave,
		speed = 1,
		pattern = 'full',
		animated = true,
		hoverAnimated = false,
		...restProps
	}: Circle2Props = $props();

	const reducedMotionQuery = createReducedMotionQuery();
	const reducedMotion = $derived(reducedMotionQuery.current);
	const phaseController = createDotMatrixPhaseController({
		animated: () => Boolean(animated && !reducedMotion),
		hoverAnimated: () => Boolean(hoverAnimated && !reducedMotion),
		speed: () => speed
	});

	const animationResolver = $derived.by((): DotAnimationResolver => {
		const motionDisabled = reducedMotion;

		return ({ isActive, index, row, col, phase }) => {
			if (!isActive || !isWithinCircularMask(row, col)) {
				return { className: 'dmx-inactive' };
			}

			const ringOrder = RING_PATH.indexOf(index);

			if (ringOrder === -1) {
				return {
					style: {
						opacity: row === 2 && col === 2 ? CORE_OPACITY : BASE_OPACITY
					}
				};
			}

			if (motionDisabled || phase === 'idle') {
				return {
					style: {
						opacity: 0.28 + (ringOrder / (LOOP_LEN - 1)) * 0.58
					}
				};
			}

			return {
				className: 'dmx-circular2-ring',
				style: {
					'--dmx-ring-order': ringOrder
				}
			};
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
