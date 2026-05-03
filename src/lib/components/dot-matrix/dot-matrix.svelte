<script lang="ts">
	import DotMatrixBase from "./dot-matrix-base.svelte";
	import {
		createDotMatrixPhaseController,
		createReducedMotionQuery,
	} from "$lib/hooks/dot-matrix/index.js";

	import { getAnimationResolver } from "./animations.js";
	import type { DotMatrixProps } from "./types.js";

	let {
		onmouseenter,
		onmouseleave,
		animation = "path-wave",
		speed = 1,
		animated = true,
		hoverAnimated = false,
		...restProps
	}: DotMatrixProps = $props();

	const reducedMotionQuery = createReducedMotionQuery();
	const reducedMotion = $derived(reducedMotionQuery.current);
	const phaseController = createDotMatrixPhaseController({
		animated: () => Boolean(animated && animation !== "none" && !reducedMotion),
		hoverAnimated: () => Boolean(hoverAnimated && animation !== "none" && !reducedMotion),
		speed: () => speed,
	});

	const animationResolver = $derived(getAnimationResolver(animation));
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
	{...restProps}
	{speed}
	{animated}
	{hoverAnimated}
	phase={phaseController.phase}
	{reducedMotion}
	{animationResolver}
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
/>
