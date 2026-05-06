import type { HTMLAttributes } from "svelte/elements";

import type { WithElementRef, WithoutChildren } from "$lib/utils.js";

export type DotMatrixPattern = "diamond" | "full" | "outline" | "rose" | "cross" | "rings";
export type DotMatrixPhase = "idle" | "collapse" | "hoverRipple" | "loadingRipple";
export type DotMatrixAnimation = "none" | "path-wave";

export interface DotMatrixOptions {
	animation?: DotMatrixAnimation;
	size?: number;
	dotSize?: number;
	color?: string;
	speed?: number;
	pattern?: DotMatrixPattern;
	muted?: boolean;
	bloom?: boolean;
	halo?: number;
	animated?: boolean;
	hoverAnimated?: boolean;
	dotClass?: string;
	opacityBase?: number;
	opacityMid?: number;
	opacityPeak?: number;
	cellPadding?: number;
	boxSize?: number;
	minSize?: number;
}

export type DotMatrixProps = WithoutChildren<WithElementRef<HTMLAttributes<HTMLDivElement>>> &
	DotMatrixOptions;

export type DotMatrixCommonProps = Omit<DotMatrixProps, "animation">;

export interface DotAnimationContext {
	index: number;
	row: number;
	col: number;
	distanceFromCenter: number;
	angleFromCenter: number;
	radiusNormalized: number;
	manhattanDistance: number;
	phase: DotMatrixPhase;
	isActive: boolean;
	reducedMotion: boolean;
}

export type DotAnimationStyle = Record<string, string | number | undefined>;

export interface DotAnimationState {
	className?: string;
	style?: DotAnimationStyle;
}

export type DotAnimationResolver = (ctx: DotAnimationContext) => DotAnimationState;
