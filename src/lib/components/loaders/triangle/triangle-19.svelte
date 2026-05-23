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

	export type Triangle19Props = DotMatrixCommonProps;

	const BASE_OPACITY = 0.08;
	const MID_OPACITY = 0.38;
	const HIGH_OPACITY = 0.96;
	const CENTER_ROW = 3;
	const CENTER_COL = 3;
	const BEAM_SIGMA = 0.58;

	function angleDiff(a: number, b: number): number {
		let delta = a - b;
		while (delta > Math.PI) delta -= Math.PI * 2;
		while (delta < -Math.PI) delta += Math.PI * 2;
		return delta;
	}

	function smoothstep01(edge0: number, edge1: number, x: number): number {
		if (edge1 <= edge0) {
			return x >= edge1 ? 1 : 0;
		}

		const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
		return t * t * (3 - 2 * t);
	}

	function opacityForCell(row: number, col: number, phase: number): number {
		if (row === CENTER_ROW && col === CENTER_COL) {
			const hub = 0.5 + 0.5 * Math.sin(phase * Math.PI * 2);
			return MID_OPACITY + smoothstep01(0.12, 0.9, hub) * 0.22;
		}

		const t = phase * Math.PI * 2;
		const angle = Math.atan2(row - CENTER_ROW, col - CENTER_COL);
		const delta = angleDiff(angle, t);
		const beamRaw = Math.exp(-(delta * delta) / (BEAM_SIGMA * BEAM_SIGMA));
		const beam = smoothstep01(0.05, 0.98, beamRaw);
		const rim = 0.5 + 0.5 * Math.cos(angle * 2 - t * 1.15);
		const accent = smoothstep01(0.45, 0.92, rim) * 0.18;
		return Math.min(
			HIGH_OPACITY,
			BASE_OPACITY + (beam + accent) * (HIGH_OPACITY - BASE_OPACITY)
		);
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
	}: Triangle19Props = $props();

	const reducedMotionQuery = createReducedMotionQuery();
	const reducedMotion = $derived(reducedMotionQuery.current);
	const phaseController = createDotMatrixPhaseController({
		animated: () => Boolean(animated && !reducedMotion),
		hoverAnimated: () => Boolean(hoverAnimated && !reducedMotion),
		speed: () => speed,
	});

	const cycleProgress = createCycleProgress({
		active: () => !reducedMotion && phaseController.phase !== "idle",
		cycleMsBase: () => 1400,
		speed: () => speed,
	});

	const animationResolver = $derived.by((): DotAnimationResolver => {
		const currentPhase =
			reducedMotion || phaseController.phase === "idle" ? 0.12 : cycleProgress.current;

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
