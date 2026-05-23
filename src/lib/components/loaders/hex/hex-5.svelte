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

	export type Hex5Props = DotMatrixCommonProps;

	const BASE_OPACITY = 0.08;
	const HIGH_OPACITY = 0.96;

	function wavePeak(value: number): number {
		const wrapped = ((value % 1) + 1) % 1;
		return Math.max(0, 1 - Math.abs(wrapped * 2 - 1) / 0.55);
	}

	function opacityForCell(row: number, col: number, phase: number): number {
		const { x, y } = pointForCell(row, col);
		const angle = Math.atan2(y, x);
		const radius = Math.sqrt(x * x + y * y);
		const spiral = phase + radius * 0.18 + angle / (Math.PI * 2);
		const counterSpiral = phase * 0.72 - radius * 0.16 - angle / (Math.PI * 2);
		const primary = wavePeak(spiral);
		const secondary = wavePeak(counterSpiral) * 0.55;
		const core = radius < 0.1 ? 0.54 + Math.sin(phase * Math.PI * 4) * 0.26 : 0;

		return Math.min(HIGH_OPACITY, BASE_OPACITY + primary * 0.7 + secondary * 0.42 + core);
	}

	let {
		onmouseenter,
		onmouseleave,
		speed = 1.75,
		pattern = "full",
		animated = true,
		hoverAnimated = false,
		size = 33,
		dotSize = 5,
		...restProps
	}: Hex5Props = $props();

	const reducedMotionQuery = createReducedMotionQuery();
	const reducedMotion = $derived(reducedMotionQuery.current);
	const phaseController = createDotMatrixPhaseController({
		animated: () => Boolean(animated && !reducedMotion),
		hoverAnimated: () => Boolean(hoverAnimated && !reducedMotion),
		speed: () => speed,
	});
	const cycleProgress = createCycleProgress({
		active: () => !reducedMotion && phaseController.phase !== "idle",
		cycleMsBase: () => 1450,
		speed: () => speed,
	});
	const currentPhase = $derived(
		reducedMotion || phaseController.phase === "idle" ? 0.18 : cycleProgress.current
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
