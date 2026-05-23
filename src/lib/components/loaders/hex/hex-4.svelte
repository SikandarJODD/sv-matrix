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

	export type Hex4Props = DotMatrixCommonProps;

	const BASE_OPACITY = 0.08;
	const MID_OPACITY = 0.36;
	const HIGH_OPACITY = 0.98;
	const TRAIL_SPAN = 2.2;
	const VERTEX_PATH = ["0,2", "1,3", "2,4", "3,3", "4,2", "3,0", "2,0", "1,0", "0,0"] as const;
	const ECHO_BY_VERTEX: Readonly<Record<(typeof VERTEX_PATH)[number], readonly string[]>> = {
		"0,2": ["0,1", "1,2"],
		"1,3": ["1,2", "2,3"],
		"2,4": ["2,3", "2,2"],
		"3,3": ["3,2", "2,3"],
		"4,2": ["4,1", "3,2"],
		"3,0": ["3,1", "2,1"],
		"2,0": ["2,1", "2,2"],
		"1,0": ["1,1", "2,1"],
		"0,0": ["0,1", "1,1"],
	};
	const PATH_LEN = VERTEX_PATH.length;

	function modF(value: number, modulo: number): number {
		return ((value % modulo) + modulo) % modulo;
	}

	function opacityForCell(row: number, col: number, phase: number): number {
		const id = `${row},${col}`;
		const head = phase * PATH_LEN;
		const vertexIndex = VERTEX_PATH.indexOf(id as (typeof VERTEX_PATH)[number]);
		let opacity = BASE_OPACITY;

		if (vertexIndex >= 0) {
			const distance = modF(head - vertexIndex, PATH_LEN);
			const glow = Math.max(0, 1 - distance / TRAIL_SPAN);
			opacity = Math.max(opacity, BASE_OPACITY + glow * (HIGH_OPACITY - BASE_OPACITY));
		}

		for (let index = 0; index < PATH_LEN; index += 1) {
			const vertex = VERTEX_PATH[index]!;

			if (!ECHO_BY_VERTEX[vertex].includes(id)) {
				continue;
			}

			const distance = modF(head - index, PATH_LEN);
			const echo = Math.max(0, 1 - Math.abs(distance - 0.55) / 1.45);
			opacity = Math.max(opacity, BASE_OPACITY + echo * 0.52);
		}

		if (id === "2,2") {
			const centerBeat = 0.5 + 0.5 * Math.sin(phase * Math.PI * PATH_LEN);
			opacity = Math.max(opacity, MID_OPACITY + centerBeat * 0.22);
		}

		const { x, y } = pointForCell(row, col);
		const softFill = Math.max(0, 1 - Math.sqrt(x * x + y * y) / 2.35) * 0.1;
		return Math.min(HIGH_OPACITY, opacity + softFill);
	}

	let {
		onmouseenter,
		onmouseleave,
		speed = 1.5,
		pattern = "full",
		animated = true,
		hoverAnimated = false,
		size = 33,
		dotSize = 5,
		...restProps
	}: Hex4Props = $props();

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
