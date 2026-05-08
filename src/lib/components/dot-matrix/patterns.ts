import { GRID_RANGE, MATRIX_CENTER, MATRIX_SIZE, indexToCoord, rowMajorIndex } from "./geometry.js";
import type { DotMatrixPattern } from "./types.js";

export const FULL_INDEXES = GRID_RANGE.flatMap((row) =>
	GRID_RANGE.map((col) => rowMajorIndex(row, col))
);

export const DIAMOND_INDEXES = FULL_INDEXES.filter((index) => {
	const { row, col } = indexToCoord(index);
	return Math.abs(row - MATRIX_CENTER) + Math.abs(col - MATRIX_CENTER) <= 2;
});

export const OUTLINE_INDEXES = FULL_INDEXES.filter((index) => {
	const { row, col } = indexToCoord(index);
	return row === 0 || row === MATRIX_SIZE - 1 || col === 0 || col === MATRIX_SIZE - 1;
});

export const CROSS_INDEXES = FULL_INDEXES.filter((index) => {
	const { row, col } = indexToCoord(index);
	return row === MATRIX_CENTER || col === MATRIX_CENTER;
});

export const RINGS_INDEXES = FULL_INDEXES.filter((index) => {
	const { row, col } = indexToCoord(index);
	const radius = Math.hypot(row - MATRIX_CENTER, col - MATRIX_CENTER);
	return Math.round(radius) === 1 || Math.round(radius) === 2;
});

export const ROSE_INDEXES = FULL_INDEXES.filter((index) => {
	const { row, col } = indexToCoord(index);
	const dx = col - MATRIX_CENTER;
	const dy = row - MATRIX_CENTER;
	const angle = Math.atan2(dy, dx);
	const radius = Math.hypot(dx, dy);
	const rose = Math.abs(Math.sin(3 * angle));

	return rose > 0.6 && radius >= 1;
});

const PATTERN_INDEXES: Record<DotMatrixPattern, number[]> = {
	diamond: DIAMOND_INDEXES,
	full: FULL_INDEXES,
	outline: OUTLINE_INDEXES,
	rose: ROSE_INDEXES,
	cross: CROSS_INDEXES,
	rings: RINGS_INDEXES,
};

export function getPatternIndexes(pattern: DotMatrixPattern = "diamond"): number[] {
	return PATTERN_INDEXES[pattern];
}
