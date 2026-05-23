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

	export type Hex2Props = DotMatrixCommonProps;

	const BASE_OPACITY = 0.08;
	const MID_OPACITY = 0.44;
	const HIGH_OPACITY = 0.98;
	const SPOKE_WIDTH = 0.34;

	function angularDistance(a: number, b: number): number {
		const diff = Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b)));
		return Math.min(diff, Math.PI * 2 - diff);
	}

	function opacityForCell(row: number, col: number, phase: number): number {
		const { x, y } = pointForCell(row, col);
		const radius = Math.sqrt(x * x + y * y);

		if (radius < 0.01) {
			return MID_OPACITY + Math.sin(phase * Math.PI * 2) * 0.18;
		}

		const angle = Math.atan2(y, x);
		const rotation = phase * Math.PI * 2;
		const spokeA = angularDistance(angle, rotation);
		const spokeB = angularDistance(angle, rotation + (Math.PI * 2) / 3);
		const spokeC = angularDistance(angle, rotation + (Math.PI * 4) / 3);
		const nearestSpoke = Math.min(spokeA, spokeB, spokeC);
		const spokeGlow = Math.max(0, 1 - nearestSpoke / SPOKE_WIDTH);
		const outerPulse = 0.5 + 0.5 * Math.sin(phase * Math.PI * 2 - radius * 2.2);
		const shellLift = radius > 1.7 ? outerPulse * 0.24 : 0;

		return Math.min(HIGH_OPACITY, BASE_OPACITY + spokeGlow * 0.78 + shellLift);
	}

	let {
		onmouseenter,
		onmouseleave,
		speed = 1.7,
		pattern = "full",
		animated = true,
		hoverAnimated = false,
		size = 33,
		dotSize = 5,
		...restProps
	}: Hex2Props = $props();

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
		reducedMotion || phaseController.phase === "idle" ? 0.06 : cycleProgress.current
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
