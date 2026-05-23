<script lang="ts">
	import TriangleMatrixBase from "./triangle-base.svelte";
	import type {
		DotAnimationResolver,
		DotMatrixCommonProps,
	} from "$lib/components/dot-matrix/types.js";
	import {
		createCycleProgress,
		createDotMatrixPhaseController,
		createReducedMotionQuery,
	} from "$lib/hooks/dot-matrix/index.js";

	import {
		TRIANGLE_ACTIVE_INDEXES,
		TRIANGLE_MATRIX_SIZE,
		isWithinTriangleMask,
	} from "./shared.js";

	export type Triangle20Props = DotMatrixCommonProps;

	const BASE_OPACITY = 0.08;
	const HIGH_OPACITY = 0.94;
	const CENTER_DIM = 0.2;
	const TRAIL_SPAN = 3.35;
	const PERIMETER_PATH = [
		[1, 3],
		[2, 2],
		[3, 1],
		[4, 0],
		[4, 2],
		[4, 4],
		[4, 6],
		[3, 5],
		[2, 4],
	] as const satisfies ReadonlyArray<readonly [number, number]>;
	const HALF = PERIMETER_PATH.length / 2;

	function pathIndex(row: number, col: number): number | null {
		for (let index = 0; index < PERIMETER_PATH.length; index += 1) {
			const [pathRow, pathCol] = PERIMETER_PATH[index]!;
			if (row === pathRow && col === pathCol) return index;
		}
		return null;
	}

	function modF(value: number, divisor: number): number {
		return ((value % divisor) + divisor) % divisor;
	}

	function behindAlongPath(step: number, index: number, length: number): number {
		return modF(step - index, length);
	}

	function smoothstep01(edge0: number, edge1: number, x: number): number {
		if (edge1 <= edge0) {
			return x >= edge1 ? 1 : 0;
		}

		const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
		return t * t * (3 - 2 * t);
	}

	function glowAlongPath(step: number, index: number | null, length: number): number {
		if (index === null) return BASE_OPACITY;

		const distance = behindAlongPath(step, index, length);
		const glow = 1 - smoothstep01(0, TRAIL_SPAN, distance);
		return BASE_OPACITY + glow * (HIGH_OPACITY - BASE_OPACITY);
	}

	function opacityForCell(row: number, col: number, phase: number): number {
		if (row === 3 && col === 3) return CENTER_DIM;

		const index = pathIndex(row, col);
		const stepA = phase * PERIMETER_PATH.length;
		const stepB = modF(stepA + HALF, PERIMETER_PATH.length);
		return Math.min(
			HIGH_OPACITY,
			Math.max(
				glowAlongPath(stepA, index, PERIMETER_PATH.length),
				glowAlongPath(stepB, index, PERIMETER_PATH.length)
			)
		);
	}

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
	}: Triangle20Props = $props();

	const reducedMotionQuery = createReducedMotionQuery();
	const reducedMotion = $derived(reducedMotionQuery.current);
	const phaseController = createDotMatrixPhaseController({
		animated: () => Boolean(animated && !reducedMotion),
		hoverAnimated: () => Boolean(hoverAnimated && !reducedMotion),
		speed: () => speed,
	});

	const cycleProgress = createCycleProgress({
		active: () => !reducedMotion && phaseController.phase !== "idle",
		cycleMsBase: () => 1800,
		speed: () => speed,
	});

	const animationResolver = $derived.by((): DotAnimationResolver => {
		const currentPhase =
			reducedMotion || phaseController.phase === "idle" ? 0.1 : cycleProgress.current;

		return ({ isActive, row, col }) => {
			if (!isActive || !isWithinTriangleMask(row, col)) {
				return { className: "dmx-inactive" };
			}

			return { style: { opacity: opacityForCell(row, col, currentPhase) } };
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
