import { subscribeFrame } from "./raf.js";
import { resolveCycleDuration } from "./timing.js";

export interface CycleProgressOptions {
	active: () => boolean;
	cycleMsBase: () => number;
	speed?: () => number;
}

export interface CycleProgressController {
	readonly current: number;
}

export function createCycleProgress({
	active,
	cycleMsBase,
	speed = () => 1,
}: CycleProgressOptions): CycleProgressController {
	let current = $state(0);

	$effect(() => {
		if (!active()) {
			current = 0;
			return;
		}

		const cycleMs = resolveCycleDuration(cycleMsBase(), speed());
		let start = 0;
		let ready = false;

		return subscribeFrame((now) => {
			if (!ready) {
				start = now;
				ready = true;
			}

			const elapsed = (((now - start) % cycleMs) + cycleMs) % cycleMs;
			current = elapsed / cycleMs;
		});
	});

	return {
		get current() {
			return current;
		},
	};
}
