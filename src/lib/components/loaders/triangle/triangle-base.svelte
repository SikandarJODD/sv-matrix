<script lang="ts">
	import clsx from "clsx";
	import type { ClassValue } from "svelte/elements";
	import { styleEntriesToString, stylePx } from "$lib/components/dot-matrix/layout.js";
	import {
		clampUnitInterval,
		getBloomHaloSpreadClass,
		getDotBloomParts,
		isBloomRootActive,
		remapOpacityToTriplet,
	} from "$lib/components/dot-matrix/opacity.js";
	import type {
		DotAnimationResolver,
		DotMatrixCommonProps,
		DotMatrixPhase,
	} from "$lib/components/dot-matrix/types.js";

	import {
		TRIANGLE_COORDS,
		TRIANGLE_MATRIX_SIZE,
		TRIANGLE_VISIBLE_ROW_COUNT,
		TRIANGLE_VISIBLE_ROW_START,
		triangleIndex,
	} from "./shared.js";

	import "$lib/styles/dot-matrix.css";

	interface TriangleMatrixBaseProps extends DotMatrixCommonProps {
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

	function manhattanDistance(row: number, col: number, center: number): number {
		return Math.abs(row - center) + Math.abs(col - center);
	}

	const TRIANGLE_ROW_GROUPS = Array.from({ length: TRIANGLE_VISIBLE_ROW_COUNT }, (_, index) => {
		const row = TRIANGLE_VISIBLE_ROW_START + index;
		return TRIANGLE_COORDS.filter(([coordRow]) => coordRow === row);
	});

	let {
		ref = $bindable(null),
		class: className,
		style: userStyle,
		role = "status",
		"aria-live": ariaLive = "polite",
		"aria-label": ariaLabel = "Loading",
		onmouseenter,
		onmouseleave,
		size = 34,
		dotSize = 6,
		color = "currentColor",
		speed = 1,
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
		activeIndexes = undefined,
		phase = "idle",
		reducedMotion = false,
		animationResolver = undefined,
		gridSize = TRIANGLE_MATRIX_SIZE,
		...restProps
	}: TriangleMatrixBaseProps = $props();

	const safeSpeed = $derived(speed > 0 ? speed : 1);
	const speedScale = $derived(1 / safeSpeed);
	const safeGridSize = $derived(Math.max(1, Math.floor(gridSize)));
	const gridCenter = $derived(Math.floor(safeGridSize / 2));
	const outerSize = $derived(Math.max(boxSize ?? size, minSize ?? 0, size));
	const fitPadding = $derived(Math.max(1, dotSize * 0.15));
	const drawableSize = $derived(Math.max(dotSize, outerSize - fitPadding));
	const explicitGap = $derived(cellPadding != null ? Math.max(0, cellPadding) : undefined);
	const colPitch = $derived(
		explicitGap != null ? dotSize + explicitGap : (drawableSize - dotSize) / (4 - 1)
	);
	const rowPitch = $derived(colPitch * Math.sqrt(3) * 0.5);
	const rawWidth = $derived(dotSize + colPitch * 3);
	const rawHeight = $derived(dotSize + rowPitch * (TRIANGLE_VISIBLE_ROW_COUNT - 1));
	const scale = $derived(
		Math.max(rawWidth, rawHeight) > 0 ? drawableSize / Math.max(rawWidth, rawHeight) : 1
	);
	const baseOpacity = $derived(clampUnitInterval(opacityBase));
	const midOpacity = $derived(clampUnitInterval(opacityMid));
	const peakOpacity = $derived(clampUnitInterval(opacityPeak));
	const allowedIndexes = $derived(
		activeIndexes
			? new Set(Array.from(activeIndexes))
			: new Set(TRIANGLE_COORDS.map(([row, col]) => triangleIndex(row, col)))
	);

	const matrixClass = $derived(
		cn(
			"dmx-root",
			muted && "dmx-muted",
			isBloomRootActive(bloom, halo) && "dmx-bloom",
			getBloomHaloSpreadClass(halo)
		)
	);

	const wrapperStyle = $derived.by(() =>
		mergeStyles(
			styleEntriesToString({
				display: "inline-flex",
				"align-items": "center",
				"justify-content": "center",
				width: stylePx(outerSize),
				height: stylePx(outerSize),
				overflow: "hidden",
			}),
			normalizeStyle(userStyle)
		)
	);

	const rootStyle = $derived(
		styleEntriesToString({
			width: stylePx(rawWidth),
			height: stylePx(rawHeight),
			"--dmx-speed": speedScale,
			"--dmx-dot-size": stylePx(dotSize),
			color,
			position: "relative",
			transform: `scale(${scale})`,
			"transform-origin": "center center",
			...(baseOpacity !== undefined && { "--dmx-opacity-base": baseOpacity }),
			...(midOpacity !== undefined && { "--dmx-opacity-mid": midOpacity }),
			...(peakOpacity !== undefined && { "--dmx-opacity-peak": peakOpacity }),
		})
	);

	const dots = $derived.by(() =>
		TRIANGLE_ROW_GROUPS.flatMap((rowGroup, rowIndex) => {
			const activeRowGroup = rowGroup.filter(([row, col]) =>
				allowedIndexes.has(triangleIndex(row, col))
			);
			const rowWidth = dotSize + colPitch * Math.max(0, activeRowGroup.length - 1);
			const rowStart = (rawWidth - rowWidth) / 2;

			return activeRowGroup.flatMap(([row, col], colIndex) => {
				const index = triangleIndex(row, col);
				const left = rowStart + colIndex * colPitch;
				const top = rowIndex * rowPitch;
				const centeredX = left + dotSize / 2 - rawWidth / 2;
				const centeredY = top + dotSize / 2 - rawHeight / 2;
				const distance = Math.hypot(centeredX, centeredY);
				const angle = Math.atan2(centeredY, centeredX);
				const maxRadius = Math.hypot(rawWidth / 2, rawHeight / 2);
				const radius = maxRadius > 0 ? distance / maxRadius : 0;
				const manhattan = manhattanDistance(row, col, gridCenter);
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
							isActive: true,
							reducedMotion,
						})
					: {};
				const stylePatch = animationState.style ? { ...animationState.style } : {};
				const rawOpacity =
					typeof stylePatch.opacity === "number" ? stylePatch.opacity : undefined;
				let isBloomDot = false;

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
				}

				return [
					{
						index,
						className: cn(
							"dmx-dot",
							isBloomDot && "dmx-bloom-dot",
							dotClass,
							animationState.className
						),
						style: styleEntriesToString({
							position: "absolute",
							left: stylePx(left),
							top: stylePx(top),
							width: stylePx(dotSize),
							height: stylePx(dotSize),
							"--dmx-distance": distance,
							"--dmx-row": row,
							"--dmx-col": col,
							"--dmx-x": stylePx(centeredX),
							"--dmx-y": stylePx(centeredY),
							"--dmx-angle": angle,
							"--dmx-radius": radius,
							"--dmx-manhattan": manhattan,
							...stylePatch,
						}),
					},
				];
			});
		})
	);
</script>

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
		<div class="dmx-triangle-grid">
			{#each dots as dot (dot.index)}
				<span aria-hidden="true" class={dot.className} style={dot.style}></span>
			{/each}
		</div>
	</div>
</div>

<style>
	.dmx-triangle-grid {
		position: relative;
		width: 100%;
		height: 100%;
	}
</style>
