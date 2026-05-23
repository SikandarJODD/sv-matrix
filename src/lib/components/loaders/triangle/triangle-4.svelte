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

	export type Triangle4Props = DotMatrixCommonProps;

	const STEP_COUNT = 28;
	const BASE_OPACITY = 0;
	const MID_OPACITY = 0;
	const TRAIL_LEVELS = [0.96, 0.52, 0.3] as const;
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
		pattern = "full",
		animated = true,
		hoverAnimated = false,
		size = 30,
		dotSize = 6,
		...restProps
	}: Triangle4Props = $props();

	const reducedMotionQuery = createReducedMotionQuery();
	const reducedMotion = $derived(reducedMotionQuery.current);
	const phaseController = createDotMatrixPhaseController({
		animated: () => Boolean(animated && !reducedMotion),
		hoverAnimated: () => Boolean(hoverAnimated && !reducedMotion),
		speed: () => speed,
	});

	const step = createSteppedCycle({
		active: () => !reducedMotion && phaseController.phase !== "idle",
		cycleMsBase: () => 1450,
		steps: () => STEP_COUNT,
		speed: () => speed,
	});

	const animationResolver = $derived.by((): DotAnimationResolver => {
		const frame = reducedMotion ? 0 : step.current;
		const segmentLength = Math.max(1, Math.floor(STEP_COUNT / 3));

		return ({ isActive, row, col, phase }) => {
			if (!isActive || !isWithinTriangleMask(row, col)) {
				return { className: "dmx-inactive" };
			}

			let opacity = row === 3 && col === 3 ? MID_OPACITY : BASE_OPACITY;
			const currentFrame = phase === "idle" ? 0 : frame;

			for (let headOffset = 0; headOffset < 3; headOffset += 1) {
				const spokeFrame = (currentFrame + headOffset * segmentLength) % STEP_COUNT;
				const head = Math.floor((spokeFrame / STEP_COUNT) * PERIMETER_PATH.length);

				for (let trail = 0; trail < TRAIL_LEVELS.length; trail += 1) {
					const idx = (head - trail + PERIMETER_PATH.length) % PERIMETER_PATH.length;
					const [pathRow, pathCol] = PERIMETER_PATH[idx]!;
					if (row === pathRow && col === pathCol) {
						opacity = Math.max(opacity, TRAIL_LEVELS[trail]!);
						break;
					}
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
