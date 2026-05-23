<script lang="ts">
	import DotMatrixBase from "$lib/components/dot-matrix/dot-matrix-base.svelte";
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

	export type Triangle1Props = DotMatrixCommonProps;

	const STEP_COUNT = 30;
	const BASE_OPACITY = 0.08;
	const CENTER_OPACITY = 0.24;
	const CENTER_ROW = 3;
	const CENTER_COL = 3;
	const TAIL_LEVELS = [0.96, 0.72, 0.52, 0.34, 0.2] as const;
	const PERIMETER_PATH = [
		[1, 3],
		[2, 2],
		[3, 1],
		[4, 0],
		[4, 2],
		[4, 4],
		[4, 6],
		[3, 5],
		[2, 4],
	] as const satisfies ReadonlyArray<readonly [number, number]>;

	let {
		onmouseenter,
		onmouseleave,
		speed = 1,
		animated = true,
		hoverAnimated = false,
		size = 30,
		dotSize = 6,
		...restProps
	}: Triangle1Props = $props();

	const reducedMotionQuery = createReducedMotionQuery();
	const reducedMotion = $derived(reducedMotionQuery.current);
	const phaseController = createDotMatrixPhaseController({
		animated: () => Boolean(animated && !reducedMotion),
		hoverAnimated: () => Boolean(hoverAnimated && !reducedMotion),
		speed: () => speed,
	});

	const step = createSteppedCycle({
		active: () => !reducedMotion && phaseController.phase !== "idle",
		cycleMsBase: () => 1650,
		steps: () => STEP_COUNT,
		speed: () => speed,
	});

	const animationResolver = $derived.by((): DotAnimationResolver => {
		const frame = reducedMotion ? 0 : step.current;

		return ({ isActive, row, col, phase }) => {
			if (!isActive || !isWithinTriangleMask(row, col)) {
				return { className: "dmx-inactive" };
			}

			const currentFrame = phase === "idle" ? 0 : frame;
			let opacity = BASE_OPACITY;

			if (row === CENTER_ROW && col === CENTER_COL) {
				opacity = CENTER_OPACITY;
			}

			const head =
				Math.floor((currentFrame / STEP_COUNT) * PERIMETER_PATH.length) %
				PERIMETER_PATH.length;

			for (let trail = 0; trail < TAIL_LEVELS.length; trail += 1) {
				const idx = (head - trail + PERIMETER_PATH.length) % PERIMETER_PATH.length;
				const [pathRow, pathCol] = PERIMETER_PATH[idx]!;
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

<DotMatrixBase
	{speed}
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
