const SOURCE_BASE_OPACITY = 0.08;
const SOURCE_MID_OPACITY = 0.34;
const SOURCE_PEAK_OPACITY = 0.94;

export const DOT_MATRIX_BLOOM_OPACITY_MIN = 0.6;

function lerp(start: number, end: number, progress: number): number {
	return start + (end - start) * progress;
}

function normalizeProgress(value: number, start: number, end: number): number {
	const span = end - start;

	if (Math.abs(span) < Number.EPSILON) {
		return 0;
	}

	return Math.min(1, Math.max(0, (value - start) / span));
}

function coerceOpacity(value: number | undefined): number | undefined {
	if (value == null || !Number.isFinite(value)) {
		return undefined;
	}

	return Math.min(1, Math.max(0, value));
}

export function clampUnitInterval(value: number | undefined): number | undefined {
	if (value == null || !Number.isFinite(value)) {
		return undefined;
	}

	return Math.min(1, Math.max(0, value));
}

export function remapOpacityToTriplet(
	opacity: number,
	opacityBase: number | undefined,
	opacityMid: number | undefined,
	opacityPeak: number | undefined
): number {
	if (!Number.isFinite(opacity)) {
		return opacity;
	}

	const hasOverrides =
		opacityBase !== undefined || opacityMid !== undefined || opacityPeak !== undefined;
	const safeOpacity = Math.min(1, Math.max(0, opacity));

	if (!hasOverrides) {
		return safeOpacity;
	}

	const targetBase = coerceOpacity(opacityBase) ?? SOURCE_BASE_OPACITY;
	const targetMid = coerceOpacity(opacityMid) ?? SOURCE_MID_OPACITY;
	const targetPeak = coerceOpacity(opacityPeak) ?? SOURCE_PEAK_OPACITY;

	if (safeOpacity <= SOURCE_BASE_OPACITY) {
		const progress = normalizeProgress(safeOpacity, 0, SOURCE_BASE_OPACITY);
		return Math.min(1, Math.max(0, lerp(0, targetBase, progress)));
	}

	if (safeOpacity <= SOURCE_MID_OPACITY) {
		const progress = normalizeProgress(safeOpacity, SOURCE_BASE_OPACITY, SOURCE_MID_OPACITY);
		return Math.min(1, Math.max(0, lerp(targetBase, targetMid, progress)));
	}

	if (safeOpacity <= SOURCE_PEAK_OPACITY) {
		const progress = normalizeProgress(safeOpacity, SOURCE_MID_OPACITY, SOURCE_PEAK_OPACITY);
		return Math.min(1, Math.max(0, lerp(targetMid, targetPeak, progress)));
	}

	const progress = normalizeProgress(safeOpacity, SOURCE_PEAK_OPACITY, 1);
	return Math.min(1, Math.max(0, lerp(targetPeak, 1, progress)));
}

export function opacityToBloomLevel(remappedOpacity: number): number {
	return Math.max(
		0,
		Math.min(
			1,
			(remappedOpacity - DOT_MATRIX_BLOOM_OPACITY_MIN) / (1 - DOT_MATRIX_BLOOM_OPACITY_MIN)
		)
	);
}

export function qualifiesForBloom(remappedOpacity: number): boolean {
	return remappedOpacity >= DOT_MATRIX_BLOOM_OPACITY_MIN;
}

export function clampHalo(value: number | undefined): number {
	if (value == null || !Number.isFinite(value)) {
		return 0;
	}

	return Math.min(1, Math.max(0, value));
}

export function isBloomRootActive(bloom: boolean, halo: number | undefined): boolean {
	return bloom || clampHalo(halo) > 0;
}

export function getBloomHaloSpreadClass(halo: number | undefined): "dmx-bloom-halo" | undefined {
	return clampHalo(halo) > 0 ? "dmx-bloom-halo" : undefined;
}

export function getDotBloomParts(
	isActive: boolean,
	curveOpacity: number,
	bloom: boolean,
	halo: number | undefined,
	opacityBase: number | undefined,
	opacityMid: number | undefined,
	opacityPeak: number | undefined
): { level: number; bloomDot: boolean } {
	const haloLevel = clampHalo(halo);

	if (!isActive) {
		return { level: 0, bloomDot: false };
	}

	const remappedOpacity = remapOpacityToTriplet(
		curveOpacity,
		opacityBase,
		opacityMid,
		opacityPeak
	);
	const bloomLevel = bloom ? opacityToBloomLevel(remappedOpacity) : 0;

	return {
		level: Math.max(haloLevel, bloomLevel),
		bloomDot: haloLevel > 0 || (bloom && qualifiesForBloom(remappedOpacity)),
	};
}
