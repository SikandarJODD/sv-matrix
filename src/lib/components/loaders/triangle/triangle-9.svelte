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
		TRIANGLE_COORDS,
		isWithinTriangleMask,
	} from "./shared.js";

	export type Triangle9Props = DotMatrixCommonProps;

	const BASE_OPACITY = 0.14;
	const HIGH_OPACITY = 0.96;
	const DELTAS_8 = [
		[-1, -1],
		[-1, 0],
		[-1, 1],
		[0, -1],
		[0, 1],
		[1, -1],
		[1, 0],
		[1, 1],
	] as const satisfies ReadonlyArray<readonly [number, number]>;

	function buildBfsRingFromCenter(): Map<string, number> {
		const dist = new Map<string, number>();
		const start = "3,3";
		if (!TRIANGLE_COORDS.some(([row, col]) => row === 3 && col === 3)) {
			return dist;
		}

		const queue: Array<[number, number]> = [[3, 3]];
		dist.set(start, 0);
		let head = 0;

		while (head < queue.length) {
			const [row, col] = queue[head]!;
			head += 1;
			const current = dist.get(`${row},${col}`)!;

			for (const [dRow, dCol] of DELTAS_8) {
				const nextRow = row + dRow;
				const nextCol = col + dCol;
				const key = `${nextRow},${nextCol}`;
				if (isWithinTriangleMask(nextRow, nextCol) && !dist.has(key)) {
					dist.set(key, current + 1);
					queue.push([nextRow, nextCol]);
				}
			}
		}

		return dist;
	}

	const BFS_RING = buildBfsRingFromCenter();
	const MAX_RING = Math.max(0, ...BFS_RING.values());

	function smoothstep01(edge0: number, edge1: number, x: number): number {
		if (edge1 <= edge0) {
			return x >= edge1 ? 1 : 0;
		}

		const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
		return t * t * (3 - 2 * t);
	}

	function opacityForCell(row: number, col: number, phase: number): number {
		const ring = BFS_RING.get(`${row},${col}`) ?? 0;
		const span = Math.max(1, MAX_RING);
		const t = phase * Math.PI * 2;
		const u = (ring / span) * Math.PI * 2 - t;
		const wave = 0.5 + 0.5 * Math.cos(u);
		const crest = smoothstep01(0.35, 1, wave);
		return Math.min(HIGH_OPACITY, BASE_OPACITY + crest * (HIGH_OPACITY - BASE_OPACITY));
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
	}: Triangle9Props = $props();

	const reducedMotionQuery = createReducedMotionQuery();
	const reducedMotion = $derived(reducedMotionQuery.current);
	const phaseController = createDotMatrixPhaseController({
		animated: () => Boolean(animated && !reducedMotion),
		hoverAnimated: () => Boolean(hoverAnimated && !reducedMotion),
		speed: () => speed,
	});

	const cycleProgress = createCycleProgress({
		active: () => !reducedMotion && phaseController.phase !== "idle",
		cycleMsBase: () => 1800,
		speed: () => speed,
	});

	const animationResolver = $derived.by((): DotAnimationResolver => {
		const currentPhase =
			reducedMotion || phaseController.phase === "idle" ? 0.18 : cycleProgress.current;

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
