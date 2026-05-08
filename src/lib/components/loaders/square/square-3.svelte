<script lang="ts">
	import DotMatrixBase from "$lib/components/dot-matrix/dot-matrix-base.svelte";
	import {
		spiralInwardNormFromIndex,
		spiralInwardOrderValue,
	} from "$lib/components/dot-matrix/geometry.js";
	import type {
		DotAnimationResolver,
		DotMatrixCommonProps,
	} from "$lib/components/dot-matrix/types.js";
	import {
		createDotMatrixPhaseController,
		createReducedMotionQuery,
	} from "$lib/hooks/dot-matrix/index.js";

	export type SquareThreeProps = DotMatrixCommonProps;

	// Porting rule of thumb:
	// 1. Keep the wrapper thin.
	// 2. Move only the preset-specific math into the resolver.
	// 3. Reuse DotMatrixBase + shared hooks for phases and reduced motion.
	const animationResolver: DotAnimationResolver = ({ isActive, index, reducedMotion, phase }) => {
		if (!isActive) {
			return { className: "dmx-inactive" };
		}

		const order = spiralInwardOrderValue(index);
		const pathNorm = spiralInwardNormFromIndex(index);
		const style = {
			"--dmx-spiral-order": order,
		};

		if (reducedMotion || phase === "idle") {
			return {
				style: {
					...style,
					opacity: 0.16 + pathNorm * 0.78,
				},
			};
		}

		return { className: "dmx-spiral-snake", style };
	};

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
	}: SquareThreeProps = $props();

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
