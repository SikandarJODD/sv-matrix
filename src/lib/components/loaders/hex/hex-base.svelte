<script lang="ts">
	import clsx from "clsx";
	import type { ClassValue } from "svelte/elements";
	import {
		resolveBoxLayout,
		styleEntriesToString,
		stylePx,
	} from "$lib/components/dot-matrix/layout.js";
	import {
		clampUnitInterval,
		getBloomHaloSpreadClass,
		getDotBloomParts,
		isBloomRootActive,
		remapOpacityToTriplet,
	} from "$lib/components/dot-matrix/opacity.js";
	import type { DotMatrixCommonProps } from "$lib/components/dot-matrix/types.js";

	import { getHexLayout, HEX_ROWS, type HexCellState } from "./shared.js";

	import "$lib/styles/dot-matrix.css";

	interface HexMatrixBaseProps extends DotMatrixCommonProps {
		cells: HexCellState[];
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

	let {
		cells,
		ref = $bindable(null),
		class: className,
		style: userStyle,
		role = "status",
		"aria-live": ariaLive = "polite",
		"aria-label": ariaLabel = "Loading",
		onmouseenter,
		onmouseleave,
		size = 33,
		dotSize = 5,
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
		animated = undefined,
		hoverAnimated = undefined,
		...restProps
	}: HexMatrixBaseProps = $props();

	const safeSpeed = $derived(speed > 0 ? speed : 1);
	const speedScale = $derived(1 / safeSpeed);
	const layout = $derived(getHexLayout(size, dotSize, cellPadding));
	const boxLayout = $derived(resolveBoxLayout({ boxSize, minSize }));
	const scale = $derived(
		boxLayout.useWrapper && layout.matrixSpan > 0 ? boxLayout.outerDim / layout.matrixSpan : 1
	);
	const baseOpacity = $derived(clampUnitInterval(opacityBase));
	const midOpacity = $derived(clampUnitInterval(opacityMid));
	const peakOpacity = $derived(clampUnitInterval(opacityPeak));

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
				width: stylePx(layout.matrixWidth),
				height: stylePx(layout.matrixHeight),
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
			gap: stylePx(layout.rowGap),
		})
	);

	const cellsById = $derived(new Map(cells.map((cell) => [cell.id, cell] as const)));

	const renderedRows = $derived.by(() =>
		HEX_ROWS.map((row) =>
			row.map((definition) => {
				const cell = cellsById.get(definition.id) ?? {
					...definition,
					isActive: false,
					opacity: 0,
					style: undefined,
				};
				const stylePatch = cell.style ? { ...cell.style } : {};
				let isBloomDot = false;

				if (cell.isActive) {
					const bloomParts = getDotBloomParts(
						true,
						cell.opacity,
						bloom,
						halo,
						baseOpacity,
						midOpacity,
						peakOpacity
					);

					stylePatch.opacity = remapOpacityToTriplet(
						cell.opacity,
						baseOpacity,
						midOpacity,
						peakOpacity
					);
					stylePatch["--dmx-bloom-level"] = bloomParts.level;
					isBloomDot = bloomParts.bloomDot;
				} else {
					stylePatch.opacity = 0;
					stylePatch.visibility = "hidden";
					stylePatch["pointer-events"] = "none";
					stylePatch.animation = "none";
				}

				return {
					id: cell.id,
					className: cn(
						"dmx-dot",
						!cell.isActive && "dmx-inactive",
						isBloomDot && "dmx-bloom-dot",
						dotClass
					),
					style: styleEntriesToString({
						width: stylePx(dotSize),
						height: stylePx(dotSize),
						...stylePatch,
					}),
				};
			})
		)
	);
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
			<div class="dmx-hex-grid" style={gridStyle}>
				{#each renderedRows as row, rowIndex (rowIndex)}
					<div
						class="dmx-hex-row"
						style={styleEntriesToString({
							gap: stylePx(layout.gap),
						})}
					>
						{#each row as cell (cell.id)}
							<span aria-hidden="true" class={cell.className} style={cell.style}
							></span>
						{/each}
					</div>
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
		<div class="dmx-hex-grid" style={gridStyle}>
			{#each renderedRows as row, rowIndex (rowIndex)}
				<div
					class="dmx-hex-row"
					style={styleEntriesToString({
						gap: stylePx(layout.gap),
					})}
				>
					{#each row as cell (cell.id)}
						<span aria-hidden="true" class={cell.className} style={cell.style}></span>
					{/each}
				</div>
			{/each}
		</div>
	</div>
{/if}

<style>
	.dmx-hex-grid {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.dmx-hex-row {
		display: flex;
		justify-content: center;
	}
</style>
