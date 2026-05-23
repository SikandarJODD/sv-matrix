<script lang="ts">
	import CircleMatrixBase from "./circle-base.svelte";
	import { isWithinCircularMask } from "$lib/components/dot-matrix/geometry.js";
	import type {
		DotAnimationResolver,
		DotMatrixCommonProps,
	} from "$lib/components/dot-matrix/types.js";
	import {
		createCycleProgress,
		createDotMatrixPhaseController,
		createReducedMotionQuery,
	} from "$lib/hooks/dot-matrix/index.js";

	export type Circle15Props = DotMatrixCommonProps;

	const BASE_OPACITY = 0.07;
	const MID_OPACITY = 0.34;
	const HIGH_OPACITY = 0.95;

	const BRAILLE_PHASES: ReadonlyArray<ReadonlySet<string>> = [
		new Set(["1,1", "2,1", "3,1", "1,3", "2,3", "3,3"]),
		new Set(["1,1", "2,1", "3,1", "2,2", "1,3", "2,3", "3,3"]),
		new Set(["1,1", "1,2", "1,3", "2,1", "2,3", "3,1", "3,2", "3,3"]),
		new Set(["1,1", "3,1", "2,2", "1,3", "3,3"]),
		new Set(["2,1", "1,2", "3,2", "2,3"]),
		new Set(["1,1", "2,1", "2,2", "2,3", "3,3"]),
	];

	let {
		onmouseenter,
		onmouseleave,
		speed = 1,
		pattern = "full",
		animated = true,
		hoverAnimated = false,
		...restProps
	}: Circle15Props = $props();

	const reducedMotionQuery = createReducedMotionQuery();
	const reducedMotion = $derived(reducedMotionQuery.current);
	const phaseController = createDotMatrixPhaseController({
		animated: () => Boolean(animated && !reducedMotion),
		hoverAnimated: () => Boolean(hoverAnimated && !reducedMotion),
		speed: () => speed,
	});

	const cycleProgress = createCycleProgress({
		active: () => !reducedMotion && phaseController.phase !== "idle",
		cycleMsBase: () => 1680,
		speed: () => speed,
	});

	const animationResolver = $derived.by((): DotAnimationResolver => {
		const animProgress = cycleProgress.current;
		const motionDisabled = reducedMotion;

		return ({ isActive, row, col, phase }) => {
			if (!isActive || !isWithinCircularMask(row, col)) {
				return { className: "dmx-inactive" };
			}

			const x = col - 2;
			const y = row - 2;
			const ring = Math.sqrt(x * x + y * y);
			const count = BRAILLE_PHASES.length;
			const phaseIndex =
				motionDisabled || phase === "idle"
					? 0
					: (() => {
							const raw = Math.floor(animProgress * count);
							return ((raw % count) + count) % count;
						})();
			const activePattern = BRAILLE_PHASES[phaseIndex];
			const key = `${row},${col}`;
			const inPattern = activePattern?.has(key) ?? false;
			const previousIndex = (phaseIndex + BRAILLE_PHASES.length - 1) % BRAILLE_PHASES.length;
			const inPrevPattern = BRAILLE_PHASES[previousIndex]?.has(key) ?? false;

			let opacity = BASE_OPACITY;

			if (inPattern) {
				opacity = HIGH_OPACITY;
			} else if (inPrevPattern) {
				opacity = MID_OPACITY;
			} else if (ring < 1.1) {
				opacity = 0.2;
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

<CircleMatrixBase
	{speed}
	{pattern}
	{animated}
	{hoverAnimated}
	phase={phaseController.phase}
	{reducedMotion}
	{animationResolver}
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
	{...restProps}
/>
