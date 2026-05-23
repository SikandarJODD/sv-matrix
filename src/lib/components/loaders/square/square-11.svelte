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

	export type Square11Props = DotMatrixCommonProps;

	const animationResolver: DotAnimationResolver = ({
		isActive,
		manhattanDistance,
		reducedMotion,
		phase,
	}) => {
		if (!isActive) {
			return { className: "dmx-inactive" };
		}

		const ring = Math.max(0, Math.min(4, manhattanDistance));
		const style = {
			"--dmx-ripple-ring": ring,
			"--dmx-ripple-parity": ring % 2,
		};

		if (reducedMotion || phase === "idle") {
			return {
				style: {
					...style,
					opacity: 0.2 + (1 - ring / 4) * 0.72,
				},
			};
		}

		return { className: "dmx-ripple-echo", style };
	};

	let {
		onmouseenter,
		onmouseleave,
		speed = 1.25,
		pattern = "full",
		animated = true,
		hoverAnimated = false,
		size = 29,
		dotSize = 5,
		...restProps
	}: Square11Props = $props();

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
