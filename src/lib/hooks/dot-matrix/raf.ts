export type FrameListener = (now: number) => void;

const listeners = new Set<FrameListener>();
let rafId: number | null = null;

function emit(now: number) {
	for (const listener of listeners) {
		listener(now);
	}
}

function tick(now: number) {
	emit(now);

	if (listeners.size > 0) {
		rafId = window.requestAnimationFrame(tick);
	} else {
		rafId = null;
	}
}

export function subscribeFrame(listener: FrameListener): () => void {
	listeners.add(listener);

	if (rafId === null) {
		rafId = window.requestAnimationFrame(tick);
	}

	return () => {
		listeners.delete(listener);

		if (listeners.size === 0 && rafId !== null) {
			window.cancelAnimationFrame(rafId);
			rafId = null;
		}
	};
}
