<script lang="ts">
	import CircleMatrixBase from "./circle-base.svelte";
	import { isWithinCircularMask, rowMajorIndex } from "$lib/components/dot-matrix/geometry.js";
	import type {
		DotAnimationResolver,
		DotMatrixCommonProps,
	} from "$lib/components/dot-matrix/types.js";
	import {
		createDotMatrixPhaseController,
		createReducedMotionQuery,
		createSteppedCycle,
	} from "$lib/hooks/dot-matrix/index.js";

	export type Circle3Props = DotMatrixCommonProps;

	const STEP_COUNT = 24;
	const BASE_OPACITY = 0.08;
	const RING_BASE_OPACITY = 0.2;
	const CORE_OPACITY = 0.16;
	const COMET_TAIL = [1, 0.78, 0.56, 0.36, 0.22] as const;
	const SECONDARY_COMET_SCALE = 0.72;

	const CIRCULAR_RING_PATH: readonly number[] = [
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
		rowMajorIndex(1, 0),
	];

	const LOOP_LEN = CIRCULAR_RING_PATH.length;

	let {
		onmouseenter,
		onmouseleave,
		speed = 1,
		pattern = "full",
		animated = true,
		hoverAnimated = false,
		...restProps
	}: Circle3Props = $props();

	const reducedMotionQuery = createReducedMotionQuery();
	const reducedMotion = $derived(reducedMotionQuery.current);
	const phaseController = createDotMatrixPhaseController({
		animated: () => Boolean(animated && !reducedMotion),
		hoverAnimated: () => Boolean(hoverAnimated && !reducedMotion),
		speed: () => speed,
	});

	const headStep = createSteppedCycle({
		active: () => !reducedMotion && phaseController.phase !== "idle",
		cycleMsBase: () => 1650,
		steps: () => STEP_COUNT,
		speed: () => speed,
		idleStep: () => 6,
	});

	const animationResolver = $derived.by((): DotAnimationResolver => {
		const currentHeadStep = headStep.current;
		const motionDisabled = reducedMotion;

		return ({ isActive, index, row, col, phase }) => {
			if (!isActive || !isWithinCircularMask(row, col)) {
				return { className: "dmx-inactive" };
			}

			const pathOrder = CIRCULAR_RING_PATH.indexOf(index);
			const isCore = row === 2 && col === 2;

			if (pathOrder === -1) {
				return { style: { opacity: isCore ? CORE_OPACITY : BASE_OPACITY } };
			}

			if (motionDisabled || phase === "idle") {
				return {
					style: {
						opacity: RING_BASE_OPACITY + (pathOrder / (LOOP_LEN - 1)) * 0.56,
					},
				};
			}

			const leadA = Math.floor((currentHeadStep / STEP_COUNT) * LOOP_LEN) % LOOP_LEN;
			const leadB = (leadA + Math.floor(LOOP_LEN / 2)) % LOOP_LEN;
			let opacity = BASE_OPACITY;

			for (let i = 0; i < COMET_TAIL.length; i += 1) {
				const weight = COMET_TAIL[i] ?? 0;
				const tailA = (leadA - i + LOOP_LEN) % LOOP_LEN;
				const tailB = (leadB - i + LOOP_LEN) % LOOP_LEN;

				if (pathOrder === tailA) {
					opacity = Math.max(opacity, weight);
				}

				if (pathOrder === tailB) {
					opacity = Math.max(opacity, weight * SECONDARY_COMET_SCALE);
				}
			}

			return { style: { opacity: Math.min(1, opacity) } };
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
