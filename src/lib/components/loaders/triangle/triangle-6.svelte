<script lang="ts">
	import TriangleMatrixBase from "./triangle-base.svelte";
	import type {
		DotAnimationResolver,
		DotMatrixCommonProps,
	} from "$lib/components/dot-matrix/types.js";
	import {
		createCycleProgress,
		createDotMatrixPhaseController,
		createReducedMotionQuery,
	} from "$lib/hooks/dot-matrix/index.js";

	import {
		TRIANGLE_ACTIVE_INDEXES,
		TRIANGLE_MATRIX_SIZE,
		isWithinTriangleMask,
	} from "./shared.js";

	export type Triangle6Props = DotMatrixCommonProps;

	const D1 = 0x01;
	const D2 = 0x02;
	const D3 = 0x04;
	const D4 = 0x08;
	const D5 = 0x10;
	const D6 = 0x20;
	const LOW_OPACITY = 0.07;
	const MID_OPACITY = 0.36;
	const HIGH_OPACITY = 0.96;
	const WAVE_HALF = 0.82;
	const INTRO_PHASE = 0.52;
	const BLINK_PHASE = 0.36;
	const RESET_PHASE = 0.12;
	const BIT_TO_FILL_INDEX: Record<number, number> = {
		[D1]: 0,
		[D2]: 1,
		[D3]: 2,
		[D4]: 3,
		[D5]: 4,
		[D6]: 5,
	};

	function smoothstep01(edge0: number, edge1: number, x: number): number {
		if (edge1 <= edge0) {
			return x >= edge1 ? 1 : 0;
		}

		const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
		return t * t * (3 - 2 * t);
	}

	function waveFills(introT: number): number[] {
		const waveCenter = -WAVE_HALF + introT * (5 + 2 * WAVE_HALF);
		return [0, 1, 2, 3, 4, 5].map((index) =>
			smoothstep01(index - WAVE_HALF, index + WAVE_HALF, waveCenter)
		);
	}

	function brailleBitForTriangle(row: number, col: number): number | null {
		if (row === 2 && col === 2) return D1;
		if (row === 3 && col === 1) return D2;
		if (row === 4 && col === 0) return D3;
		if (row === 2 && col === 4) return D4;
		if (row === 3 && col === 5) return D5;
		if (row === 4 && col === 6) return D6;
		return null;
	}

	function meanFills(indices: readonly number[], fills: readonly number[]): number {
		let sum = 0;
		for (const index of indices) {
			sum += fills[index] ?? 0;
		}
		return sum / indices.length;
	}

	function opacityForCell(
		row: number,
		col: number,
		fills: readonly number[],
		blinkMul: number,
		resetMul: number
	): number {
		const lift = (base: number) => LOW_OPACITY + (base - LOW_OPACITY) * blinkMul * resetMul;
		const bit = brailleBitForTriangle(row, col);

		if (bit !== null) {
			const idx = BIT_TO_FILL_INDEX[bit] ?? 0;
			const raw = LOW_OPACITY + (HIGH_OPACITY - LOW_OPACITY) * (fills[idx] ?? 0);
			return lift(raw);
		}

		if (row === 1 && col === 3) {
			const mean = meanFills([0, 3], fills);
			const raw =
				LOW_OPACITY +
				(HIGH_OPACITY - LOW_OPACITY) * mean * 0.92 +
				(MID_OPACITY - LOW_OPACITY) * (1 - mean) * 0.35;
			return lift(Math.min(HIGH_OPACITY, raw));
		}

		if (row === 3 && col === 3) {
			const mean = meanFills([0, 1, 2, 3, 4, 5], fills);
			const raw =
				LOW_OPACITY +
				(HIGH_OPACITY - LOW_OPACITY) * mean * 0.88 +
				(MID_OPACITY - LOW_OPACITY) * (1 - mean) * 0.4;
			return lift(Math.min(HIGH_OPACITY, raw));
		}

		if (row === 4 && col === 2) {
			return lift(
				LOW_OPACITY + (MID_OPACITY + 0.28 - LOW_OPACITY) * meanFills([1, 2], fills)
			);
		}

		if (row === 4 && col === 4) {
			return lift(
				LOW_OPACITY + (MID_OPACITY + 0.28 - LOW_OPACITY) * meanFills([4, 5], fills)
			);
		}

		return LOW_OPACITY;
	}

	function cycleParams(phase: number): { fills: number[]; blinkMul: number; resetMul: number } {
		if (phase < INTRO_PHASE) {
			return { fills: waveFills(phase / INTRO_PHASE), blinkMul: 1, resetMul: 1 };
		}

		if (phase < INTRO_PHASE + BLINK_PHASE) {
			const blinkPhase = (phase - INTRO_PHASE) / BLINK_PHASE;
			const on = Math.floor(blinkPhase * 4) % 2 === 0;
			return {
				fills: [1, 1, 1, 1, 1, 1],
				blinkMul: on ? 1 : 0.08,
				resetMul: 1,
			};
		}

		const resetPhase = (phase - INTRO_PHASE - BLINK_PHASE) / RESET_PHASE;
		return {
			fills: [1, 1, 1, 1, 1, 1],
			blinkMul: 1,
			resetMul: 1 - smoothstep01(0, 1, resetPhase),
		};
	}

	let {
		onmouseenter,
		onmouseleave,
		speed = 1,
		pattern = "full",
		animated = true,
		hoverAnimated = false,
		size = 30,
		cellPadding = 2,
		dotSize = 6,
		...restProps
	}: Triangle6Props = $props();

	const reducedMotionQuery = createReducedMotionQuery();
	const reducedMotion = $derived(reducedMotionQuery.current);
	const phaseController = createDotMatrixPhaseController({
		animated: () => Boolean(animated && !reducedMotion),
		hoverAnimated: () => Boolean(hoverAnimated && !reducedMotion),
		speed: () => speed,
	});

	const cycleProgress = createCycleProgress({
		active: () => !reducedMotion && phaseController.phase !== "idle",
		cycleMsBase: () => 3000,
		speed: () => speed,
	});

	const animationResolver = $derived.by((): DotAnimationResolver => {
		const params =
			reducedMotion || phaseController.phase === "idle"
				? {
						fills: [0.55, 0.55, 0.55, 0.55, 0.55, 0.55],
						blinkMul: 1,
						resetMul: 1,
					}
				: cycleParams(cycleProgress.current);

		return ({ isActive, row, col }) => {
			if (!isActive || !isWithinTriangleMask(row, col)) {
				return { className: "dmx-inactive" };
			}

			return {
				style: {
					opacity: opacityForCell(
						row,
						col,
						params.fills,
						params.blinkMul,
						params.resetMul
					),
				},
			};
		};
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

<TriangleMatrixBase
	{speed}
	{pattern}
	{animated}
	{hoverAnimated}
	{size}
	{dotSize}
	gridSize={TRIANGLE_MATRIX_SIZE}
	activeIndexes={TRIANGLE_ACTIVE_INDEXES}
	phase={phaseController.phase}
	{reducedMotion}
	{animationResolver}
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
	{...restProps}
/>
