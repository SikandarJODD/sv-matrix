<script lang="ts">
	import { getPatternIndexes } from "$lib/components/dot-matrix/patterns.js";
	import type { DotMatrixCommonProps } from "$lib/components/dot-matrix/types.js";
	import {
		createCycleProgress,
		createDotMatrixPhaseController,
		createReducedMotionQuery,
	} from "$lib/hooks/dot-matrix/index.js";

	import HexMatrixBase from "./hex-base.svelte";
	import { buildHexCells, pointForCell } from "./shared.js";

	export type Hex3Props = DotMatrixCommonProps;

	const BASE_OPACITY = 0.08;
	const HIGH_OPACITY = 0.96;
	const BAND_WIDTH = 0.55;

	function triangularWave(value: number): number {
		const wrapped = ((value % 1) + 1) % 1;
		return 1 - Math.abs(wrapped * 2 - 1);
	}

	function bandGlow(distance: number): number {
		return Math.max(0, 1 - Math.abs(distance) / BAND_WIDTH);
	}

	function opacityForCell(row: number, col: number, phase: number): number {
		const { x, y } = pointForCell(row, col);
		const sweep = triangularWave(phase) * 3.9 - 1.95;
		const diagA = x * 0.86 + y * 0.5;
		const diagB = x * -0.86 + y * 0.5;
		const gateA = bandGlow(diagA - sweep);
		const gateB = bandGlow(diagB + sweep);
		const centerDistance = Math.sqrt(x * x + y * y);
		const centerFlash =
			Math.max(0, 1 - Math.abs(sweep) / 0.68) * Math.max(0, 1 - centerDistance / 1.9);
		const wake = 0.16 * Math.max(0, 1 - Math.abs(y - sweep * 0.22) / 1.2);

		return Math.min(
			HIGH_OPACITY,
			BASE_OPACITY + gateA * 0.7 + gateB * 0.7 + centerFlash * 0.42 + wake
		);
	}

	let {
		onmouseenter,
		onmouseleave,
		speed = 1.45,
		pattern = "full",
		animated = true,
		hoverAnimated = false,
		size = 33,
		dotSize = 5,
		...restProps
	}: Hex3Props = $props();

	const reducedMotionQuery = createReducedMotionQuery();
	const reducedMotion = $derived(reducedMotionQuery.current);
	const phaseController = createDotMatrixPhaseController({
		animated: () => Boolean(animated && !reducedMotion),
		hoverAnimated: () => Boolean(hoverAnimated && !reducedMotion),
		speed: () => speed,
	});
	const cycleProgress = createCycleProgress({
		active: () => !reducedMotion && phaseController.phase !== "idle",
		cycleMsBase: () => 1850,
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
