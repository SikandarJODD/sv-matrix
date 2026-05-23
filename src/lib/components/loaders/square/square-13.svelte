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

	export type Square13Props = DotMatrixCommonProps;

	type FrameCell = "." | "o" | "x";

	const BASE_OPACITY = 0.08;
	const ON_OPACITY = 0.56;
	const PEAK_OPACITY = 1;
	const FRAME_MASKS: readonly string[] = [
		"..x.." + "..x.." + "..o.." + "....." + ".....",
		"....x" + "...x." + "..o.." + "....." + ".....",
		"....." + "....." + "..oxx" + "....." + ".....",
		"....." + "....." + "..o.." + "...x." + "....x",
		"....." + "....." + "..o.." + "..x.." + "..x..",
		"....." + "....." + "..o.." + ".x..." + "x....",
		"....." + "....." + "xxo.." + "....." + ".....",
		"x...." + ".x..." + "..o.." + "....." + ".....",
	];
	const FRAME_SEQUENCE: readonly number[] = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7];

	function maskCell(mask: string, row: number, col: number): FrameCell {
		return (mask[rowMajorIndex(row, col)] as FrameCell | undefined) ?? ".";
	}

	let {
		onmouseenter,
		onmouseleave,
		speed = 1.85,
		pattern = "full",
		animated = true,
		hoverAnimated = false,
		size = 29,
		dotSize = 5,
		...restProps
	}: Square13Props = $props();

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
		cycleMsBase: () => 1550,
		steps: () => sequenceLength,
		speed: () => speed,
	});

	const animationResolver = $derived.by((): DotAnimationResolver => {
		const frameIndex = FRAME_SEQUENCE[stepCycle.current] ?? 0;
		const mask = FRAME_MASKS[frameIndex] ?? FRAME_MASKS[0] ?? "";

		return ({ isActive, row, col }) => {
			if (!isActive) {
				return { className: "dmx-inactive" };
			}

			const cell = maskCell(mask, row, col);

			if (cell === "x") {
				return { style: { opacity: PEAK_OPACITY } };
			}

			if (cell === "o") {
				return { style: { opacity: ON_OPACITY } };
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
