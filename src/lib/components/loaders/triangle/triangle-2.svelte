<script lang="ts">
	import TriangleMatrixBase from "./triangle-base.svelte";
	import type {
		DotAnimationResolver,
		DotMatrixCommonProps,
	} from "$lib/components/dot-matrix/types.js";
	import {
		createDotMatrixPhaseController,
		createReducedMotionQuery,
		createSteppedCycle,
	} from "$lib/hooks/dot-matrix/index.js";

	import {
		TRIANGLE_ACTIVE_INDEXES,
		TRIANGLE_MATRIX_SIZE,
		isWithinTriangleMask,
	} from "./shared.js";

	export type Triangle2Props = DotMatrixCommonProps;

	const STEP_COUNT = 36;
	const BASE_OPACITY = 0.08;
	const MID_OPACITY = 0.34;
	const HIGH_OPACITY = 0.94;

	let {
		onmouseenter,
		onmouseleave,
		speed = 1,
		pattern = "full",
		animated = true,
		hoverAnimated = false,
		size = 30,
		cellPadding = 0,
		dotSize = 6,
		...restProps
	}: Triangle2Props = $props();

	const reducedMotionQuery = createReducedMotionQuery();
	const reducedMotion = $derived(reducedMotionQuery.current);
	const phaseController = createDotMatrixPhaseController({
		animated: () => Boolean(animated && !reducedMotion),
		hoverAnimated: () => Boolean(hoverAnimated && !reducedMotion),
		speed: () => speed,
	});

	const step = createSteppedCycle({
		active: () => !reducedMotion && phaseController.phase !== "idle",
		cycleMsBase: () => 1550,
		steps: () => STEP_COUNT,
		speed: () => speed,
	});

	const animationResolver = $derived.by((): DotAnimationResolver => {
		const frame = reducedMotion ? 0 : step.current;

		return ({ isActive, row, col, phase }) => {
			if (!isActive || !isWithinTriangleMask(row, col)) {
				return { className: "dmx-inactive" };
			}

			const progress = (phase === "idle" ? 0 : frame) / STEP_COUNT;
			const rowPhase = (4 - row) * 0.13;
			const pulse = 0.5 - 0.5 * Math.cos((progress + rowPhase) * Math.PI * 2);
			const crest = pulse * pulse;
			const altitudeWeight = 0.58 + (4 - row) * 0.16;
			const centerWeight = col === 3 ? 0.16 : 0;

			const opacity = Math.min(
				HIGH_OPACITY,
				BASE_OPACITY +
					pulse * (MID_OPACITY - BASE_OPACITY) +
					crest * (altitudeWeight + centerWeight) * (HIGH_OPACITY - MID_OPACITY)
			);

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

<TriangleMatrixBase
	{speed}
	{pattern}
	{animated}
	{hoverAnimated}
	{size}
	{dotSize}
	gridSize={TRIANGLE_MATRIX_SIZE}
	activeIndexes={TRIANGLE_ACTIVE_INDEXES}
	phase={phaseController.phase}
	{reducedMotion}
	{animationResolver}
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
	{...restProps}
/>
