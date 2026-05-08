import type { DotMatrixPhase } from "$lib/components/dot-matrix/types.js";

import { resolveSafeSpeed } from "./timing.js";

export interface DotMatrixPhaseControllerOptions {
	animated: () => boolean;
	hoverAnimated: () => boolean;
	speed?: () => number;
}

export interface DotMatrixPhaseController {
	readonly phase: DotMatrixPhase;
	onMouseEnter: () => void;
	onMouseLeave: () => void;
}

export function createDotMatrixPhaseController({
	animated,
	hoverAnimated,
	speed = () => 1,
}: DotMatrixPhaseControllerOptions): DotMatrixPhaseController {
	let hoverPhase = $state<DotMatrixPhase>("idle");
	let timeouts: number[] = [];
	let hoverGeneration = 0;

	const autoRun = $derived(Boolean(animated() && !hoverAnimated()));

	function clearTimers() {
		for (const timeout of timeouts) {
			window.clearTimeout(timeout);
		}

		timeouts = [];
	}

	$effect(() => {
		autoRun;
		hoverAnimated();
		hoverGeneration += 1;
		clearTimers();

		return () => {
			clearTimers();
		};
	});

	const onMouseEnter = () => {
		if (!hoverAnimated() || autoRun) {
			return;
		}

		clearTimers();
		const generation = ++hoverGeneration;
		hoverPhase = "collapse";

		const collapseMs = Math.max(1, Math.round(300 / resolveSafeSpeed(speed())));
		const timeout = window.setTimeout(() => {
			if (hoverGeneration !== generation) {
				return;
			}

			hoverPhase = "hoverRipple";
		}, collapseMs);

		timeouts.push(timeout);
	};

	const onMouseLeave = () => {
		if (!hoverAnimated() || autoRun) {
			return;
		}

		hoverGeneration += 1;
		clearTimers();
		hoverPhase = "idle";
	};

	const phase = $derived<DotMatrixPhase>(
		autoRun ? "loadingRipple" : hoverAnimated() ? hoverPhase : "idle"
	);

	return {
		get phase() {
			return phase;
		},
		onMouseEnter,
		onMouseLeave,
	};
}
