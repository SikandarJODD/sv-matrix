<script lang="ts">
	import DotMatrixBase from "$lib/components/dot-matrix/dot-matrix-base.svelte";
	import type {
		DotAnimationResolver,
		DotMatrixCommonProps,
	} from "$lib/components/dot-matrix/types.js";
	import {
		createDotMatrixPhaseController,
		createReducedMotionQuery,
	} from "$lib/hooks/dot-matrix/index.js";

	export type Square12Props = DotMatrixCommonProps;

	const ORIGIN_ROW = 1;
	const ORIGIN_COL = 1;
	const MAX_MANHATTAN = 6;

	const animationResolver: DotAnimationResolver = ({
		isActive,
		row,
		col,
		reducedMotion,
		phase,
	}) => {
		if (!isActive) {
			return { className: "dmx-inactive" };
		}

		const ring = Math.max(
			0,
			Math.min(MAX_MANHATTAN, Math.abs(row - ORIGIN_ROW) + Math.abs(col - ORIGIN_COL))
		);

		const style = {
			"--dmx-center-ripple-ring": ring,
		};

		if (reducedMotion || phase === "idle") {
			return {
				style: {
					...style,
					opacity: 0.2 + (1 - ring / MAX_MANHATTAN) * 0.75,
				},
			};
		}

		return { className: "dmx-center-origin-ripple", style };
	};

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
	}: Square12Props = $props();

	const reducedMotionQuery = createReducedMotionQuery();
	const reducedMotion = $derived(reducedMotionQuery.current);
	const phaseController = createDotMatrixPhaseController({
		animated: () => Boolean(animated && !reducedMotion),
		hoverAnimated: () => Boolean(hoverAnimated && !reducedMotion),
		speed: () => speed,
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
