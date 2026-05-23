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

	export type Square7Props = DotMatrixCommonProps;

	type FrameCell = "." | "o" | "x" | "c";

	const BASE_OPACITY = 0.08;
	const SETTLED_OPACITY = 0.42;
	const ACTIVE_OPACITY = 1;
	const CLEAR_OPACITY = 0.88;
	const IDLE_STEP = 10;

	const FRAME_MASKS: readonly string[] = [
		"....." + "....." + "....." + "....." + "ooooo",
		"....." + "....." + "....." + "ooooo" + "ooooo",
		"....." + "....." + "ooooo" + "ooooo" + "ooooo",
		"....." + "ooooo" + "ooooo" + "ooooo" + "ooooo",
		"ooooo" + "ooooo" + "ooooo" + "ooooo" + "ooooo",
		"ccccc" + "ccccc" + "ccccc" + "ccccc" + "ccccc",
		"....." + "....." + "....." + "....." + ".....",
		"ccccc" + "ccccc" + "ccccc" + "ccccc" + "ccccc",
		"....." + "....." + "....." + "....." + ".....",
		"....." + "....." + "....." + "....." + ".....",
	];

	const FRAME_SEQUENCE: readonly number[] = [0, 1, 2, 3, 4, 4, 5, 6, 7, 8, 9];

	function maskCell(mask: string, row: number, col: number): FrameCell {
		return (mask[rowMajorIndex(row, col)] as FrameCell | undefined) ?? ".";
	}

	let {
		onmouseenter,
		onmouseleave,
		speed = 1.35,
		pattern = "full",
		animated = true,
		hoverAnimated = false,
		size = 29,
		dotSize = 5,
		...restProps
	}: Square7Props = $props();

	const reducedMotionQuery = createReducedMotionQuery();
	const reducedMotion = $derived(reducedMotionQuery.current);
	const phaseController = createDotMatrixPhaseController({
		animated: () => Boolean(animated && !reducedMotion),
		hoverAnimated: () => Boolean(hoverAnimated && !reducedMotion),
		speed: () => speed,
	});

	const sequenceLength = FRAME_SEQUENCE.length;
	const stepCycle = createSteppedCycle({
		active: () => !reducedMotion && phaseController.phase !== "idle" && sequenceLength > 0,
		cycleMsBase: () => 1900,
		steps: () => sequenceLength,
		speed: () => speed,
		idleStep: () => Math.min(IDLE_STEP, sequenceLength - 1),
	});

	const frame = $derived(FRAME_SEQUENCE[stepCycle.current] ?? FRAME_SEQUENCE[0] ?? 0);

	const animationResolver = $derived.by((): DotAnimationResolver => {
		const currentMask = FRAME_MASKS[frame] ?? FRAME_MASKS[0] ?? "";

		return ({ isActive, row, col }) => {
			if (!isActive) {
				return { className: "dmx-inactive" };
			}

			const cell = maskCell(currentMask, row, col);
			if (cell === "x") {
				return { style: { opacity: ACTIVE_OPACITY } };
			}

			if (cell === "o") {
				return { style: { opacity: SETTLED_OPACITY } };
			}

			if (cell === "c") {
				return { style: { opacity: CLEAR_OPACITY } };
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
	{size}
	{dotSize}
	phase={phaseController.phase}
	{reducedMotion}
	{animationResolver}
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
	{...restProps}
/>
