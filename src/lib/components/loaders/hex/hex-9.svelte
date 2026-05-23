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

	export type Hex9Props = DotMatrixCommonProps;

	const BASE_OPACITY = 0.15;
	const HIGH_OPACITY = 0.98;
	const PETAL_WIDTH = 0.42;

	function angularDistance(a: number, b: number): number {
		return Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b)));
	}

	function opacityForCell(row: number, col: number, phase: number): number {
		const { x, y } = pointForCell(row, col);
		const angle = Math.atan2(y, x);
		const radius = Math.sqrt(x * x + y * y);

		if (radius < 0.1) {
			return 0.42 + Math.sin(phase * Math.PI * 2) * 0.2;
		}

		const rotation = phase * Math.PI * 2;
		const petalA = Math.max(0, 1 - angularDistance(angle, rotation) / PETAL_WIDTH);
		const petalB = Math.max(0, 1 - angularDistance(angle, rotation + Math.PI) / PETAL_WIDTH);
		const crossA =
			Math.max(0, 1 - angularDistance(angle, rotation + Math.PI / 2) / 0.52) * 0.46;
		const crossB =
			Math.max(0, 1 - angularDistance(angle, rotation + Math.PI * 1.5) / 0.52) * 0.46;
		const ring =
			(0.5 + 0.5 * Math.sin(phase * Math.PI * 2 - radius * 2.7)) *
			(radius > 1.3 ? 0.22 : 0.1);
		const petalPeak = Math.max(petalA, petalB);

		if (petalPeak > 0.92) {
			return HIGH_OPACITY;
		}

		return Math.min(HIGH_OPACITY, BASE_OPACITY + petalPeak * 0.82 + crossA + crossB + ring);
	}

	let {
		onmouseenter,
		onmouseleave,
		speed = 1.8,
		pattern = "full",
		animated = true,
		hoverAnimated = false,
		size = 33,
		dotSize = 5,
		...restProps
	}: Hex9Props = $props();

	const reducedMotionQuery = createReducedMotionQuery();
	const reducedMotion = $derived(reducedMotionQuery.current);
	const phaseController = createDotMatrixPhaseController({
		animated: () => Boolean(animated && !reducedMotion),
		hoverAnimated: () => Boolean(hoverAnimated && !reducedMotion),
		speed: () => speed,
	});
	const cycleProgress = createCycleProgress({
		active: () => !reducedMotion && phaseController.phase !== "idle",
		cycleMsBase: () => 1650,
		speed: () => speed,
	});
	const currentPhase = $derived(
		reducedMotion || phaseController.phase === "idle" ? 0.1 : cycleProgress.current
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
