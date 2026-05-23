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

	export type Square10Props = DotMatrixCommonProps;

	const ROWS = MATRIX_SIZE;
	const BASE_OPACITY = 0.08;
	const PEAK_OPACITY = 1;
	const DECAY = 0.72;
	const COL_WARP = 0.07;

	let {
		onmouseenter,
		onmouseleave,
		speed = 2.5,
		pattern = "full",
		animated = true,
		hoverAnimated = false,
		size = 29,
		dotSize = 5,
		...restProps
	}: Square10Props = $props();

	const reducedMotionQuery = createReducedMotionQuery();
	const reducedMotion = $derived(reducedMotionQuery.current);
	const phaseController = createDotMatrixPhaseController({
		animated: () => Boolean(animated && !reducedMotion),
		hoverAnimated: () => Boolean(hoverAnimated && !reducedMotion),
		speed: () => speed,
	});

	const scanRowCycle = createSteppedCycle({
		active: () => !reducedMotion && phaseController.phase !== "idle",
		cycleMsBase: () => 1500,
		steps: () => ROWS,
		speed: () => speed,
	});

	const animationResolver = $derived.by((): DotAnimationResolver => {
		const scanRow = scanRowCycle.current;
		const motionDisabled = reducedMotion;

		return ({ isActive, row, col, phase }) => {
			if (!isActive) {
				return { className: "dmx-inactive" };
			}

			if (motionDisabled || phase === "idle") {
				const falloff = (ROWS - 1 - row) / Math.max(1, ROWS - 1);
				return { style: { opacity: BASE_OPACITY + falloff * 0.38 } };
			}

			const colGain = 1 + COL_WARP * Math.sin(col * 1.72 + scanRow * 0.61);

			if (row > scanRow) {
				return { style: { opacity: BASE_OPACITY } };
			}

			const age = scanRow - row;
			const trail = Math.exp(-age * DECAY);
			const opacity = BASE_OPACITY + (PEAK_OPACITY - BASE_OPACITY) * trail * colGain;

			return {
				style: {
					opacity: Math.min(PEAK_OPACITY, opacity),
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
