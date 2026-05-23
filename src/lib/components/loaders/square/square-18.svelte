<script lang="ts">
	import DotMatrixBase from "$lib/components/dot-matrix/dot-matrix-base.svelte";
	import type {
		DotAnimationResolver,
		DotMatrixCommonProps,
	} from "$lib/components/dot-matrix/types.js";
	import {
		createCycleProgress,
		createDotMatrixPhaseController,
		createReducedMotionQuery,
	} from "$lib/hooks/dot-matrix/index.js";

	export type Square18Props = DotMatrixCommonProps;

	const BASE_OPACITY = 0.08;
	const LIT_OPACITY = 0.94;
	const CAP_OPACITY = 1;
	const STEP_COUNT = 24;
	const MAX_LEVEL = 5;

	function clampLevel(value: number): number {
		return Math.max(1, Math.min(MAX_LEVEL, Math.round(value)));
	}

	let {
		onmouseenter,
		onmouseleave,
		speed = 1.35,
		pattern = "full",
		animated = true,
		hoverAnimated = false,
		size = 29,
		dotSize = 5,
		...restProps
	}: Square18Props = $props();

	const reducedMotionQuery = createReducedMotionQuery();
	const reducedMotion = $derived(reducedMotionQuery.current);
	const phaseController = createDotMatrixPhaseController({
		animated: () => Boolean(animated && !reducedMotion),
		hoverAnimated: () => Boolean(hoverAnimated && !reducedMotion),
		speed: () => speed,
	});

	const cycleProgress = createCycleProgress({
		active: () => !reducedMotion && phaseController.phase !== "idle",
		cycleMsBase: () => 1750,
		speed: () => speed,
	});

	const animationResolver = $derived.by((): DotAnimationResolver => {
		const animPhase = cycleProgress.current;
		const motionDisabled = reducedMotion;

		return ({ isActive, row, col, phase }) => {
			if (!isActive) {
				return { className: "dmx-inactive" };
			}

			const progress = motionDisabled || phase === "idle" ? 0 : animPhase * STEP_COUNT;
			const colPhase = progress * 0.52 + col * 1.15;
			const level = clampLevel(1 + ((Math.sin(colPhase) + 1) / 2) * (MAX_LEVEL - 1));
			const topLitRow = MAX_LEVEL - level;

			if (row > topLitRow) {
				return { style: { opacity: LIT_OPACITY } };
			}

			if (row === topLitRow) {
				return { style: { opacity: CAP_OPACITY } };
			}

			return { style: { opacity: BASE_OPACITY } };
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
