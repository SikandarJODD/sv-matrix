export const MATRIX_SIZE = 5;
export const MATRIX_CENTER = Math.floor(MATRIX_SIZE / 2);
const RANGE = Array.from({ length: MATRIX_SIZE }, (_, index) => index);
const MAX_RADIUS = Math.hypot(MATRIX_CENTER, MATRIX_CENTER);

const GRID_SIDE = MATRIX_SIZE;
const GRID_CENTER = Math.floor(MATRIX_SIZE / 2);
const CELL_COUNT = GRID_SIDE * GRID_SIDE;
const MAX_TOP_RIGHT_BOTTOM_LEFT = (GRID_SIDE - 1) * 2;
const CORNER_COORDINATES = new Set(["0,0", "0,4", "4,0", "4,4"]);

export function rowMajorIndex(row: number, col: number): number {
	return row * MATRIX_SIZE + col;
}

export function indexToCoord(index: number): { row: number; col: number } {
	return {
		row: Math.floor(index / MATRIX_SIZE),
		col: index % MATRIX_SIZE,
	};
}

export function distanceFromCenter(index: number): number {
	const { row, col } = indexToCoord(index);
	return Math.hypot(row - MATRIX_CENTER, col - MATRIX_CENTER);
}

export function rowDistance(index: number): number {
	const { row } = indexToCoord(index);
	return Math.abs(row - MATRIX_CENTER);
}

export function polarAngle(index: number): number {
	const { row, col } = indexToCoord(index);
	return Math.atan2(row - MATRIX_CENTER, col - MATRIX_CENTER);
}

export function normalizedRadius(index: number): number {
	const { row, col } = indexToCoord(index);
	return Math.hypot(row - MATRIX_CENTER, col - MATRIX_CENTER) / MAX_RADIUS;
}

export function manhattanDistance(index: number): number {
	const { row, col } = indexToCoord(index);
	return Math.abs(row - MATRIX_CENTER) + Math.abs(col - MATRIX_CENTER);
}

export function harmonicPhase(row: number, col: number, a: number, b: number): number {
	return Math.sin((row + 1) * a + (col + 1) * b);
}

export function lissajousOffset(
	row: number,
	col: number,
	amplitude = 2.25
): { x: number; y: number; phase: number } {
	const x = Math.sin((row + 1) * 1.15 + (col + 1) * 2.2) * amplitude;
	const y = Math.cos((row + 1) * 2.45 + (col + 1) * 0.95) * amplitude;
	const phase = Math.abs(Math.sin((row + 1) * 0.7 + (col + 1) * 1.1));

	return { x, y, phase };
}

export function spiralOffset(
	angle: number,
	radiusNormalizedValue: number,
	amplitude = 2.8
): { x: number; y: number; phase: number } {
	const spin = angle + radiusNormalizedValue * Math.PI * 2.1;
	const radius = radiusNormalizedValue * amplitude;
	const x = Math.cos(spin) * radius;
	const y = Math.sin(spin) * radius;
	const phase = Math.abs(Math.sin(spin * 0.5));

	return { x, y, phase };
}

export function isPrime(value: number): boolean {
	if (value <= 1) {
		return false;
	}

	if (value === 2) {
		return true;
	}

	if (value % 2 === 0) {
		return false;
	}

	const limit = Math.floor(Math.sqrt(value));

	for (let divisor = 3; divisor <= limit; divisor += 2) {
		if (value % divisor === 0) {
			return false;
		}
	}

	return true;
}

export function trBlPathNormFromIndex(index: number): number {
	const { row, col } = indexToCoord(index);
	return (row + (GRID_SIDE - 1 - col)) / MAX_TOP_RIGHT_BOTTOM_LEFT;
}

function buildSnakeOrderToIndexMap(): number[] {
	const pathOrder = new Array<number>(CELL_COUNT);
	let step = 0;

	for (let row = 0; row < GRID_SIDE; row += 1) {
		if (row % 2 === 0) {
			for (let col = 0; col < GRID_SIDE; col += 1) {
				pathOrder[rowMajorIndex(row, col)] = step;
				step += 1;
			}
		} else {
			for (let col = GRID_SIDE - 1; col >= 0; col -= 1) {
				pathOrder[rowMajorIndex(row, col)] = step;
				step += 1;
			}
		}
	}

	return pathOrder;
}

const SNAKE_ORDER: readonly number[] = buildSnakeOrderToIndexMap();

export function snakePathNormFromIndex(index: number): number {
	return SNAKE_ORDER[index]! / (CELL_COUNT - 1);
}

export function snakePathOrderValue(index: number): number {
	return SNAKE_ORDER[index]!;
}

function buildSpiralInwardOrderToIndexMap(): number[] {
	const order = new Array<number>(CELL_COUNT);
	let top = 0;
	let bottom = GRID_SIDE - 1;
	let left = 0;
	let right = GRID_SIDE - 1;
	let step = 0;

	while (top <= bottom && left <= right) {
		for (let col = left; col <= right; col += 1) {
			order[rowMajorIndex(top, col)] = step;
			step += 1;
		}

		for (let row = top + 1; row <= bottom; row += 1) {
			order[rowMajorIndex(row, right)] = step;
			step += 1;
		}

		if (top < bottom) {
			for (let col = right - 1; col >= left; col -= 1) {
				order[rowMajorIndex(bottom, col)] = step;
				step += 1;
			}
		}

		if (left < right) {
			for (let row = bottom - 1; row > top; row -= 1) {
				order[rowMajorIndex(row, left)] = step;
				step += 1;
			}
		}

		top += 1;
		bottom -= 1;
		left += 1;
		right -= 1;
	}

	return order;
}

const SPIRAL_INWARD_ORDER: readonly number[] = buildSpiralInwardOrderToIndexMap();

export function spiralInwardNormFromIndex(index: number): number {
	return SPIRAL_INWARD_ORDER[index]! / (CELL_COUNT - 1);
}

export function spiralInwardOrderValue(index: number): number {
	return SPIRAL_INWARD_ORDER[index]!;
}

function buildOuterRingClockwiseOrderToIndexMap(): number[] {
	const order = new Array<number>(CELL_COUNT).fill(-1);
	const coords: Array<[number, number]> = [
		[0, 0],
		[0, 1],
		[0, 2],
		[0, 3],
		[0, 4],
		[1, 4],
		[2, 4],
		[3, 4],
		[4, 4],
		[4, 3],
		[4, 2],
		[4, 1],
		[4, 0],
		[3, 0],
		[2, 0],
		[1, 0],
	];

	for (let step = 0; step < coords.length; step += 1) {
		const [row, col] = coords[step]!;
		order[rowMajorIndex(row, col)] = step;
	}

	return order;
}

function buildMiddleRingAntiClockwiseOrderToIndexMap(): number[] {
	const order = new Array<number>(CELL_COUNT).fill(-1);
	const coords: Array<[number, number]> = [
		[1, 1],
		[2, 1],
		[3, 1],
		[3, 2],
		[3, 3],
		[2, 3],
		[1, 3],
		[1, 2],
	];

	for (let step = 0; step < coords.length; step += 1) {
		const [row, col] = coords[step]!;
		order[rowMajorIndex(row, col)] = step;
	}

	return order;
}

const OUTER_RING_CLOCKWISE_ORDER: readonly number[] = buildOuterRingClockwiseOrderToIndexMap();
const MIDDLE_RING_ANTI_CLOCKWISE_ORDER: readonly number[] =
	buildMiddleRingAntiClockwiseOrderToIndexMap();

export function outerRingClockwiseOrderValue(index: number): number {
	return OUTER_RING_CLOCKWISE_ORDER[index]!;
}

export function outerRingClockwiseNormFromIndex(index: number): number {
	const order = outerRingClockwiseOrderValue(index);
	return order >= 0 ? order / 15 : 0;
}

export function middleRingAntiClockwiseOrderValue(index: number): number {
	return MIDDLE_RING_ANTI_CLOCKWISE_ORDER[index]!;
}

export function middleRingAntiClockwiseNormFromIndex(index: number): number {
	const order = middleRingAntiClockwiseOrderValue(index);
	return order >= 0 ? order / 7 : 0;
}

function buildDiagonalSnakeOrderToIndexMap(): number[] {
	const order = new Array<number>(CELL_COUNT);
	let step = 0;

	for (let diagonal = 0; diagonal <= (GRID_SIDE - 1) * 2; diagonal += 1) {
		const rowStart = Math.max(0, diagonal - (GRID_SIDE - 1));
		const rowEnd = Math.min(GRID_SIDE - 1, diagonal);

		if (diagonal % 2 === 0) {
			for (let row = rowEnd; row >= rowStart; row -= 1) {
				const col = diagonal - row;
				order[rowMajorIndex(row, col)] = step;
				step += 1;
			}
		} else {
			for (let row = rowStart; row <= rowEnd; row += 1) {
				const col = diagonal - row;
				order[rowMajorIndex(row, col)] = step;
				step += 1;
			}
		}
	}

	return order;
}

const DIAGONAL_SNAKE_ORDER: readonly number[] = buildDiagonalSnakeOrderToIndexMap();

export function diagonalSnakeOrderValue(index: number): number {
	return DIAGONAL_SNAKE_ORDER[index]!;
}

export function diagonalSnakeNormFromIndex(index: number): number {
	return DIAGONAL_SNAKE_ORDER[index]! / (CELL_COUNT - 1);
}

function buildRowWaveSnakeOrderToIndexMap(): number[] {
	const order = new Array<number>(CELL_COUNT);
	const route: Array<{ col: number; dir: "up" | "down" }> = [
		{ col: 0, dir: "up" },
		{ col: 2, dir: "down" },
		{ col: 1, dir: "up" },
		{ col: 3, dir: "down" },
		{ col: 2, dir: "up" },
		{ col: 4, dir: "down" },
	];

	let step = 0;

	for (const routeStep of route) {
		if (routeStep.dir === "up") {
			for (let row = GRID_SIDE - 1; row >= 0; row -= 1) {
				order[rowMajorIndex(row, routeStep.col)] = step;
				step += 1;
			}
		} else {
			for (let row = 0; row < GRID_SIDE; row += 1) {
				order[rowMajorIndex(row, routeStep.col)] = step;
				step += 1;
			}
		}
	}

	return order;
}

const ROW_WAVE_SNAKE_ORDER: readonly number[] = buildRowWaveSnakeOrderToIndexMap();
const ROW_WAVE_SNAKE_MAX_ORDER = Math.max(...ROW_WAVE_SNAKE_ORDER);

export function rowWaveOrderValue(index: number): number {
	return ROW_WAVE_SNAKE_ORDER[index]!;
}

export function rowWaveNormFromIndex(index: number): number {
	return ROW_WAVE_SNAKE_MAX_ORDER > 0 ? rowWaveOrderValue(index) / ROW_WAVE_SNAKE_MAX_ORDER : 0;
}

export function colWaveNormFromIndex(index: number): number {
	const { col } = indexToCoord(index);
	return GRID_SIDE > 1 ? col / (GRID_SIDE - 1) : 0;
}

export function concentricRingNormFromIndex(index: number): number {
	const { row, col } = indexToCoord(index);
	return Math.max(Math.abs(row - GRID_CENTER), Math.abs(col - GRID_CENTER)) / GRID_CENTER;
}

export function isWithinCircularMask(row: number, col: number): boolean {
	return !CORNER_COORDINATES.has(`${row},${col}`);
}

export const GRID_RANGE = RANGE;
