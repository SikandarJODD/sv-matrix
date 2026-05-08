<script lang="ts">
	import DotMatrixBase from "$lib/components/dot-matrix/dot-matrix-base.svelte";
	import { trBlPathNormFromIndex } from "$lib/components/dot-matrix/geometry.js";
	import type {
		DotAnimationResolver,
		DotMatrixCommonProps,
	} from "$lib/components/dot-matrix/types.js";
	import {
		createDotMatrixPhaseController,
		createReducedMotionQuery,
	} from "$lib/hooks/dot-matrix/index.js";

	export type SquareOneProps = DotMatrixCommonProps;

	const animationResolver: DotAnimationResolver = ({
		isActive,
		index,
		row,
		col,
		reducedMotion,
		phase,
	}) => {
		if (!isActive) {
			return { className: "dmx-inactive" };
		}

		const path = trBlPathNormFromIndex(index);
		const slice = row + (4 - col);
		const parity = slice % 2;
		const style = {
			"--dmx-path": path,
			"--dmx-diagonal-parity": parity,
		};

		if (reducedMotion || phase === "idle") {
			return {
				style: {
					...style,
					opacity: parity === 0 ? 0.88 : 0.14,
				},
			};
		}

		return { className: "dmx-diagonal-alt-sweep", style };
	};

	let {
		onmouseenter,
		onmouseleave,
		speed = 1.1,
		pattern = "full",
		animated = true,
		hoverAnimated = false,
		size = 29,
		dotSize = 5,
		...restProps
	}: SquareOneProps = $props();

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
