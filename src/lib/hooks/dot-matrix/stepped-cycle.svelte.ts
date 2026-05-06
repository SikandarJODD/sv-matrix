import { subscribeFrame } from "./raf.js";
import { resolveCycleDuration, resolveSafeSpeed } from "./timing.js";

export interface SteppedCycleOptions {
	active: () => boolean;
	cycleMsBase: () => number;
	steps: () => number;
	speed?: () => number;
	idleStep?: () => number;
}

export interface SteppedCycleController {
	readonly current: number;
}

function resolveSafeSteps(steps: number): number {
	return Math.max(1, Math.floor(steps));
}

export function createSteppedCycle({
	active,
	cycleMsBase,
	steps,
	speed = () => 1,
	idleStep = () => 0,
}: SteppedCycleOptions): SteppedCycleController {
	let current = $state(0);

	$effect(() => {
		const safeSteps = resolveSafeSteps(steps());
		const safeIdleStep = idleStep();

		if (!active()) {
			current = safeIdleStep;
			return;
		}

		const safeSpeed = resolveSafeSpeed(speed());
		const cycleMs = resolveCycleDuration(cycleMsBase(), safeSpeed);
		const stepMs = Math.max(1, cycleMs / safeSteps);
		let start = 0;
		let ready = false;
		let lastStep = safeIdleStep;

		current = 0;

		return subscribeFrame((now) => {
			if (!ready) {
				start = now;
				ready = true;
			}

			const elapsed = Math.max(0, now - start);
			const nextStep = Math.floor((elapsed % cycleMs) / stepMs) % safeSteps;

			if (nextStep !== lastStep) {
				lastStep = nextStep;
				current = nextStep;
			}
		});
	});

	return {
		get current() {
			return current;
		},
	};
}
