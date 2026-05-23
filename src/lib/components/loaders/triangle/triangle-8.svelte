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

	export type Triangle8Props = DotMatrixCommonProps;

	const BASE_OPACITY = 0.05;
	const MID_OPACITY = 0.42;
	const HIGH_OPACITY = 0.96;
	const LEFT_WING = new Set(["2,2", "3,1", "4,0", "4,2"]);
	const RIGHT_WING = new Set(["2,4", "3,5", "4,4", "4,6"]);

	type Sector = "left" | "right" | "spine" | "none";

	function sectorForCell(row: number, col: number): Sector {
		const key = `${row},${col}`;
		if ((row === 1 || row === 3) && col === 3) return "spine";
		if (LEFT_WING.has(key)) return "left";
		if (RIGHT_WING.has(key)) return "right";
		return "none";
	}

	function opacityForCell(row: number, col: number, phase: number): number {
		const p = 0.5 - 0.5 * Math.cos(phase * Math.PI * 2);
		const leftLift = p * p;
		const rightLift = (1 - p) * (1 - p);
		const crossover = Math.max(0, 1 - 4 * (p - 0.5) * (p - 0.5));
		const sector = sectorForCell(row, col);

		if (sector === "none") return 0;
		if (sector === "spine") {
			if (row === 1 && col === 3) {
				return Math.min(
					HIGH_OPACITY,
					MID_OPACITY + crossover * (HIGH_OPACITY - MID_OPACITY) * 0.95
				);
			}

			const hub =
				BASE_OPACITY +
				crossover * 0.55 * (HIGH_OPACITY - BASE_OPACITY) +
				leftLift * 0.08 +
				rightLift * 0.08;
			return Math.min(HIGH_OPACITY, hub);
		}

		if (sector === "left") {
			return Math.min(HIGH_OPACITY, BASE_OPACITY + leftLift * (HIGH_OPACITY - BASE_OPACITY));
		}

		return Math.min(HIGH_OPACITY, BASE_OPACITY + rightLift * (HIGH_OPACITY - BASE_OPACITY));
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
	}: Triangle8Props = $props();

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

	const animationResolver = $derived.by((): DotAnimationResolver => {
		const currentPhase =
			reducedMotion || phaseController.phase === "idle" ? 0.25 : cycleProgress.current;

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
