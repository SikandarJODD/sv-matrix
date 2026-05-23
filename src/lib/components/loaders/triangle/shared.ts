export const TRIANGLE_MATRIX_SIZE = 7;
export const TRIANGLE_VISIBLE_ROW_START = 1;
export const TRIANGLE_VISIBLE_ROW_END = 4;
export const TRIANGLE_VISIBLE_ROW_COUNT = TRIANGLE_VISIBLE_ROW_END - TRIANGLE_VISIBLE_ROW_START + 1;

export const TRIANGLE_COORDS = [
	[1, 3],
	[2, 2],
	[2, 4],
	[3, 1],
	[3, 3],
	[3, 5],
	[4, 0],
	[4, 2],
	[4, 4],
	[4, 6],
] as const satisfies ReadonlyArray<readonly [number, number]>;

export function triangleIndex(row: number, col: number): number {
	return row * TRIANGLE_MATRIX_SIZE + col;
}

export const TRIANGLE_ACTIVE_INDEXES = TRIANGLE_COORDS.map(([row, col]) => triangleIndex(row, col));

const TRIANGLE_KEYS = new Set(TRIANGLE_COORDS.map(([row, col]) => `${row},${col}`));

export function isWithinTriangleMask(row: number, col: number): boolean {
	if (row < 0 || row >= TRIANGLE_MATRIX_SIZE || col < 0 || col >= TRIANGLE_MATRIX_SIZE) {
		return false;
	}

	return TRIANGLE_KEYS.has(`${row},${col}`);
}
