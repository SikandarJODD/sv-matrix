export const ROW_COUNTS = [3, 4, 5, 4, 3] as const;
export const HEX_ROW_PITCH_RATIO = Math.sqrt(3) / 2;

export interface HexCellDefinition {
	id: string;
	row: number;
	col: number;
	count: number;
	index: number;
}

export interface HexCellStyle {
	[key: string]: string | number | undefined;
}

export interface HexCellState extends HexCellDefinition {
	isActive: boolean;
	opacity: number;
	style?: HexCellStyle;
}

export type HexTone = "x" | "o";

export function hexPatternIndex(row: number, rowCount: number, col: number): number {
	return row * ROW_COUNTS[2] + Math.floor((ROW_COUNTS[2] - rowCount) / 2) + col;
}

export const HEX_ROWS: readonly HexCellDefinition[][] = ROW_COUNTS.map((count, row) =>
	Array.from({ length: count }, (_, col) => ({
		id: `${row},${col}`,
		row,
		col,
		count,
		index: hexPatternIndex(row, count, col),
	}))
);

export const HEX_CELLS: readonly HexCellDefinition[] = HEX_ROWS.flat();

export function getHexLayout(
	size: number,
	dotSize: number,
	cellPadding?: number
): {
	gap: number;
	rowGap: number;
	matrixWidth: number;
	matrixHeight: number;
	matrixSpan: number;
} {
	const gap =
		cellPadding != null
			? Math.max(0, cellPadding)
			: Math.max(1, Math.floor((size - dotSize * ROW_COUNTS[2]) / (ROW_COUNTS[2] - 1)));
	const colPitch = dotSize + gap;
	const rowGap = Math.max(1, colPitch * HEX_ROW_PITCH_RATIO - dotSize);
	const matrixWidth = dotSize * ROW_COUNTS[2] + gap * (ROW_COUNTS[2] - 1);
	const matrixHeight = dotSize * ROW_COUNTS.length + rowGap * (ROW_COUNTS.length - 1);

	return {
		gap,
		rowGap,
		matrixWidth,
		matrixHeight,
		matrixSpan: Math.max(matrixWidth, matrixHeight),
	};
}

export function pointForCell(row: number, col: number): { x: number; y: number } {
	const count = ROW_COUNTS[row] ?? 1;

	return {
		x: col - (count - 1) / 2,
		y: (row - 2) * HEX_ROW_PITCH_RATIO,
	};
}

export function buildHexCells(
	activePatternIndexes: Set<number>,
	resolveOpacity: (cell: HexCellDefinition) => number,
	resolveStyle?: (cell: HexCellDefinition) => HexCellStyle | undefined
): HexCellState[] {
	return HEX_CELLS.map((cell) => {
		const isActive = activePatternIndexes.has(cell.index);

		return {
			...cell,
			isActive,
			opacity: isActive ? resolveOpacity(cell) : 0,
			style: resolveStyle?.(cell),
		};
	});
}
