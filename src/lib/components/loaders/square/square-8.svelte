<script lang="ts">
	import DotMatrixBase from "$lib/components/dot-matrix/dot-matrix-base.svelte";
	import { MATRIX_SIZE } from "$lib/components/dot-matrix/geometry.js";
	import type {
		DotAnimationResolver,
		DotMatrixCommonProps,
	} from "$lib/components/dot-matrix/types.js";
	import {
		createDotMatrixPhaseController,
		createReducedMotionQuery,
		createSteppedCycle,
	} from "$lib/hooks/dot-matrix/index.js";

	export type Square8Props = DotMatrixCommonProps;

	const ROWS = MATRIX_SIZE;
	const COLS = MATRIX_SIZE;
	const FILL_LAST = ROWS + COLS - 1;
	const BLINK_STEPS = 4;
	const BLINK_OPACITIES = [0.38, 1, 0.38, 1] as const;
	const DRAIN_LAST = FILL_LAST;
	const SEQUENCE_LEN = FILL_LAST + 1 + BLINK_STEPS + DRAIN_LAST + 1;
	const BASE_OPACITY = 0.08;
	const SETTLED_OPACITY = 0.52;
	const CAP_OPACITY = 1;

	function fillHeight(col: number, fillTick: number): number {
		return Math.max(0, Math.min(ROWS, fillTick - col));
	}

	function drainHeight(col: number, drainTick: number): number {
		return Math.max(0, Math.min(ROWS, ROWS - Math.max(0, drainTick - col)));
	}

	let {
		onmouseenter,
		onmouseleave,
		speed = 1.4,
		pattern = "full",
		animated = true,
		hoverAnimated = false,
		size = 29,
		dotSize = 5,
		...restProps
	}: Square8Props = $props();

	const reducedMotionQuery = createReducedMotionQuery();
	const reducedMotion = $derived(reducedMotionQuery.current);
	const phaseController = createDotMatrixPhaseController({
		animated: () => Boolean(animated && !reducedMotion),
		hoverAnimated: () => Boolean(hoverAnimated && !reducedMotion),
		speed: () => speed,
	});

	const stepCycle = createSteppedCycle({
		active: () => !reducedMotion && phaseController.phase !== "idle" && SEQUENCE_LEN > 0,
		cycleMsBase: () => 2000,
		steps: () => SEQUENCE_LEN,
		speed: () => speed,
	});

	const animationResolver = $derived.by((): DotAnimationResolver => {
		const step = stepCycle.current;
		const motionDisabled = reducedMotion;

		return ({ isActive, row, col, phase }) => {
			if (!isActive) {
				return { className: "dmx-inactive" };
			}

			if (motionDisabled || phase === "idle") {
				return { style: { opacity: BASE_OPACITY } };
			}

			let height = 0;
			let blinkOpacity: number | null = null;

			if (step <= FILL_LAST) {
				height = fillHeight(col, step);
			} else if (step < FILL_LAST + 1 + BLINK_STEPS) {
				height = ROWS;
				blinkOpacity = BLINK_OPACITIES[step - (FILL_LAST + 1)] ?? 1;
			} else {
				const drainTick = step - (FILL_LAST + 1 + BLINK_STEPS);
				height = drainHeight(col, drainTick);
			}

			const bottomRow = ROWS - 1;
			const topLitRow = ROWS - height;
			const isLit = height > 0 && row >= topLitRow && row <= bottomRow;

			if (!isLit) {
				return { style: { opacity: BASE_OPACITY } };
			}

			if (blinkOpacity !== null) {
				return { style: { opacity: blinkOpacity } };
			}

			const isCap = row === topLitRow && height > 0 && height < ROWS;
			return {
				style: {
					opacity: isCap ? CAP_OPACITY : SETTLED_OPACITY,
				},
			};
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
