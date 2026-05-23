<script lang="ts">
	import { getPatternIndexes } from "$lib/components/dot-matrix/patterns.js";
	import type { DotMatrixCommonProps } from "$lib/components/dot-matrix/types.js";
	import {
		createCycleProgress,
		createDotMatrixPhaseController,
		createReducedMotionQuery,
	} from "$lib/hooks/dot-matrix/index.js";

	import HexMatrixBase from "./hex-base.svelte";
	import { buildHexCells, ROW_COUNTS } from "./shared.js";

	export type Hex6Props = DotMatrixCommonProps;

	const BASE_OPACITY = 0.1;
	const HIGH_OPACITY = 0.98;
	const BAND_COUNT = 4;

	function wrappedDistance(a: number, b: number): number {
		const diff = Math.abs(a - b) % BAND_COUNT;
		return Math.min(diff, BAND_COUNT - diff);
	}

	function opacityForCell(row: number, col: number, phase: number): number {
		const count = ROW_COUNTS[row] ?? 1;
		const x = col - (count - 1) / 2;
		const y = row - 2;
		const downwardChevron = y + Math.abs(x) * 0.92 + 1.55;
		const upwardChevron = -y + Math.abs(x) * 0.92 + 1.55;
		const head = phase * BAND_COUNT;
		const primary = Math.max(0, 1 - wrappedDistance(downwardChevron, head) / 0.78);
		const secondary = Math.max(
			0,
			1 - wrappedDistance(upwardChevron, head + BAND_COUNT / 2) / 0.92
		);
		const centerLift = row === 2 && col === 2 ? 0.18 : 0;

		return Math.min(
			HIGH_OPACITY,
			BASE_OPACITY + primary * 0.78 + secondary * 0.38 + centerLift
		);
	}

	let {
		onmouseenter,
		onmouseleave,
		speed = 1.55,
		pattern = "full",
		animated = true,
		hoverAnimated = false,
		size = 33,
		dotSize = 5,
		...restProps
	}: Hex6Props = $props();

	const reducedMotionQuery = createReducedMotionQuery();
	const reducedMotion = $derived(reducedMotionQuery.current);
	const phaseController = createDotMatrixPhaseController({
		animated: () => Boolean(animated && !reducedMotion),
		hoverAnimated: () => Boolean(hoverAnimated && !reducedMotion),
		speed: () => speed,
	});
	const cycleProgress = createCycleProgress({
		active: () => !reducedMotion && phaseController.phase !== "idle",
		cycleMsBase: () => 1260,
		speed: () => speed,
	});
	const currentPhase = $derived(
		reducedMotion || phaseController.phase === "idle" ? 0.12 : cycleProgress.current
	);
	const activePatternIndexes = $derived(new Set(getPatternIndexes(pattern)));
	const cells = $derived.by(() =>
		buildHexCells(activePatternIndexes, (cell) =>
			opacityForCell(cell.row, cell.col, currentPhase)
		)
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
