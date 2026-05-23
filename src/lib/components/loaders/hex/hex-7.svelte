<script lang="ts">
	import { getPatternIndexes } from "$lib/components/dot-matrix/patterns.js";
	import type { DotMatrixCommonProps } from "$lib/components/dot-matrix/types.js";
	import {
		createDotMatrixPhaseController,
		createReducedMotionQuery,
		createSteppedCycle,
	} from "$lib/hooks/dot-matrix/index.js";

	import HexMatrixBase from "./hex-base.svelte";
	import { buildHexCells, type HexTone } from "./shared.js";

	export type Hex7Props = DotMatrixCommonProps;

	const BASE_OPACITY = 0.2;
	const MID_OPACITY = 0.32;
	const HIGH_OPACITY = 0.98;
	const FRAMES: readonly Readonly<Record<string, HexTone>>[] = [
		{
			"0,0": "x",
			"0,1": "x",
			"0,2": "x",
			"1,1": "o",
			"1,2": "o",
			"2,2": "x",
			"3,1": "o",
			"3,2": "o",
			"4,0": "x",
			"4,1": "x",
			"4,2": "x",
		},
		{
			"0,1": "o",
			"1,0": "x",
			"1,1": "x",
			"1,2": "x",
			"1,3": "x",
			"2,2": "o",
			"3,0": "x",
			"3,1": "x",
			"3,2": "x",
			"3,3": "x",
			"4,1": "o",
		},
		{
			"0,1": "x",
			"1,1": "x",
			"1,2": "x",
			"2,0": "o",
			"2,1": "x",
			"2,2": "x",
			"2,3": "x",
			"2,4": "o",
			"3,1": "x",
			"3,2": "x",
			"4,1": "x",
		},
		{
			"0,0": "o",
			"0,2": "o",
			"1,0": "x",
			"1,3": "x",
			"2,1": "x",
			"2,2": "o",
			"2,3": "x",
			"3,0": "x",
			"3,3": "x",
			"4,0": "o",
			"4,2": "o",
		},
	];

	let {
		onmouseenter,
		onmouseleave,
		speed = 1.9,
		pattern = "full",
		animated = true,
		hoverAnimated = false,
		size = 33,
		dotSize = 5,
		...restProps
	}: Hex7Props = $props();

	const reducedMotionQuery = createReducedMotionQuery();
	const reducedMotion = $derived(reducedMotionQuery.current);
	const phaseController = createDotMatrixPhaseController({
		animated: () => Boolean(animated && !reducedMotion),
		hoverAnimated: () => Boolean(hoverAnimated && !reducedMotion),
		speed: () => speed,
	});
	const steppedCycle = createSteppedCycle({
		active: () => !reducedMotion && phaseController.phase !== "idle",
		cycleMsBase: () => 1520,
		steps: () => FRAMES.length,
		speed: () => speed,
	});
	const frame = $derived(
		FRAMES[reducedMotion || phaseController.phase === "idle" ? 0 : steppedCycle.current] ??
			FRAMES[0]!
	);
	const activePatternIndexes = $derived(new Set(getPatternIndexes(pattern)));
	const cells = $derived.by(() =>
		buildHexCells(
			activePatternIndexes,
			(cell) => {
				const tone = frame[cell.id];
				return tone === "x" ? HIGH_OPACITY : tone === "o" ? MID_OPACITY : BASE_OPACITY;
			},
			() => ({ transition: "opacity 170ms ease-out" })
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
