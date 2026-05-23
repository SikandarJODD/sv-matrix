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

	export type Triangle15Props = DotMatrixCommonProps;

	const BASE_OPACITY = 0.08;
	const MID_OPACITY = 0.38;
	const HIGH_OPACITY = 0.96;
	const HUBS = [
		[1, 3],
		[4, 0],
		[4, 6],
	] as const satisfies ReadonlyArray<readonly [number, number]>;

	function manhattan(aRow: number, aCol: number, bRow: number, bCol: number): number {
		return Math.abs(aRow - bRow) + Math.abs(aCol - bCol);
	}

	function smoothstep01(edge0: number, edge1: number, x: number): number {
		if (edge1 <= edge0) {
			return x >= edge1 ? 1 : 0;
		}

		const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
		return t * t * (3 - 2 * t);
	}

	function falloffFromHub(row: number, col: number, hub: readonly [number, number]): number {
		return 1 - smoothstep01(0, 5.4, manhattan(row, col, hub[0], hub[1]));
	}

	function opacityForCell(row: number, col: number, phase: number): number {
		const t = phase * Math.PI * 2;
		const sharp = 4;
		const u0 = Math.max(0, Math.cos(t)) ** sharp;
		const u1 = Math.max(0, Math.cos(t - (Math.PI * 2) / 3)) ** sharp;
		const u2 = Math.max(0, Math.cos(t - (Math.PI * 4) / 3)) ** sharp;
		const sum = u0 + u1 + u2 + 1e-4;
		const glow =
			(falloffFromHub(row, col, HUBS[0]!) * u0 +
				falloffFromHub(row, col, HUBS[1]!) * u1 +
				falloffFromHub(row, col, HUBS[2]!) * u2) /
			sum;
		let opacity = BASE_OPACITY + glow * (HIGH_OPACITY - BASE_OPACITY);

		if (row === 3 && col === 3) {
			opacity = Math.max(opacity, MID_OPACITY + glow * 0.32);
		}

		return Math.min(HIGH_OPACITY, opacity);
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
	}: Triangle15Props = $props();

	const reducedMotionQuery = createReducedMotionQuery();
	const reducedMotion = $derived(reducedMotionQuery.current);
	const phaseController = createDotMatrixPhaseController({
		animated: () => Boolean(animated && !reducedMotion),
		hoverAnimated: () => Boolean(hoverAnimated && !reducedMotion),
		speed: () => speed,
	});

	const cycleProgress = createCycleProgress({
		active: () => !reducedMotion && phaseController.phase !== "idle",
		cycleMsBase: () => 1100,
		speed: () => speed,
	});

	const animationResolver = $derived.by((): DotAnimationResolver => {
		const currentPhase =
			reducedMotion || phaseController.phase === "idle" ? 0.15 : cycleProgress.current;

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
