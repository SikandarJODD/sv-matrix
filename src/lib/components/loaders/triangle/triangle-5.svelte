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

	export type Triangle5Props = DotMatrixCommonProps;

	const STEP_COUNT = 42;
	const BASE_OPACITY = 0.06;
	const MID_OPACITY = 0.3;
	const HIGH_OPACITY = 0.92;

	let {
		onmouseenter,
		onmouseleave,
		speed = 1,
		pattern = "full",
		animated = true,
		hoverAnimated = false,
		size = 30,
		dotSize = 6,
		...restProps
	}: Triangle5Props = $props();

	const reducedMotionQuery = createReducedMotionQuery();
	const reducedMotion = $derived(reducedMotionQuery.current);
	const phaseController = createDotMatrixPhaseController({
		animated: () => Boolean(animated && !reducedMotion),
		hoverAnimated: () => Boolean(hoverAnimated && !reducedMotion),
		speed: () => speed,
	});

	const step = createSteppedCycle({
		active: () => !reducedMotion && phaseController.phase !== "idle",
		cycleMsBase: () => 1700,
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
			const pingPong = 0.5 - 0.5 * Math.cos(progress * Math.PI * 2);
			const scanRow = 1 + pingPong * 3;
			const distance = Math.abs(row - scanRow);
			const beam = Math.max(0, 1 - distance / 2.2);
			const easedBeam = beam * beam;
			let opacity = BASE_OPACITY + easedBeam * (HIGH_OPACITY - BASE_OPACITY);

			if (distance > 1.3) {
				opacity = Math.max(opacity, MID_OPACITY - Math.min(0.18, (distance - 1.3) * 0.12));
			}

			if (row === 3 && col === 3) {
				opacity = Math.max(opacity, 0.42);
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
