<script lang="ts">
	import DotMatrixBase from "$lib/components/dot-matrix/dot-matrix-base.svelte";
	import type {
		DotAnimationResolver,
		DotMatrixCommonProps,
	} from "$lib/components/dot-matrix/types.js";
	import {
		createDotMatrixPhaseController,
		createReducedMotionQuery,
	} from "$lib/hooks/dot-matrix/index.js";

	export type Square9Props = DotMatrixCommonProps;

	const D1 = 0x01;
	const D2 = 0x02;
	const D3 = 0x04;
	const D4 = 0x08;
	const D5 = 0x10;
	const D6 = 0x20;
	const CHECK_A = D1 | D3 | D5;
	const BASE_OPACITY = 0.08;
	const MID_OPACITY = 0.26;
	const GAP_OPACITY = 0.12;
	const CELL_ROW_START = 1;
	const LEFT_COL = 0;
	const RIGHT_CELL_COL = 3;

	function brailleBitForCell(row: number, col: number, cellColStart: number): number | null {
		if (row < CELL_ROW_START || row > CELL_ROW_START + 2) {
			return null;
		}

		const deltaRow = row - CELL_ROW_START;

		if (col === cellColStart) {
			return D1 << deltaRow;
		}

		if (col === cellColStart + 1) {
			return D4 << deltaRow;
		}

		return null;
	}

	function resolveBraille(row: number, col: number): { bit: number } | null {
		const left = brailleBitForCell(row, col, LEFT_COL);
		if (left !== null) {
			return { bit: left };
		}

		const right = brailleBitForCell(row, col, RIGHT_CELL_COL);
		if (right !== null) {
			return { bit: right };
		}

		return null;
	}

	const animationResolver: DotAnimationResolver = ({
		isActive,
		row,
		col,
		reducedMotion,
		phase,
	}) => {
		if (!isActive) {
			return { className: "dmx-inactive" };
		}

		const braille = resolveBraille(row, col);
		const isGapColumn = row >= CELL_ROW_START && row <= CELL_ROW_START + 2 && col === 2;

		if (reducedMotion || phase === "idle") {
			if (braille) {
				const isOn = (CHECK_A & braille.bit) !== 0;
				return { style: { opacity: isOn ? MID_OPACITY : BASE_OPACITY } };
			}

			if (isGapColumn) {
				return { style: { opacity: GAP_OPACITY } };
			}

			return { style: { opacity: BASE_OPACITY } };
		}

		if (isGapColumn) {
			return { style: { opacity: GAP_OPACITY } };
		}

		if (!braille) {
			return { style: { opacity: BASE_OPACITY } };
		}

		let bitClass = "dmx-square9-d1";
		if (braille.bit === D2) {
			bitClass = "dmx-square9-d2";
		} else if (braille.bit === D3) {
			bitClass = "dmx-square9-d3";
		} else if (braille.bit === D4) {
			bitClass = "dmx-square9-d4";
		} else if (braille.bit === D5) {
			bitClass = "dmx-square9-d5";
		} else if (braille.bit === D6) {
			bitClass = "dmx-square9-d6";
		}

		return { className: `dmx-square9-bit ${bitClass}` };
	};

	let {
		onmouseenter,
		onmouseleave,
		speed = 1.5,
		pattern = "full",
		animated = true,
		hoverAnimated = false,
		size = 29,
		dotSize = 5,
		...restProps
	}: Square9Props = $props();

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
