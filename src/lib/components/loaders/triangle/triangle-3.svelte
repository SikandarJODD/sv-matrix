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

	export type Triangle3Props = DotMatrixCommonProps;

	const STEP_COUNT = 36;
	const BASE_OPACITY = 0.03;
	const MID_OPACITY = 0.07;
	const HIGH_OPACITY = 0.94;
	const FAR_OPACITY = 0.15;

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
	}: Triangle3Props = $props();

	const reducedMotionQuery = createReducedMotionQuery();
	const reducedMotion = $derived(reducedMotionQuery.current);
	const phaseController = createDotMatrixPhaseController({
		animated: () => Boolean(animated && !reducedMotion),
		hoverAnimated: () => Boolean(hoverAnimated && !reducedMotion),
		speed: () => speed,
	});

	const step = createSteppedCycle({
		active: () => !reducedMotion && phaseController.phase !== "idle",
		cycleMsBase: () => 1650,
		steps: () => STEP_COUNT,
		speed: () => speed,
	});

	const animationResolver = $derived.by((): DotAnimationResolver => {
		const frame = reducedMotion ? 0 : step.current;

		return ({ isActive, row, col, phase }) => {
			if (!isActive || !isWithinTriangleMask(row, col)) {
				return { className: "dmx-inactive" };
			}

			const theta = ((phase === "idle" ? 0 : frame) / STEP_COUNT) * Math.PI * 2;
			const sweepX = Math.cos(theta);
			const sweepY = Math.sin(theta);
			const ambientPulse = 0.5 - 0.5 * Math.cos(theta);
			const centerRow = row - 3;
			const centerCol = col - 3;
			const radius = Math.hypot(centerRow, centerCol);
			const projection = centerCol * sweepX + centerRow * sweepY;
			const perpendicular = Math.abs(centerCol * sweepY - centerRow * sweepX);
			const ahead = Math.max(0, projection);
			const beamCore = Math.max(0, 1 - perpendicular / 0.45);
			const beamHalo = Math.max(0, 1 - perpendicular / 1.15);
			const rangeFade = Math.max(0.25, 1 - radius / 3.6);
			const trail = beamHalo * Math.max(0, 1 - ahead / 3.6);

			let opacity = BASE_OPACITY + ambientPulse * (MID_OPACITY - BASE_OPACITY) * rangeFade;
			opacity = Math.max(opacity, MID_OPACITY + beamCore * (HIGH_OPACITY - MID_OPACITY));
			opacity = Math.max(opacity, FAR_OPACITY + trail * (MID_OPACITY - FAR_OPACITY));

			if (row === 3 && col === 3) {
				opacity = Math.max(opacity, 0.56);
			}

			return { style: { opacity: Math.min(HIGH_OPACITY, opacity) } };
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
