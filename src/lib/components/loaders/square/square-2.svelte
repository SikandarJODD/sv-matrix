<script lang="ts">
	import DotMatrixBase from "$lib/components/dot-matrix/dot-matrix-base.svelte";
	import { MATRIX_SIZE, rowMajorIndex } from "$lib/components/dot-matrix/geometry.js";
	import type {
		DotAnimationResolver,
		DotMatrixCommonProps,
	} from "$lib/components/dot-matrix/types.js";
	import {
		createDotMatrixPhaseController,
		createReducedMotionQuery,
		createSteppedCycle,
	} from "$lib/hooks/dot-matrix/index.js";

	export type SquareTwoProps = DotMatrixCommonProps;

	const CELL_COUNT = MATRIX_SIZE * MATRIX_SIZE;
	const SNAKE_TAIL = [1, 0.82, 0.68, 0.54, 0.42, 0.31, 0.22, 0.14] as const;
	const BASE_OPACITY = 0.08;
	const EMPTY_VISITS: readonly number[] = [];

	function buildRowCyclePath(): number[] {
		const path: number[] = [];
		const push = (row: number, col: number) => path.push(rowMajorIndex(row, col));

		for (let row = 4; row >= 0; row -= 1) push(row, 0);
		push(0, 1);
		push(0, 2);
		for (let row = 1; row <= 4; row += 1) push(row, 2);
		push(4, 1);
		for (let row = 3; row >= 0; row -= 1) push(row, 1);
		push(0, 2);
		push(0, 3);
		for (let row = 1; row <= 4; row += 1) push(row, 3);
		push(4, 2);
		for (let row = 3; row >= 0; row -= 1) push(row, 2);
		push(0, 3);
		push(0, 4);
		for (let row = 1; row <= 4; row += 1) push(row, 4);

		return path;
	}

	function buildVisitsByIndex(route: readonly number[]): Array<readonly number[]> {
		const visits = Array.from({ length: CELL_COUNT }, () => [] as number[]);

		for (let step = 0; step < route.length; step += 1) {
			visits[route[step]!]!.push(step);
		}

		return visits;
	}

	const ROW_CYCLE_PATH = buildRowCyclePath();
	const ROW_CYCLE_LENGTH = ROW_CYCLE_PATH.length;
	const ROW_CYCLE_VISITS = buildVisitsByIndex(ROW_CYCLE_PATH);

	let {
		onmouseenter,
		onmouseleave,
		speed = 1,
		pattern = "full",
		animated = true,
		hoverAnimated = false,
		size = 29,
		dotSize = 5,
		...restProps
	}: SquareTwoProps = $props();

	const reducedMotionQuery = createReducedMotionQuery();
	const reducedMotion = $derived(reducedMotionQuery.current);
	const phaseController = createDotMatrixPhaseController({
		animated: () => Boolean(animated && !reducedMotion),
		hoverAnimated: () => Boolean(hoverAnimated && !reducedMotion),
		speed: () => speed,
	});

	const headCycle = createSteppedCycle({
		active: () => !reducedMotion && phaseController.phase !== "idle" && ROW_CYCLE_LENGTH > 0,
		cycleMsBase: () => 1500,
		steps: () => ROW_CYCLE_LENGTH,
		speed: () => speed,
	});

	const animationResolver = $derived.by((): DotAnimationResolver => {
		const head = headCycle.current;

		return ({ isActive, index }) => {
			if (!isActive) {
				return { className: "dmx-inactive" };
			}

			if (ROW_CYCLE_LENGTH <= 0) {
				return { style: { opacity: BASE_OPACITY } };
			}

			const visits = ROW_CYCLE_VISITS[index] ?? EMPTY_VISITS;
			let opacity = BASE_OPACITY;

			for (const stepIndex of visits) {
				const distance = (head - stepIndex + ROW_CYCLE_LENGTH) % ROW_CYCLE_LENGTH;
				if (distance >= 0 && distance < SNAKE_TAIL.length) {
					opacity = Math.max(opacity, SNAKE_TAIL[distance]!);
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
	{pattern}
	{animated}
	{hoverAnimated}
	{size}
	{dotSize}
	phase={phaseController.phase}
	{reducedMotion}
	{animationResolver}
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
	{...restProps}
/>
