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

	export type Hex10Props = DotMatrixCommonProps;

	const BASE_OPACITY = 0.09;
	const HIGH_OPACITY = 0.98;

	function ripple(value: number, width: number): number {
		const wrapped = ((value % 1) + 1) % 1;
		const distance = Math.min(wrapped, 1 - wrapped);
		return Math.max(0, 1 - distance / width);
	}

	function opacityForCell(row: number, col: number, phase: number): number {
		const { x, y } = pointForCell(row, col);
		const radius = Math.sqrt(x * x + y * y);
		const lensCenter = Math.sin(phase * Math.PI * 2) * 1.15;
		const lensDistance = Math.abs(lensCenter - x * 0.88 - y * 0.16);
		const liquidLens = Math.max(0, 1 - lensDistance / 0.78);
		const wakeFront = ripple(phase + x * 0.12 - y * 0.045 + radius * 0.07, 0.16);
		const wakeBack = ripple(phase + 0.34 + x * 0.09 + y * 0.035 + radius * 0.05, 0.2) * 0.34;
		const verticalCompression =
			Math.max(0, 1 - Math.abs(Math.cos(phase * Math.PI * 2) * 1.18 - y * 1.25) / 1.1) * 0.18;
		const shellSheen =
			(0.5 + 0.5 * Math.sin(phase * Math.PI * 2 - radius * 1.9)) *
			(radius > 1.35 ? 0.16 : 0.06);
		const core = radius < 0.1 ? 0.34 + Math.sin(phase * Math.PI * 2) * 0.1 : 0;

		return Math.min(
			HIGH_OPACITY,
			BASE_OPACITY +
				liquidLens * 0.72 +
				wakeFront * 0.38 +
				wakeBack +
				verticalCompression +
				shellSheen +
				core
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
	}: Hex10Props = $props();

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
		reducedMotion || phaseController.phase === "idle" ? 0.14 : cycleProgress.current
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
