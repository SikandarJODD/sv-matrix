<script lang="ts">
	import { cn } from "$lib/utils.js";

	import {
		MATRIX_SIZE,
		distanceFromCenter,
		indexToCoord,
		manhattanDistance,
		normalizedRadius,
		polarAngle,
	} from "./geometry.js";
	import { getMatrixLayout, resolveBoxLayout, styleEntriesToString, stylePx } from "./layout.js";
	import {
		clampUnitInterval,
		getBloomHaloSpreadClass,
		getDotBloomParts,
		isBloomRootActive,
		remapOpacityToTriplet,
	} from "./opacity.js";
	import { getPatternIndexes } from "./patterns.js";
	import type {
		DotAnimationResolver,
		DotMatrixCommonProps,
		DotMatrixPhase,
	} from "./types.js";

	import "$lib/styles/dot-matrix.css";

	interface DotMatrixBaseProps extends DotMatrixCommonProps {
		phase?: DotMatrixPhase;
		reducedMotion?: boolean;
		animationResolver?: DotAnimationResolver;
	}

	function mergeStyles(...styles: Array<string | undefined>): string | undefined {
		const tokens = styles.filter(Boolean);
		return tokens.length > 0 ? tokens.join("; ") : undefined;
	}

	function normalizeStyle(style: string | null | undefined): string | undefined {
		return style ?? undefined;
	}

	let {
		ref = $bindable(null),
		class: className,
		style: userStyle,
		role = "status",
		"aria-live": ariaLive = "polite",
		"aria-label": ariaLabel = "Loading",
		onmouseenter,
		onmouseleave,
		size = 24,
		dotSize = 3,
		color = "currentColor",
		speed = 1,
		pattern = 'diamond',
		muted = false,
		bloom = false,
		halo = 0,
		dotClass = undefined,
		opacityBase = undefined,
		opacityMid = undefined,
		opacityPeak = undefined,
		cellPadding = undefined,
		boxSize = undefined,
		minSize = undefined,
		phase = "idle",
		reducedMotion = false,
		animationResolver = undefined,
		animated = undefined,
		hoverAnimated = undefined,
		...restProps
	}: DotMatrixBaseProps = $props();

	const safeSpeed = $derived(speed > 0 ? speed : 1);
	const speedScale = $derived(1 / safeSpeed);
	const patternIndexes = $derived(new Set(getPatternIndexes(pattern)));
	const matrixLayout = $derived(getMatrixLayout(size, dotSize, cellPadding));
	const boxLayout = $derived(resolveBoxLayout({ boxSize, minSize }));
	const scale = $derived(
		boxLayout.useWrapper && matrixLayout.matrixSpan > 0
			? boxLayout.outerDim / matrixLayout.matrixSpan
			: 1,
	);
	const baseOpacity = $derived(clampUnitInterval(opacityBase));
	const midOpacity = $derived(clampUnitInterval(opacityMid));
	const peakOpacity = $derived(clampUnitInterval(opacityPeak));
	const unit = $derived(dotSize + matrixLayout.gap);

	const matrixClass = $derived(
		cn(
			"dmx-root",
			muted && "dmx-muted",
			isBloomRootActive(bloom, halo) && "dmx-bloom",
			getBloomHaloSpreadClass(halo),
			!boxLayout.useWrapper && className,
		),
	);

	const rootStyle = $derived.by(() =>
		mergeStyles(
			styleEntriesToString({
				width: stylePx(matrixLayout.matrixSpan),
				height: stylePx(matrixLayout.matrixSpan),
				"--dmx-speed": speedScale,
				"--dmx-dot-size": stylePx(dotSize),
				color,
				...(baseOpacity !== undefined && { "--dmx-opacity-base": baseOpacity }),
				...(midOpacity !== undefined && { "--dmx-opacity-mid": midOpacity }),
				...(peakOpacity !== undefined && { "--dmx-opacity-peak": peakOpacity }),
				...(boxLayout.useWrapper
					? {
							transform: `scale(${scale})`,
							"transform-origin": "center center",
						}
					: {
							"min-width": minSize != null ? stylePx(minSize) : undefined,
							"min-height": minSize != null ? stylePx(minSize) : undefined,
						}),
			}),
			!boxLayout.useWrapper ? normalizeStyle(userStyle) : undefined,
		),
	);

	const wrapperStyle = $derived.by(() =>
		mergeStyles(
			styleEntriesToString({
				display: "inline-flex",
				"align-items": "center",
				"justify-content": "center",
				width: stylePx(boxLayout.outerDim),
				height: stylePx(boxLayout.outerDim),
				"min-width": minSize != null ? stylePx(minSize) : undefined,
				"min-height": minSize != null ? stylePx(minSize) : undefined,
				overflow: "hidden",
			}),
			boxLayout.useWrapper ? normalizeStyle(userStyle) : undefined,
		),
	);

	const gridStyle = $derived(
		styleEntriesToString({
			gap: stylePx(matrixLayout.gap),
		}),
	);

	const dots = $derived.by(() => {
		const items: Array<{ index: number; className: string; style: string | undefined }> = [];

		for (let index = 0; index < MATRIX_SIZE * MATRIX_SIZE; index += 1) {
			const { row, col } = indexToCoord(index);
			const isActive = patternIndexes.has(index);
			const distance = distanceFromCenter(index);
			const angle = polarAngle(index);
			const radius = normalizedRadius(index);
			const manhattan = manhattanDistance(index);
			const deltaX = (col - Math.floor(MATRIX_SIZE / 2)) * unit;
			const deltaY = (row - Math.floor(MATRIX_SIZE / 2)) * unit;
			const animationState = animationResolver
				? animationResolver({
						index,
						row,
						col,
						distanceFromCenter: distance,
						angleFromCenter: angle,
						radiusNormalized: radius,
						manhattanDistance: manhattan,
						phase,
						isActive,
						reducedMotion,
					})
				: {};

			const stylePatch = animationState.style ? { ...animationState.style } : {};
			let isBloomDot = false;

			if (isActive) {
				const rawOpacity =
					typeof stylePatch.opacity === "number" ? stylePatch.opacity : undefined;

				if (rawOpacity !== undefined) {
					stylePatch.opacity = remapOpacityToTriplet(
						rawOpacity,
						baseOpacity,
						midOpacity,
						peakOpacity,
					);

					const bloomParts = getDotBloomParts(
						true,
						rawOpacity,
						bloom,
						halo,
						baseOpacity,
						midOpacity,
						peakOpacity,
					);

					stylePatch["--dmx-bloom-level"] = bloomParts.level;
					isBloomDot = bloomParts.bloomDot;
				} else {
					const bloomParts = getDotBloomParts(
						true,
						0,
						bloom,
						halo,
						baseOpacity,
						midOpacity,
						peakOpacity,
					);

					if (bloomParts.level > 0) {
						stylePatch["--dmx-bloom-level"] = bloomParts.level;
					}

					isBloomDot = bloomParts.bloomDot;
				}
			}

			const dotStyle = styleEntriesToString({
				width: stylePx(dotSize),
				height: stylePx(dotSize),
				"--dmx-distance": distance,
				"--dmx-row": row,
				"--dmx-col": col,
				"--dmx-x": stylePx(deltaX),
				"--dmx-y": stylePx(deltaY),
				"--dmx-angle": angle,
				"--dmx-radius": radius,
				"--dmx-manhattan": manhattan,
				...stylePatch,
				...(!isActive
					? {
							opacity: 0,
							visibility: "hidden",
							"pointer-events": "none",
							animation: "none",
						}
					: {}),
			});

			items.push({
				index,
				className: cn(
					"dmx-dot",
					!isActive && "dmx-inactive",
					isBloomDot && "dmx-bloom-dot",
					dotClass,
					animationState.className,
				),
				style: dotStyle,
			});
		}

		return items;
	});
</script>

{#if boxLayout.useWrapper}
	<div
		bind:this={ref}
		{role}
		aria-live={ariaLive}
		aria-label={ariaLabel}
		class={className}
		style={wrapperStyle}
		{onmouseenter}
		{onmouseleave}
		{...restProps}
	>
		<div class={matrixClass} style={rootStyle}>
			<div class="dmx-grid" style={gridStyle}>
				{#each dots as dot (dot.index)}
					<span aria-hidden="true" class={dot.className} style={dot.style}></span>
				{/each}
			</div>
		</div>
	</div>
{:else}
	<div
		bind:this={ref}
		{role}
		aria-live={ariaLive}
		aria-label={ariaLabel}
		class={matrixClass}
		style={rootStyle}
		{onmouseenter}
		{onmouseleave}
		{...restProps}
	>
		<div class="dmx-grid" style={gridStyle}>
			{#each dots as dot (dot.index)}
				<span aria-hidden="true" class={dot.className} style={dot.style}></span>
			{/each}
		</div>
	</div>
{/if}
