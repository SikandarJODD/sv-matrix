<script lang="ts">
	import { getPatternIndexes } from "$lib/components/dot-matrix/patterns.js";
	import type { DotMatrixCommonProps } from "$lib/components/dot-matrix/types.js";
	import {
		createCycleProgress,
		createDotMatrixPhaseController,
		createReducedMotionQuery,
	} from "$lib/hooks/dot-matrix/index.js";

	import HexMatrixBase from "./hex-base.svelte";
	import { buildHexCells } from "./shared.js";

	export type Hex1Props = DotMatrixCommonProps;

	const BASE_OPACITY = 0.1;
	const MID_OPACITY = 0.2;
	const HIGH_OPACITY = 0.96;
	const CENTER_OPACITY = 0.1;
	const TRAIL_SPAN = 5;
	const PERIMETER_PATH = [
		"0,0",
		"0,1",
		"0,2",
		"1,3",
		"2,4",
		"3,3",
		"4,2",
		"4,1",
		"4,0",
		"3,0",
		"2,0",
		"1,0",
	] as const;
	const PATH_LEN = PERIMETER_PATH.length;
	const HALF_PATH = PATH_LEN / 2;

	function modF(value: number, modulo: number): number {
		return ((value % modulo) + modulo) % modulo;
	}

	function smoothstep01(edge0: number, edge1: number, x: number): number {
		if (edge1 <= edge0) {
			return x >= edge1 ? 1 : 0;
		}

		const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
		return t * t * (3 - 2 * t);
	}

	function glowAlongPath(head: number, pathIndex: number | null): number {
		if (pathIndex === null) {
			return BASE_OPACITY;
		}

		const distance = modF(head - pathIndex, PATH_LEN);
		const glow = 1 - smoothstep01(0, TRAIL_SPAN, distance);
		return BASE_OPACITY + glow * (HIGH_OPACITY - BASE_OPACITY);
	}

	function opacityForCell(id: string, phase: number): number {
		if (id === "2,2") {
			return CENTER_OPACITY;
		}

		const pathIndex = PERIMETER_PATH.indexOf(id as (typeof PERIMETER_PATH)[number]);
		const normalizedPathIndex = pathIndex === -1 ? null : pathIndex;
		const headA = phase * PATH_LEN;
		const headB = modF(headA + HALF_PATH, PATH_LEN);
		const perimeterGlow = Math.max(
			glowAlongPath(headA, normalizedPathIndex),
			glowAlongPath(headB, normalizedPathIndex) * 0.74
		);

		if (normalizedPathIndex !== null) {
			return Math.min(HIGH_OPACITY, perimeterGlow);
		}

		const [, col] = id.split(",").map(Number);
		const centerFalloff = col === 2 ? MID_OPACITY : 0.18;
		return Math.max(BASE_OPACITY, centerFalloff);
	}

	let {
		onmouseenter,
		onmouseleave,
		speed = 1.6,
		pattern = "full",
		animated = true,
		hoverAnimated = false,
		size = 33,
		dotSize = 5,
		...restProps
	}: Hex1Props = $props();

	const reducedMotionQuery = createReducedMotionQuery();
	const reducedMotion = $derived(reducedMotionQuery.current);
	const phaseController = createDotMatrixPhaseController({
		animated: () => Boolean(animated && !reducedMotion),
		hoverAnimated: () => Boolean(hoverAnimated && !reducedMotion),
		speed: () => speed,
	});
	const cycleProgress = createCycleProgress({
		active: () => !reducedMotion && phaseController.phase !== "idle",
		cycleMsBase: () => 1500,
		speed: () => speed,
	});
	const currentPhase = $derived(
		reducedMotion || phaseController.phase === "idle" ? 0.08 : cycleProgress.current
	);
	const activePatternIndexes = $derived(new Set(getPatternIndexes(pattern)));
	const cells = $derived.by(() =>
		buildHexCells(activePatternIndexes, (cell) => opacityForCell(cell.id, currentPhase))
	);

	function handleMouseEnter(event: MouseEvent & { currentTarget: EventTarget & HTMLDivElement }) {
		phaseController.onMouseEnter();
		onmouseenter?.(event);
	}

	function handleMouseLeave(event: MouseEvent & { currentTarget: EventTarget & HTMLDivElement }) {
		phaseController.onMouseLeave();
		onmouseleave?.(event);
	}
</script>

<HexMatrixBase
	{speed}
	{size}
	{dotSize}
	{animated}
	{hoverAnimated}
	{cells}
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
	{...restProps}
/>
