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

	export type Square14Props = DotMatrixCommonProps;

	type FrameCell = "." | "o" | "x";

	const BASE_OPACITY = 0.08;
	const MID_OPACITY = 0.52;
	const PEAK_OPACITY = 1;
	const SMOOTH_TRANSITION = "opacity 180ms cubic-bezier(0.4, 0, 0.2, 1)";
	const FRAME_MASKS: readonly string[] = [
		"x...x" + ".x.x." + "..o.." + ".x.x." + "x...x",
		"..x.." + ".oxo." + "xooox" + ".oxo." + "..x..",
		".x.x." + "x.o.x" + "..o.." + "x.o.x" + ".x.x.",
		"x.x.x" + ".o.o." + "x.o.x" + ".o.o." + "x.x.x",
	];
	const FRAME_SEQUENCE: readonly number[] = [0, 1, 2, 3, 2, 1];

	function maskCell(mask: string, row: number, col: number): FrameCell {
		return (mask[rowMajorIndex(row, col)] as FrameCell | undefined) ?? ".";
	}

	let {
		onmouseenter,
		onmouseleave,
		speed = 1.25,
		pattern = "full",
		animated = true,
		hoverAnimated = false,
		size = 29,
		dotSize = 5,
		...restProps
	}: Square14Props = $props();

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
		cycleMsBase: () => 1700,
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
				return { style: { opacity: PEAK_OPACITY, transition: SMOOTH_TRANSITION } };
			}

			if (cell === "o") {
				return { style: { opacity: MID_OPACITY, transition: SMOOTH_TRANSITION } };
			}

			return { style: { opacity: BASE_OPACITY, transition: SMOOTH_TRANSITION } };
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
