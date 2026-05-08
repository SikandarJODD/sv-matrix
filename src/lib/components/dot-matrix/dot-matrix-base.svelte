<script lang="ts">
	import clsx from "clsx";
	import type { ClassValue } from "svelte/elements";
	import { MATRIX_SIZE } from "./geometry.js";
	import { getMatrixLayout, resolveBoxLayout, styleEntriesToString, stylePx } from "./layout.js";
	import {
		clampUnitInterval,
		getBloomHaloSpreadClass,
		getDotBloomParts,
		isBloomRootActive,
		remapOpacityToTriplet,
	} from "./opacity.js";
	import { getPatternIndexes } from "./patterns.js";
	import type { DotAnimationResolver, DotMatrixCommonProps, DotMatrixPhase } from "./types.js";

	import "$lib/styles/dot-matrix.css";

	interface DotMatrixBaseProps extends DotMatrixCommonProps {
		gridSize?: number;
		activeIndexes?: Iterable<number>;
		phase?: DotMatrixPhase;
		reducedMotion?: boolean;
		animationResolver?: DotAnimationResolver;
	}

	function cn(...tokens: Array<ClassValue | boolean | null | undefined>): string {
		return clsx(tokens);
	}

	function mergeStyles(...styles: Array<string | undefined>): string | undefined {
		const tokens = styles.filter(Boolean);
		return tokens.length > 0 ? tokens.join("; ") : undefined;
	}

	function normalizeStyle(style: string | null | undefined): string | undefined {
		return style ?? undefined;
	}

	function indexToCoord(index: number, gridSize: number): { row: number; col: number } {
		return {
			row: Math.floor(index / gridSize),
			col: index % gridSize,
		};
	}

	function distanceFromCenter(row: number, col: number, center: number): number {
		return Math.hypot(row - center, col - center);
	}

	function polarAngle(row: number, col: number, center: number): number {
		return Math.atan2(row - center, col - center);
	}

	function normalizedRadius(distance: number, center: number): number {
		const maxRadius = Math.hypot(center, center);
		return maxRadius > 0 ? distance / maxRadius : 0;
	}

	function manhattanDistance(row: number, col: number, center: number): number {
		return Math.abs(row - center) + Math.abs(col - center);
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
		pattern = "diamond",
		gridSize = MATRIX_SIZE,
		activeIndexes = undefined,
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
	const safeGridSize = $derived(Math.max(1, Math.floor(gridSize)));
	const gridCenter = $derived(Math.floor(safeGridSize / 2));
	const totalCells = $derived(safeGridSize * safeGridSize);
	const patternIndexes = $derived(
		new Set(activeIndexes ? Array.from(activeIndexes) : getPatternIndexes(pattern))
	);
	const matrixLayout = $derived(getMatrixLayout(size, dotSize, cellPadding, safeGridSize));
	const boxLayout = $derived(resolveBoxLayout({ boxSize, minSize }));
	const scale = $derived(
		boxLayout.useWrapper && matrixLayout.matrixSpan > 0
			? boxLayout.outerDim / matrixLayout.matrixSpan
			: 1
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
			!boxLayout.useWrapper && className
		)
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
			!boxLayout.useWrapper ? normalizeStyle(userStyle) : undefined
		)
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
			boxLayout.useWrapper ? normalizeStyle(userStyle) : undefined
		)
	);

	const gridStyle = $derived(
		styleEntriesToString({
			gap: stylePx(matrixLayout.gap),
			"grid-template-columns": `repeat(${safeGridSize}, minmax(0, 1fr))`,
			"grid-template-rows": `repeat(${safeGridSize}, minmax(0, 1fr))`,
		})
	);

	const dots = $derived.by(() => {
		const items: Array<{ index: number; className: string; style: string | undefined }> = [];

		for (let index = 0; index < totalCells; index += 1) {
			const { row, col } = indexToCoord(index, safeGridSize);
			const isActive = patternIndexes.has(index);
			const distance = distanceFromCenter(row, col, gridCenter);
			const angle = polarAngle(row, col, gridCenter);
			const radius = normalizedRadius(distance, gridCenter);
			const manhattan = manhattanDistance(row, col, gridCenter);
			const deltaX = (col - gridCenter) * unit;
			const deltaY = (row - gridCenter) * unit;
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
						peakOpacity
					);

					const bloomParts = getDotBloomParts(
						true,
						rawOpacity,
						bloom,
						halo,
						baseOpacity,
						midOpacity,
						peakOpacity
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
						peakOpacity
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
					animationState.className
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
