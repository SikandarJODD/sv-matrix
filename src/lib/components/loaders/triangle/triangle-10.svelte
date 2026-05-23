<script lang="ts">
	import TriangleMatrixBase from "./triangle-base.svelte";
	import type {
		DotAnimationResolver,
		DotMatrixCommonProps,
	} from "$lib/components/dot-matrix/types.js";
	import {
		createDotMatrixPhaseController,
		createReducedMotionQuery,
		createSteppedCycle,
	} from "$lib/hooks/dot-matrix/index.js";

	import {
		TRIANGLE_ACTIVE_INDEXES,
		TRIANGLE_MATRIX_SIZE,
		isWithinTriangleMask,
	} from "./shared.js";

	export type Triangle10Props = DotMatrixCommonProps;

	const STEP_COUNT = 36;
	const BASE_OPACITY = 0.07;
	const TAIL_LEVELS = [0.94, 0.68, 0.42, 0.24] as const;
	const COLUMN_RAKE_PATH = [
		[4, 0],
		[3, 1],
		[4, 2],
		[2, 2],
		[3, 3],
		[1, 3],
		[4, 4],
		[2, 4],
		[4, 6],
		[3, 5],
	] as const satisfies ReadonlyArray<readonly [number, number]>;

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
	}: Triangle10Props = $props();

	const reducedMotionQuery = createReducedMotionQuery();
	const reducedMotion = $derived(reducedMotionQuery.current);
	const phaseController = createDotMatrixPhaseController({
		animated: () => Boolean(animated && !reducedMotion),
		hoverAnimated: () => Boolean(hoverAnimated && !reducedMotion),
		speed: () => speed,
	});

	const step = createSteppedCycle({
		active: () => !reducedMotion && phaseController.phase !== "idle",
		cycleMsBase: () => 1750,
		steps: () => STEP_COUNT,
		speed: () => speed,
	});

	const animationResolver = $derived.by((): DotAnimationResolver => {
		const frame = reducedMotion ? 0 : step.current;
		const pathLen = COLUMN_RAKE_PATH.length;
		const head =
			Math.floor(((phaseController.phase === "idle" ? 0 : frame) / STEP_COUNT) * pathLen) %
			pathLen;

		return ({ isActive, row, col }) => {
			if (!isActive || !isWithinTriangleMask(row, col)) {
				return { className: "dmx-inactive" };
			}

			let opacity = BASE_OPACITY;

			for (let trail = 0; trail < TAIL_LEVELS.length; trail += 1) {
				const idx = (head - trail + pathLen) % pathLen;
				const [pathRow, pathCol] = COLUMN_RAKE_PATH[idx]!;
				if (row === pathRow && col === pathCol) {
					opacity = Math.max(opacity, TAIL_LEVELS[trail]!);
					break;
				}
			}

			return { style: { opacity } };
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
