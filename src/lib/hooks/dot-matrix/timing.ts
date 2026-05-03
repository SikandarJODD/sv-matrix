export function resolveSafeSpeed(speed: number | undefined): number {
	return speed != null && speed > 0 ? speed : 1;
}

export function resolveCycleDuration(cycleMsBase: number, speed: number | undefined): number {
	const rawDuration = cycleMsBase / resolveSafeSpeed(speed);
	return rawDuration > 0 && Number.isFinite(rawDuration) ? rawDuration : 1000;
}
