import { MATRIX_SIZE } from "./geometry.js";

export function stylePx(value: number): string {
	return `${value}px`;
}

export function styleOpacity(opacity: number): number {
	return Math.round(opacity * 1e6) / 1e6;
}

export function styleEntriesToString(
	entries: Record<string, string | number | undefined>
): string | undefined {
	const tokens = Object.entries(entries)
		.filter(([, value]) => value !== undefined && value !== null && value !== "")
		.map(
			([key, value]) => `${key}: ${typeof value === "number" ? styleOpacity(value) : value}`
		);

	return tokens.length > 0 ? tokens.join("; ") : undefined;
}

export function getMatrixLayout(
	size: number,
	dotSize: number,
	cellPadding?: number,
	gridSize = MATRIX_SIZE
): { gap: number; matrixSpan: number } {
	if (cellPadding != null) {
		const gap = Math.max(0, cellPadding);
		const matrixSpan = dotSize * gridSize + gap * (gridSize - 1);
		return { gap, matrixSpan };
	}

	const gap = Math.max(1, Math.floor((size - dotSize * gridSize) / (gridSize - 1)));
	return { gap, matrixSpan: size };
}

export function resolveBoxLayout(
	options: { boxSize?: number; minSize?: number } | null | undefined
): { outerDim: number; useWrapper: boolean } {
	const boxSize = options?.boxSize;
	const hasBoxSize = boxSize != null && boxSize > 0 && Number.isFinite(boxSize);

	if (!hasBoxSize) {
		return { outerDim: 0, useWrapper: false };
	}

	const minSize = options?.minSize;

	if (minSize != null && minSize > 0 && Number.isFinite(minSize)) {
		return { outerDim: Math.max(boxSize, minSize), useWrapper: true };
	}

	return { outerDim: boxSize, useWrapper: true };
}
