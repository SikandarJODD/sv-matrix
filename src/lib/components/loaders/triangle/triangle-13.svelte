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

	export type Triangle13Props = DotMatrixCommonProps;

	const BASE_OPACITY = 0.13;
	const HIGH_OPACITY = 0.95;
	const TRAIL_SPAN = 4.25;
	const SERPENT_PATH = [
		[4, 0],
		[4, 2],
		[4, 4],
		[4, 6],
		[3, 5],
		[3, 3],
		[3, 1],
		[2, 2],
		[2, 4],
		[1, 3],
	] as const satisfies ReadonlyArray<readonly [number, number]>;

	function pathIndex(row: number, col: number): number | null {
		for (let index = 0; index < SERPENT_PATH.length; index += 1) {
			const [pathRow, pathCol] = SERPENT_PATH[index]!;
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

	function opacityForCell(row: number, col: number, phase: number): number {
		const index = pathIndex(row, col);
		if (index === null) return 0;

		const step = phase * SERPENT_PATH.length;
		const distance = behindAlongPath(step, index, SERPENT_PATH.length);
		const glow = 1 - smoothstep01(0, TRAIL_SPAN, distance);
		return BASE_OPACITY + glow * (HIGH_OPACITY - BASE_OPACITY);
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
	}: Triangle13Props = $props();

	const reducedMotionQuery = createReducedMotionQuery();
	const reducedMotion = $derived(reducedMotionQuery.current);
	const phaseController = createDotMatrixPhaseController({
		animated: () => Boolean(animated && !reducedMotion),
		hoverAnimated: () => Boolean(hoverAnimated && !reducedMotion),
		speed: () => speed,
	});

	const cycleProgress = createCycleProgress({
		active: () => !reducedMotion && phaseController.phase !== "idle",
		cycleMsBase: () => 1400,
		speed: () => speed,
	});

	const animationResolver = $derived.by((): DotAnimationResolver => {
		const currentPhase =
			reducedMotion || phaseController.phase === "idle" ? 0.14 : cycleProgress.current;

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
