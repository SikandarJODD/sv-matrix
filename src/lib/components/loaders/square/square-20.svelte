<script lang="ts">
	import DotMatrixBase from "$lib/components/dot-matrix/dot-matrix-base.svelte";
	import { rowMajorIndex } from "$lib/components/dot-matrix/geometry.js";
	import type {
		DotAnimationResolver,
		DotMatrixCommonProps,
	} from "$lib/components/dot-matrix/types.js";
	import {
		createDotMatrixPhaseController,
		createReducedMotionQuery,
		createSteppedCycle,
	} from "$lib/hooks/dot-matrix/index.js";

	export type Square20Props = DotMatrixCommonProps;

	const PERIMETER_PATH: readonly number[] = [
		rowMajorIndex(0, 0),
		rowMajorIndex(0, 1),
		rowMajorIndex(0, 2),
		rowMajorIndex(0, 3),
		rowMajorIndex(0, 4),
		rowMajorIndex(1, 4),
		rowMajorIndex(2, 4),
		rowMajorIndex(3, 4),
		rowMajorIndex(4, 4),
		rowMajorIndex(4, 3),
		rowMajorIndex(4, 2),
		rowMajorIndex(4, 1),
		rowMajorIndex(4, 0),
		rowMajorIndex(3, 0),
		rowMajorIndex(2, 0),
		rowMajorIndex(1, 0),
	];

	const LOOP_LEN = PERIMETER_PATH.length;
	const HALF_LOOP = Math.floor(LOOP_LEN / 2);
	const TAIL_BRIGHT = [1, 0.82, 0.64, 0.46, 0.3, 0.18] as const;
	const BACK_TAIL_BRIGHT = [0.38, 0.3, 0.22, 0.14] as const;
	const BASE_OPACITY = 0.08;
	const TWIST_INNER_OPACITY = 0.52;
	const SEAM_PULSE_OPACITY = 0.55;
	const IDLE_RING_OPACITY = 0.48;
	const SEAM_INDEX = rowMajorIndex(2, 2);

	const TWIST_INNER_BY_HEAD_STEP: ReadonlyMap<number, number> = new Map([
		[0, rowMajorIndex(1, 1)],
		[4, rowMajorIndex(1, 3)],
		[8, rowMajorIndex(3, 3)],
		[12, rowMajorIndex(3, 1)],
	]);

	function pathStepForCellIndex(cellIndex: number): number {
		return PERIMETER_PATH.indexOf(cellIndex);
	}

	function opacityFromTail(distance: number, tail: readonly number[]): number {
		if (distance < 0 || distance >= tail.length) {
			return 0;
		}

		return tail[distance] ?? 0;
	}

	let {
		onmouseenter,
		onmouseleave,
		speed = 1,
		pattern = "full",
		animated = true,
		hoverAnimated = false,
		size = 29,
		dotSize = 5,
		...restProps
	}: Square20Props = $props();

	const reducedMotionQuery = createReducedMotionQuery();
	const reducedMotion = $derived(reducedMotionQuery.current);
	const phaseController = createDotMatrixPhaseController({
		animated: () => Boolean(animated && !reducedMotion),
		hoverAnimated: () => Boolean(hoverAnimated && !reducedMotion),
		speed: () => speed,
	});

	const headStep = createSteppedCycle({
		active: () => !reducedMotion && phaseController.phase !== "idle",
		cycleMsBase: () => 1600,
		steps: () => LOOP_LEN,
		speed: () => speed,
	});

	const animationResolver = $derived.by((): DotAnimationResolver => {
		const step = headStep.current;
		const motionDisabled = reducedMotion;

		return ({ isActive, index, phase }) => {
			if (!isActive) {
				return { className: "dmx-inactive" };
			}

			const onLoop = pathStepForCellIndex(index);
			const backHead = (step + HALF_LOOP) % LOOP_LEN;

			if (motionDisabled || phase === "idle") {
				if (onLoop >= 0) {
					return { style: { opacity: IDLE_RING_OPACITY } };
				}

				if (index === SEAM_INDEX) {
					return { style: { opacity: 0.22 } };
				}

				return { style: { opacity: BASE_OPACITY } };
			}

			let opacity = BASE_OPACITY;

			if (onLoop >= 0) {
				const forward = (step - onLoop + LOOP_LEN) % LOOP_LEN;
				const alongBack = (backHead - onLoop + LOOP_LEN) % LOOP_LEN;
				opacity = Math.max(
					opacity,
					opacityFromTail(forward, TAIL_BRIGHT),
					opacityFromTail(alongBack, BACK_TAIL_BRIGHT)
				);
			}

			const twistInner = TWIST_INNER_BY_HEAD_STEP.get(step);
			if (twistInner === index) {
				opacity = Math.max(opacity, TWIST_INNER_OPACITY);
			}

			if (index === SEAM_INDEX && step % 4 === 0) {
				opacity = Math.max(opacity, SEAM_PULSE_OPACITY);
			}

			return {
				style: {
					opacity: Math.min(1, opacity),
				},
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
	{size}
	{dotSize}
	phase={phaseController.phase}
	{reducedMotion}
	{animationResolver}
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
	{...restProps}
/>
